/**
 * AI Service — Claude (Anthropic) + Gemini (Google) Integration
 *
 * Claude Haiku: routine per-session analysis (cheap, ~$0.001/session)
 * Claude Sonnet: periodic deep review every 10 sessions (better reasoning)
 * Gemini 2.0 Flash: visual theme generation (effectively free at this scale)
 *
 * Budget cap: $10/month enforced via ai_usage table.
 * Graceful fallback to deterministic engine when budget exceeded or API down.
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
const BUDGET_SAFETY_MARGIN = 0.50; // Stop at $9.50 to leave headroom
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

// ─── Provider detection ────────────────────────────────────────────────────────

function hasAnthropic(): boolean { return !!process.env.ANTHROPIC_API_KEY; }
function hasGemini(): boolean { return !!process.env.GOOGLE_AI_API_KEY; }

// ─── Budget enforcement ────────────────────────────────────────────────────────

async function withinBudget(): Promise<boolean> {
  try {
    const spent = await getMonthlyAICost();
    return spent < (MONTHLY_BUDGET_USD - BUDGET_SAFETY_MARGIN);
  } catch {
    return true; // If we can't check, allow (fail open — Claude itself is the gate)
  }
}

// ─── Model selection ──────────────────────────────────────────────────────────

/**
 * Choose model based on session count.
 * Every 10th session gets a deeper Sonnet review; all others use Haiku.
 */
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

  // Track usage + cost asynchronously (don't block on it)
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

  // Gemini usage tracking (token data is approximate / not always available)
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

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Analyze a completed session with full history context.
 * Returns personalized encouragement, recommendations, and difficulty adjustments.
 * Falls back to deterministic logic if API unavailable or budget exceeded.
 */
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
    .map(s => `  • ${s.gameType}: ${s.accuracy}% accuracy at difficulty ${s.difficulty}${s.feedback ? ` (rated ${s.feedback.enjoyment}★, felt ${s.feedback.difficulty})` : ''}`)
    .join('\n') || '  (no prior history)';

  const systemPrompt = `You are a compassionate brain training coach for elderly users (ages 70–90). Analyze game performance and give genuinely warm, personalized feedback. Keep language simple and encouraging. Never be condescending. Respond with valid JSON only — no extra text.`;

  const userPrompt = `A senior user just finished a brain training session:

Game: ${sessionData.gameType}
Score: ${sessionData.score} | Accuracy: ${sessionData.accuracy}% | Duration: ${sessionData.duration}s | Difficulty: ${sessionData.difficulty}/5
${sessionData.interests?.length ? `Interests: ${sessionData.interests.join(', ')}` : ''}
${sessionData.surveyHighlights ? `Personality: ${sessionData.surveyHighlights}` : ''}

Recent session history:
${historyText}

Return JSON:
{
  "difficultyAdjustment": {
    "newDifficulty": <1-5 integer>,
    "reason": "<one warm sentence explaining the change>"
  },
  "recommendations": ["<tip 1 tailored to their history>", "<tip 2>"],
  "encouragement": "<1-2 sentences of genuine, personalized encouragement>"
}

Rules:
- accuracy > 85%: consider +1 difficulty (max 5)
- accuracy < 45%: consider -1 difficulty (min 1)
- otherwise: keep same difficulty
- Use their interests/history for personalized tips
- Be warm and specific, not generic`;

  try {
    const raw = await callClaude(systemPrompt, userPrompt, {
      model,
      maxTokens: 512,
      userId: sessionData.userId,
      purpose: 'session_analysis',
    });
    const parsed = parseJSON<AISessionAnalysis>(raw, deterministic_analyzeSession(sessionData));
    // Clamp difficulty
    if (parsed.difficultyAdjustment) {
      parsed.difficultyAdjustment.newDifficulty = Math.max(1, Math.min(5, parsed.difficultyAdjustment.newDifficulty));
    }
    return parsed;
  } catch (err) {
    console.error('Claude session analysis failed:', err);
    return deterministic_analyzeSession(sessionData);
  }
}

