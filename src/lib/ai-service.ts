/**
 * AI Service — Claude (Anthropic) + Gemini (Google) + Replicate Integration
 *
 * Claude Haiku: routine per-session analysis (cheap)
 * Claude Sonnet: periodic deep review every 10 sessions
 * Gemini 2.0 Flash: visual theme generation (free)
 * Replicate: illustration generation for dashboard/games (optional)
 *
 * Budget cap: $10/month enforced via ai_usage table.
 * All features gracefully fallback to static content.
 */

import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  CognitiveProfile, GameType, InterestArea,
  AIGeneratedContent, AISessionAnalysis, AITheme,
} from '@/types';
import { trackAIUsage, getMonthlyAICost } from './db';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHLY_BUDGET_USD = 10.0;
const BUDGET_SAFETY_MARGIN = 0.50;
const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const SONNET_MODEL = 'claude-sonnet-4-6';
const GEMINI_MODEL = 'gemini-2.0-flash';

// ─── Client initialization (lazy, server-side only) ───────────────────────────

function getAnthropicClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

function getGeminiClient(): GoogleGenerativeAI | null {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

function hasAnthropic(): boolean { return !!process.env.ANTHROPIC_API_KEY; }
function hasGemini(): boolean { return !!process.env.GOOGLE_AI_API_KEY; }
function hasReplicate(): boolean { return !!process.env.REPLICATE_API_TOKEN; }

// ─── Budget enforcement ────────────────────────────────────────────────────────

async function withinBudget(): Promise<boolean> {
  try {
    const spent = await getMonthlyAICost();
    return spent < (MONTHLY_BUDGET_USD - BUDGET_SAFETY_MARGIN);
  } catch {
    return true;
  }
}

function selectModel(sessionCount: number): string {
  return sessionCount > 0 && sessionCount % 10 === 0 ? SONNET_MODEL : HAIKU_MODEL;
}

// ─── Low-level Claude caller ──────────────────────────────────────────────────

async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  opts: { model?: string; maxTokens?: number; userId?: number | null; purpose?: string }
): Promise<string> {
  const client = getAnthropicClient();
  if (!client) throw new Error('No Anthropic key configured');

  const model = opts.model || HAIKU_MODEL;
  const maxTokens = opts.maxTokens || 1024;

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const inputTokens = message.usage.input_tokens;
  const outputTokens = message.usage.output_tokens;
  trackAIUsage(opts.userId ?? null, model, inputTokens, outputTokens, opts.purpose || 'general').catch(() => {});

  const block = message.content[0];
  return block.type === 'text' ? block.text : '';
}

// ─── Low-level Gemini caller ──────────────────────────────────────────────────

async function callGemini(
  prompt: string,
  opts: { userId?: number | null; purpose?: string }
): Promise<string> {
  const client = getGeminiClient();
  if (!client) throw new Error('No Google AI key configured');

  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024, responseMimeType: 'application/json' },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const usage = result.response.usageMetadata;
  if (usage) {
    trackAIUsage(
      opts.userId ?? null,
      GEMINI_MODEL,
      usage.promptTokenCount || 0,
      usage.candidatesTokenCount || 0,
      opts.purpose || 'general'
    ).catch(() => {});
  }

  return text;
}

// ─── JSON parsing helper ──────────────────────────────────────────────────────

function parseJSON<T>(raw: string, fallback: T): T {
  try {
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.warn('AI returned non-JSON, using fallback. Preview:', raw.slice(0, 200));
    return fallback;
  }
}

// ─── Replicate Image Generation ────────────────────────────────────────────────

export async function generateDashboardImage(
  interests: InterestArea[],
  userId?: number
): Promise<string | null> {
  if (!hasReplicate()) return null;

  try {
    // Dynamic import to avoid build errors when replicate is not installed
    const Replicate = (await import('replicate')).default;
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const topInterest = interests[0] || 'nature';
    const promptMap: Record<string, string> = {
      history: 'A warm, painterly illustration of ancient columns and golden scrolls, soft morning light, oil painting style, cream and amber tones',
      nature: 'A serene forest path with dappled sunlight through tall trees, impressionist painting style, warm greens and golds',
      music: 'A grand piano in a sunlit conservatory, vintage illustration style, warm amber and ivory tones',
      cooking: 'A rustic kitchen with fresh herbs and warm bread on a wooden table, watercolor style, warm ochre and cream',
      travel: 'Rolling countryside hills with distant mountains, warm afternoon light, impressionist style, greens and blues',
      science: 'A beautiful star map with nebulas and constellations, deep blue and gold tones, vintage scientific illustration',
      sports: 'An open meadow with morning light, watercolor style, fresh greens and sky blue',
      art: 'An artist\'s studio with canvases and warm afternoon light, impressionist painting style, warm colors',
      animals: 'A peaceful woodland clearing with deer and soft morning mist, watercolor illustration style',
      current_events: 'A warm library reading room with tall windows and morning light, detailed illustration style',
      literature: 'A cozy library with leather armchairs, tall bookshelves, warm lamplight, detailed illustration',
      puzzles: 'An elegant study with a chess board and warm evening light, detailed painterly style',
    };

    const imagePrompt = promptMap[topInterest] || promptMap.nature;

    const output = await replicate.run('black-forest-labs/flux-schnell', {
      input: {
        prompt: imagePrompt + ', no text, no people, no faces, peaceful, beautiful',
        width: 1024,
        height: 512,
        num_outputs: 1,
        go_fast: true,
        megapixels: '1',
        output_format: 'webp',
        output_quality: 80,
      },
    });

    const urls = output as string[];
    return urls?.[0] || null;
  } catch (err) {
    console.error('Replicate image generation failed:', err);
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function analyzeSession(sessionData: {
  gameType: GameType;
  accuracy: number;
  duration: number;
  difficulty: number;
  score: number;
  sessionCount?: number;
  userId?: number;
  recentHistory?: Array<{ gameType: string; accuracy: number; difficulty: number; feedback?: any }>;
  interests?: InterestArea[];
  surveyHighlights?: string;
}): Promise<AISessionAnalysis> {
  if (!hasAnthropic() || !(await withinBudget())) {
    return deterministic_analyzeSession(sessionData);
  }

  const model = selectModel(sessionData.sessionCount || 0);
  const historyText = sessionData.recentHistory?.slice(0, 10)
    .map(s => `  - ${s.gameType}: ${s.accuracy}% accuracy at difficulty ${s.difficulty}`)
    .join('\n') || '  (no prior history)';

  const systemPrompt = `You are a compassionate brain training coach for adults aged 70-90. Give warm, specific, personalized feedback. Never be generic or condescending. Respond with valid JSON only.`;

  const userPrompt = `A senior user just finished a brain training session:

Game: ${sessionData.gameType}
Score: ${sessionData.score} | Accuracy: ${sessionData.accuracy}% | Duration: ${sessionData.duration}s | Difficulty: ${sessionData.difficulty}/5
Interests: ${sessionData.interests?.join(', ') || 'not set'}

Recent history:
${historyText}

Return JSON:
{
  "difficultyAdjustment": { "newDifficulty": <1-5>, "reason": "<warm sentence>" },
  "recommendations": ["<tip 1>", "<tip 2>"],
  "encouragement": "<1-2 specific, personal sentences>"
}

Rules: accuracy >85% → consider +1 difficulty; accuracy <45% → consider -1; otherwise same. Be warm and specific.`;

  try {
    const raw = await callClaude(systemPrompt, userPrompt, {
      model,
      maxTokens: 512,
      userId: sessionData.userId,
      purpose: 'session_analysis',
    });
    const parsed = parseJSON<AISessionAnalysis>(raw, deterministic_analyzeSession(sessionData));
    if (parsed.difficultyAdjustment) {
      parsed.difficultyAdjustment.newDifficulty = Math.max(1, Math.min(5, parsed.difficultyAdjustment.newDifficulty));
    }
    return parsed;
  } catch (err) {
    console.error('Claude session analysis failed:', err);
    return deterministic_analyzeSession(sessionData);
  }
}

export async function runSessionPipeline(data: {
  userId: number;
  sessionId: number;
  gameType: GameType;
  accuracy: number;
  duration: number;
  difficulty: number;
  score: number;
  feedback?: { enjoyment: number; difficulty: string; playAgain: string };
  recentHistory: Array<{ gameType: string; accuracy: number; difficulty: number; score: number; feedback?: any; createdAt?: string }>;
  profile: { dimensions: CognitiveProfile; interests: InterestArea[]; difficultyLevel: number };
  surveyResponses?: Array<{ question_id: string; answer_id: string }>;
  sessionCount: number;
}): Promise<{
  encouragement: string;
  sessionSummary: string;
  gameRecommendations: Array<{ gameType: string; reason: string; priorityBoost: number }>;
  insights: string;
}> {
  const fallback = {
    encouragement: deterministic_analyzeSession({ accuracy: data.accuracy, difficulty: data.difficulty }).encouragement,
    sessionSummary: `You played ${data.gameType.replace(/-/g, ' ')} and scored ${data.score} points with ${data.accuracy}% accuracy.`,
    gameRecommendations: [],
    insights: '',
  };

  if (!hasAnthropic() || !(await withinBudget())) {
    return fallback;
  }

  const model = selectModel(data.sessionCount);
  const isDeepReview = model === SONNET_MODEL;

  const historyText = data.recentHistory.slice(0, 15).map(s =>
    `  - ${s.gameType}: ${s.accuracy}% accuracy, difficulty ${s.difficulty}, score ${s.score}`
  ).join('\n') || '  (first session!)';

  const feedbackText = data.feedback
    ? `Post-game: enjoyment ${data.feedback.enjoyment}/5, felt ${data.feedback.difficulty}, play again: ${data.feedback.playAgain}`
    : 'No feedback provided.';

  const systemPrompt = `You are a compassionate AI coach for MindBloom, a brain training app for seniors (ages 70-90). ${isDeepReview ? 'This is a deep review — be richer and more personal.' : 'Give warm, concise feedback.'} Use simple language. JSON only.`;

  const userPrompt = `Analyze this brain training session.

USER: Interests: ${data.profile.interests.join(', ')}. Session #${data.sessionCount}.
THIS SESSION: ${data.gameType} | Score: ${data.score} | Accuracy: ${data.accuracy}% | Duration: ${data.duration}s | ${feedbackText}

RECENT HISTORY:
${historyText}

GAMES: story-detective, memory-journey, word-weaver, number-flow, era-quiz, pattern-garden, knowledge-quiz

Return JSON:
{
  "encouragement": "<1-2 warm, specific sentences about THIS session>",
  "sessionSummary": "<1 sentence natural summary for dashboard>",
  "gameRecommendations": [{ "gameType": "<id>", "reason": "<why>", "priorityBoost": <-30 to +30> }],
  "insights": "<${isDeepReview ? '2-3 sentences about cognitive trends' : '1 observation about progress'}>"
}`;

  try {
    const raw = await callClaude(systemPrompt, userPrompt, {
      model,
      maxTokens: isDeepReview ? 800 : 600,
      userId: data.userId,
      purpose: isDeepReview ? 'deep_review' : 'session_pipeline',
    });

    const parsed = parseJSON<typeof fallback & { gameRecommendations: any[] }>(raw, fallback);
    return {
      encouragement: parsed.encouragement || fallback.encouragement,
      sessionSummary: parsed.sessionSummary || fallback.sessionSummary,
      gameRecommendations: parsed.gameRecommendations || [],
      insights: parsed.insights || '',
    };
  } catch (err) {
    console.error('Claude pipeline failed:', err);
    return fallback;
  }
}

export async function generatePersonalizedContent(
  profile: { dimensions: CognitiveProfile; interests: InterestArea[]; preferredEra?: string },
  gameType: GameType,
  difficulty: number
): Promise<AIGeneratedContent> {
  const empty: AIGeneratedContent = { rounds: [], theme: profile.interests[0] || 'general' };

  if (!hasAnthropic() || !(await withinBudget())) return empty;

  const systemPrompt = `You are a content generator for MindBloom, a brain training app for seniors (ages 70-90). Generate warm, age-appropriate game content. Always respond with valid JSON only.`;

  const interests = profile.interests.join(', ');
  const era = profile.preferredEra || 'general';

  const prompts: Partial<Record<GameType, string>> = {
    'story-detective': `Generate 3 short story passages (3-4 sentences each) with deliberate factual errors for a senior brain training game.
User interests: ${interests}. Era preference: ${era}. Difficulty: ${difficulty}/5.
Return JSON:
{ "rounds": [{ "passage": "<text>", "sentences": ["s1","s2","s3","s4"], "errorIndices": [2], "errors": [{"sentenceIndex": 2, "issue": "<explanation>"}], "theme": "${interests.split(',')[0]?.trim()}" }] }
Make errors subtle (difficulty 1-2: obvious factual mistakes; 3-4: more nuanced errors; 5: very subtle). Theme stories around user interests. Each passage has 1-2 errors.`,

    'word-weaver': `Generate 2 word grouping puzzles with 12 words each (4 groups of 3 words) for a senior brain training game.
User interests: ${interests}. Difficulty: ${difficulty}/5.
Return JSON:
{ "rounds": [{ "words": ["w1",...,"w12"], "groups": [{"label":"<label>","words":["w1","w2","w3"],"color":"blue"},{"label":"...","words":["w4","w5","w6"],"color":"green"},{"label":"...","words":["w7","w8","w9"],"color":"amber"},{"label":"...","words":["w10","w11","w12"],"color":"rose"}] }] }
Groups should be clearly themed but take some thought to find. Avoid ambiguous words. Use user interests as themes.`,

    'number-flow': `Generate 6 real-world math scenarios for a senior brain training game.
User interests: ${interests}. Difficulty: ${difficulty}/5.
Return JSON:
{ "rounds": [{ "scenario": "<context sentence>", "question": "<question>", "answer": <number>, "options": [<n1>,<n2>,<n3>,<n4>], "correctIndex": <0-3>, "unit": "$" }] }
Difficulty 1: simple addition/subtraction. Difficulty 2-3: two-step problems or decimals. Difficulty 4-5: percentage, ratio, multi-step.
Make scenarios relate to user interests (cooking → recipe amounts, travel → distances/costs, etc.).`,

    'era-quiz': `Generate 8 trivia questions about the era "${era}" themed around: ${interests}. Target audience: seniors.
Return JSON:
{ "rounds": [{ "question": "<q>", "options": ["A","B","C","D"], "correctIndex": <0-3>, "era": "${era}", "funFact": "<interesting fact>", "category": "<topic>" }] }
Questions should feel familiar and rewarding, not trick questions. Include a warm, interesting fun fact with each.`,

    'knowledge-quiz': `Generate 8 trivia questions themed around: ${interests}. Target audience: seniors who enjoy learning.
Return JSON:
{ "rounds": [{ "question": "<q>", "options": ["A","B","C","D"], "correctIndex": <0-3>, "category": "<topic>", "funFact": "<interesting fact>" }] }
Difficulty ${difficulty}/5. Keep language clear and warm. Fun facts should be genuinely interesting.`,

    'word-scramble': `Generate 8 word scramble rounds for difficulty ${difficulty}/5.
User interests: ${interests}.
Return JSON:
{ "rounds": [{ "word": "GARDEN", "hint": "Where flowers grow", "category": "nature" }], "theme": "${interests.split(',')[0]?.trim()}" }
Words: 4-5 letters for difficulty 1-2, 6-7 for 3-4, 8-9 for 5.`,

    'word-connection': `Generate 8 word analogy rounds for difficulty ${difficulty}/5.
User interests: ${interests}.
Return JSON:
{ "rounds": [{ "prompt": "Dog is to puppy as cat is to...", "options": ["Kitten","Cub","Foal","Calf"], "correctIndex": 0, "category": "nature" }] }
Always 4 options. Increase abstraction with difficulty.`,
  };

  const prompt = prompts[gameType];
  if (!prompt) return empty;

  try {
    const raw = await callClaude(systemPrompt, prompt, {
      model: HAIKU_MODEL,
      maxTokens: 2000,
      purpose: 'content_generation',
    });
    const parsed = parseJSON<AIGeneratedContent>(raw, empty);
    if (parsed.rounds && parsed.rounds.length > 0) return parsed;
    return empty;
  } catch (err) {
    console.error('Claude content generation failed:', err);
    return empty;
  }
}

export async function generateVisualTheme(
  profile: { dimensions: CognitiveProfile; interests: InterestArea[] },
  userId?: number
): Promise<AITheme> {
  const fallback = deterministic_generateTheme(profile);

  const prompt = `You are a designer creating warm, sophisticated color themes for a brain training app used by seniors.

User interests: ${profile.interests.join(', ')}.
Cognitive strengths: verbal=${profile.dimensions.verbal}, logical=${profile.dimensions.logical}, spatial=${profile.dimensions.spatial}, memory=${profile.dimensions.memory}.

Create a rich color theme and return JSON (no extra text):
{
  "primaryColor": "<hex — warm, sophisticated, not too bright>",
  "accentColor": "<hex — complements primary>",
  "bgColor": "<hex — very light warm background, near-white>",
  "greeting": "<warm, personalized 6-10 word greeting referencing their interests>",
  "description": "<one sentence describing the palette mood>"
}

For nature lovers: deep forest greens, warm amber, cream.
For history buffs: rich burgundy, warm gold, parchment.
For music lovers: deep indigo, warm rose, ivory.
For cooking: warm terracotta, sage green, cream.
Avoid harsh neons. Colors must work on light backgrounds.`;

  if (hasGemini()) {
    try {
      const raw = await callGemini(prompt, { userId, purpose: 'visual_theme' });
      const parsed = parseJSON<AITheme>(raw, fallback);
      if (parsed.primaryColor && parsed.greeting) return parsed;
    } catch (err) {
      console.warn('Gemini theme generation failed, trying Claude:', err);
    }
  }

  if (hasAnthropic() && await withinBudget()) {
    try {
      const raw = await callClaude(
        'You are a designer creating accessible color themes. Respond with valid JSON only.',
        prompt,
        { model: HAIKU_MODEL, maxTokens: 256, userId, purpose: 'visual_theme' }
      );
      return parseJSON<AITheme>(raw, fallback);
    } catch (err) {
      console.error('Claude theme generation failed:', err);
    }
  }

  return fallback;
}

export async function generateBrainTodayCard(data: {
  userId: number;
  recentSessions: Array<{ gameType: string; accuracy: number; duration: number; score: number; createdAt: string }>;
  profile: { interests: InterestArea[]; dimensions: CognitiveProfile };
}): Promise<{ headline: string; body: string } | null> {
  if (!hasAnthropic() || !(await withinBudget())) return null;
  if (data.recentSessions.length === 0) return null;

  const last = data.recentSessions[0];
  const lastWeek = data.recentSessions.slice(0, 7);
  const avgAccuracy = Math.round(lastWeek.reduce((s, r) => s + r.accuracy, 0) / lastWeek.length);

  const systemPrompt = `You are a warm, insightful brain training coach writing a personalized daily brain health note for a senior. Be specific, warm, and encouraging. No generic platitudes. Never condescending. JSON only.`;

  const userPrompt = `Write a "Your Brain Today" card for this senior user.

Most recent session: ${last.gameType.replace(/-/g, ' ')}, ${last.accuracy}% accuracy, ${Math.round(last.duration / 60)} minutes
Recent avg accuracy (${lastWeek.length} sessions): ${avgAccuracy}%
Top interests: ${data.profile.interests.slice(0, 3).join(', ')}

Return JSON:
{
  "headline": "<10-15 word specific observation about today, e.g. 'Your word recognition was sharp today — top 20% of your sessions'>",
  "body": "<2-3 sentences of warm, specific insight. Reference actual numbers or game names. Not generic.>"
}`;

  try {
    const raw = await callClaude(systemPrompt, userPrompt, {
      model: HAIKU_MODEL,
      maxTokens: 300,
      userId: data.userId,
      purpose: 'brain_today_card',
    });
    return parseJSON<{ headline: string; body: string }>(raw, null as any);
  } catch {
    return null;
  }
}

export async function generateSmartRecommendations(data: {
  userId: number;
  profile: { dimensions: CognitiveProfile; interests: InterestArea[] };
  recentHistory: Array<{ gameType: string; accuracy: number; difficulty: number; feedback?: any }>;
  surveyResponses?: Array<{ question_id: string; answer_id: string }>;
}): Promise<Array<{ gameType: string; reason: string; priorityBoost: number }>> {
  if (!hasAnthropic() || !(await withinBudget())) return [];

  const historyText = data.recentHistory.slice(0, 20).map(s =>
    `${s.gameType}: ${s.accuracy}% acc, diff ${s.difficulty}${s.feedback ? ` (${s.feedback.enjoyment}★, ${s.feedback.difficulty})` : ''}`
  ).join('; ') || 'no history';

  const systemPrompt = `You are an adaptive learning AI for MindBloom. Analyze user data and suggest game priorities. JSON only.`;

  const userPrompt = `User interests: ${data.profile.interests.join(', ')}
Profile: verbal=${data.profile.dimensions.verbal}, logical=${data.profile.dimensions.logical}, spatial=${data.profile.dimensions.spatial}, memory=${data.profile.dimensions.memory}
Recent sessions: ${historyText}
Available games: story-detective, memory-journey, word-weaver, number-flow, era-quiz, pattern-garden, knowledge-quiz

Return JSON array:
[{ "gameType": "<id>", "reason": "<1 sentence why>", "priorityBoost": <-20 to +20> }]

Boost games aligned with interests and strengths. Reduce games user dislikes. Include all 7 games.`;

  try {
    const raw = await callClaude(systemPrompt, userPrompt, {
      model: HAIKU_MODEL,
      maxTokens: 512,
      userId: data.userId,
      purpose: 'smart_recommendations',
    });
    return parseJSON<Array<{ gameType: string; reason: string; priorityBoost: number }>>(raw, []);
  } catch (err) {
    console.error('Claude smart recommendations failed:', err);
    return [];
  }
}

// ─── Deterministic fallbacks ───────────────────────────────────────────────────

function deterministic_analyzeSession(sessionData: {
  accuracy: number;
  difficulty: number;
}): AISessionAnalysis {
  let encouragement = '';
  let difficultyChange = 0;

  if (sessionData.accuracy > 85) {
    encouragement = 'Excellent work — your mind is firing on all cylinders today.';
    difficultyChange = 1;
  } else if (sessionData.accuracy > 65) {
    encouragement = "Really solid performance. You're right in the sweet spot of learning.";
  } else if (sessionData.accuracy < 45) {
    encouragement = "Keep going — every session builds your mental strength, even the tough ones.";
    difficultyChange = -1;
  } else {
    encouragement = 'Good steady work. Consistency is what builds a sharp mind.';
  }

  return {
    difficultyAdjustment: {
      newDifficulty: Math.max(1, Math.min(5, sessionData.difficulty + difficultyChange)),
      reason: encouragement,
    },
    recommendations: [
      'Try a different type of game to exercise different parts of your brain',
      'Regular short sessions work better than occasional long ones',
    ],
    encouragement,
  };
}

function deterministic_generateTheme(
  profile: { interests: InterestArea[] }
): AITheme {
  const themes: Record<string, AITheme> = {
    history: { primaryColor: '#8B4513', accentColor: '#C4956A', bgColor: '#FFF8F0', greeting: 'Welcome, keeper of history', description: 'Rich parchment and warm amber tones' },
    nature: { primaryColor: '#2D6A4F', accentColor: '#74A57F', bgColor: '#F0F7F4', greeting: 'Welcome to your garden of learning', description: 'Deep forest greens and natural warmth' },
    music: { primaryColor: '#4A235A', accentColor: '#7D5BA6', bgColor: '#F7F0FF', greeting: 'Welcome, where learning sings', description: 'Rich indigo and soft violet tones' },
    science: { primaryColor: '#1A365D', accentColor: '#3B82F6', bgColor: '#EFF6FF', greeting: 'Welcome to your laboratory of the mind', description: 'Deep navy and bright discovery' },
    cooking: { primaryColor: '#9A3412', accentColor: '#D97706', bgColor: '#FFF7ED', greeting: 'Welcome to your kitchen of knowledge', description: 'Warm terracotta and golden amber' },
    sports: { primaryColor: '#166534', accentColor: '#22C55E', bgColor: '#F0FDF4', greeting: 'Welcome, champion of the mind', description: 'Bold greens and energetic tones' },
    travel: { primaryColor: '#1E40AF', accentColor: '#0EA5E9', bgColor: '#EFF6FF', greeting: 'Welcome, explorer of ideas', description: 'Sky blue and ocean depth' },
    literature: { primaryColor: '#6B21A8', accentColor: '#A855F7', bgColor: '#FAF5FF', greeting: 'Welcome, dear reader', description: 'Literary purple and warm ivory' },
    cooking_alt: { primaryColor: '#92400E', accentColor: '#D97706', bgColor: '#FFFBEB', greeting: 'Welcome to a world of flavour', description: 'Warm amber and honey tones' },
    default: { primaryColor: '#1E3A5F', accentColor: '#4A90D9', bgColor: '#F8FAFC', greeting: 'Welcome back — great to see you', description: 'Calm blue and warm neutral' },
  };
  const topInterest = profile.interests[0] || 'default';
  return themes[topInterest] || themes.default;
}