/**
 * Run a full AI analysis pipeline for a user after session completion.
 * Returns enriched analysis including session summary, game recommendations, and insights.
 */
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
    `  • ${s.gameType}: ${s.accuracy}% accuracy, difficulty ${s.difficulty}, score ${s.score}${s.feedback ? ` (enjoyment: ${s.feedback.enjoyment}★, felt: ${s.feedback.difficulty}, play again: ${s.feedback.playAgain})` : ''}`
  ).join('\n') || '  (first session!)';

  const surveyText = data.surveyResponses?.length
    ? `Survey answers (${data.surveyResponses.length} questions): ${data.surveyResponses.slice(0, 5).map(r => `${r.question_id}=${r.answer_id}`).join(', ')}...`
    : 'No survey completed yet.';

  const feedbackText = data.feedback
    ? `Post-game feedback: enjoyment ${data.feedback.enjoyment}/5, felt ${data.feedback.difficulty}, would play again: ${data.feedback.playAgain}`
    : 'No post-game feedback.';

  const systemPrompt = `You are a compassionate AI coach for MindBloom, a brain training app for seniors (ages 70–90). ${isDeepReview ? 'This is a periodic deep review — give richer, more personalized insights.' : 'Give warm, concise feedback.'} Always use simple language. Respond with valid JSON only.`;

  const userPrompt = `Analyze this brain training session and provide a complete coaching response.

USER PROFILE:
- Interests: ${data.profile.interests.join(', ') || 'not set'}
- Cognitive profile: verbal=${data.profile.dimensions.verbal}, logical=${data.profile.dimensions.logical}, spatial=${data.profile.dimensions.spatial}, memory=${data.profile.dimensions.memory}
- ${surveyText}

CURRENT SESSION (#${data.sessionCount}):
- Game: ${data.gameType} | Score: ${data.score} | Accuracy: ${data.accuracy}% | Duration: ${data.duration}s | Difficulty: ${data.difficulty}/5
- ${feedbackText}

RECENT HISTORY (newest first):
${historyText}

AVAILABLE GAMES: word-scramble, word-connection, memory-match, sequence-recall, pattern-finder, number-crunch, knowledge-quiz

Return JSON:
{
  "encouragement": "<1-2 warm, specific sentences about THIS session>",
  "sessionSummary": "<1 sentence natural language summary for the dashboard>",
  "gameRecommendations": [
    { "gameType": "<game-id>", "reason": "<why this game suits them now>", "priorityBoost": <-30 to +30> }
  ],
  "insights": "${isDeepReview ? '<2-3 sentences about their cognitive trends and progress>' : '<1 sentence observation about their progress>'}"
}

Guidelines:
- encouragement: personal to this session, reference their score or something specific
- gameRecommendations: 2-3 games, boost games that match their interests/strengths
- priorityBoost: positive = surface higher, negative = surface lower. Use 0 if neutral
- Be warm, never condescending, keep it simple`;

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

/**
 * Generate AI game content (trivia, word puzzles, etc.) personalized to user.
 */
export async function generatePersonalizedContent(
  profile: { dimensions: CognitiveProfile; interests: InterestArea[] },
  gameType: GameType,
  difficulty: number
): Promise<AIGeneratedContent> {
  const empty: AIGeneratedContent = { rounds: [], theme: profile.interests[0] || 'general' };

  if (!hasAnthropic() || !(await withinBudget())) return empty;

  const systemPrompt = `You are a content generator for MindBloom, a brain training app for seniors (ages 70–90). Generate warm, encouraging, age-appropriate game content. Always respond with valid JSON only — no explanation text.`;

  const prompts: Record<GameType, string> = {
    'word-scramble': `Generate 8 word scramble rounds for difficulty ${difficulty}/5.
User interests: ${profile.interests.join(', ')}.
Return JSON: { "rounds": [{ "word": "GARDEN", "hint": "Where flowers grow", "category": "nature" }], "theme": "nature" }
Words should be 4-9 letters. Difficulty 1-2: common 4-5 letter words. Difficulty 3-4: 6-7 letter words. Difficulty 5: 8-9 letter words.`,

    'word-connection': `Generate 8 word connection rounds for difficulty ${difficulty}/5.
User interests: ${profile.interests.join(', ')}.
Return JSON: { "rounds": [{ "prompt": "Dog is to puppy as cat is to...", "options": ["Kitten", "Cub", "Foal", "Calf"], "correctIndex": 0, "category": "nature" }], "theme": "nature" }
Always 4 options. One correct. Increase abstraction with difficulty.`,

    'memory-match': `Generate a themed set of 8 emoji-label pairs for a memory card game.
User interests: ${profile.interests.join(', ')}.
Return JSON: { "rounds": [{ "emoji": "🌻", "label": "Sunflower" }], "theme": "nature" }
Pick a theme the user would enjoy. Use clear, distinct emojis.`,

    'sequence-recall': `Generate 8 color sequences for a Simon-style recall game, difficulty ${difficulty}/5.
Return JSON: { "rounds": [{ "sequence": [0,1,2,3,1] }], "theme": "colors" }
Colors are indexed 0=Red, 1=Blue, 2=Green, 3=Yellow. Length: difficulty 1-2 = 3-4, difficulty 3-4 = 4-6, difficulty 5 = 6-8.`,

    'pattern-finder': `Generate 8 number pattern rounds for difficulty ${difficulty}/5.
Return JSON: { "rounds": [{ "sequence": [2,4,6,8,"?"], "options": [10,9,11,12], "correctIndex": 0, "rule": "Add 2 each time" }], "theme": "numbers" }
Always 4 options. Vary pattern types (add, multiply, alternate, subtract). Increase complexity with difficulty.`,

    'number-crunch': `Generate 8 mental math rounds for difficulty ${difficulty}/5.
Return JSON: { "rounds": [{ "expression": "12 + 7", "answer": 19, "options": [19, 17, 21, 18], "correctIndex": 0 }], "theme": "math" }
Difficulty 1-2: single-digit add/subtract. Difficulty 3-4: two-digit or simple multiply. Difficulty 5: multi-step or division. Always 4 options.`,

    'knowledge-quiz': `Generate 8 trivia questions themed around: ${profile.interests.join(', ')}.
Difficulty: ${difficulty}/5. Target audience: seniors who enjoy learning.
Return JSON: { "rounds": [{ "question": "...", "options": ["A","B","C","D"], "correctIndex": 0, "category": "history", "funFact": "..." }], "theme": "history" }
Include a fun fact for each question. Keep language clear and warm.`,
  };

  try {
    const raw = await callClaude(systemPrompt, prompts[gameType], {
      model: HAIKU_MODEL,
      maxTokens: 1500,
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

/**
 * Generate a visual theme using Gemini (falls back to Claude if no Gemini key).
 */
export async function generateVisualTheme(
  profile: { dimensions: CognitiveProfile; interests: InterestArea[] },
  userId?: number
): Promise<AITheme> {
  const fallback = deterministic_generateTheme(profile);

  const prompt = `You are a designer creating warm, accessible color themes for a brain training app used by seniors.

User interests: ${profile.interests.join(', ')}.
Cognitive strengths: verbal=${profile.dimensions.verbal}, logical=${profile.dimensions.logical}, spatial=${profile.dimensions.spatial}, memory=${profile.dimensions.memory}.

Create a color theme and return JSON (no extra text):
{
  "primaryColor": "<hex color — warm, not too saturated>",
  "accentColor": "<hex color — complements primary>",
  "greeting": "<warm, personalized 5-10 word greeting referencing their interests>"
}

Requirements:
- Colors must have good contrast on cream (#FFF8F0) backgrounds
- Avoid harsh neons or very dark colors
- Keep it warm and inviting`;

  // Try Gemini first (free), fall back to Claude Haiku
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

/**
 * Generate smarter recommendations by cross-referencing performance trends,
 * personality survey, and feedback history. Returns priority boosts per game.
 */
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

  const systemPrompt = `You are an adaptive learning AI for MindBloom. Analyze user data and suggest which games to prioritize. Respond with valid JSON only.`;

  const userPrompt = `User interests: ${data.profile.interests.join(', ')}
Cognitive profile: verbal=${data.profile.dimensions.verbal}, logical=${data.profile.dimensions.logical}, spatial=${data.profile.dimensions.spatial}, memory=${data.profile.dimensions.memory}
Recent sessions: ${historyText}
Available games: word-scramble, word-connection, memory-match, sequence-recall, pattern-finder, number-crunch, knowledge-quiz

Return JSON array of recommendations:
[{ "gameType": "<game-id>", "reason": "<1 sentence why>", "priorityBoost": <-20 to +20> }]

Boost games aligned with interests and cognitive strengths. Reduce games the user dislikes (low enjoyment + no playAgain). Include all 7 games.`;

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
    encouragement = "Excellent performance! You're mastering this game.";
    difficultyChange = 1;
  } else if (sessionData.accuracy > 65) {
    encouragement = "Great job! You're right in the learning zone.";
  } else if (sessionData.accuracy < 45) {
    encouragement = 'Keep trying! Every attempt strengthens your mind.';
    difficultyChange = -1;
  } else {
    encouragement = "Good effort! You're making progress.";
  }

  return {
    difficultyAdjustment: {
      newDifficulty: Math.max(1, Math.min(5, sessionData.difficulty + difficultyChange)),
      reason: encouragement,
    },
    recommendations: [
      'Try playing at different times of day',
      'Mix up your game choices for a well-rounded workout',
    ],
    encouragement,
  };
}

function deterministic_generateTheme(
  profile: { interests: InterestArea[] }
): AITheme {
  const themes: Record<string, AITheme> = {
    nature: { primaryColor: '#7CB97D', accentColor: '#4A90D9', greeting: 'Welcome to your garden of knowledge!' },
    history: { primaryColor: '#C4956A', accentColor: '#8B7355', greeting: 'Welcome, scholar!' },
    music: { primaryColor: '#9B59B6', accentColor: '#E8A849', greeting: 'Welcome to your harmony of learning!' },
    science: { primaryColor: '#4A90D9', accentColor: '#7CB97D', greeting: 'Welcome to your lab of discovery!' },
    cooking: { primaryColor: '#E8A849', accentColor: '#E74C3C', greeting: 'Welcome to your recipe for success!' },
    sports: { primaryColor: '#E74C3C', accentColor: '#4A90D9', greeting: 'Welcome, champion!' },
    travel: { primaryColor: '#4A90D9', accentColor: '#E8A849', greeting: 'Welcome, explorer!' },
    literature: { primaryColor: '#8B7355', accentColor: '#C4956A', greeting: 'Welcome, dear reader!' },
    puzzles: { primaryColor: '#4A90D9', accentColor: '#9B59B6', greeting: 'Welcome, puzzle master!' },
    current_events: { primaryColor: '#4A90D9', accentColor: '#7CB97D', greeting: 'Welcome, informed citizen!' },
    default: { primaryColor: '#4A90D9', accentColor: '#7CB97D', greeting: 'Welcome back!' },
  };
  const topInterest = profile.interests[0] || 'default';
  return themes[topInterest] || themes.default;
}
