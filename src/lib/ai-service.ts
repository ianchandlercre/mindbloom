import { CognitiveProfile, GameType, InterestArea, AIGeneratedContent, AISessionAnalysis, AITheme } from '@/types';

/**
 * AI Service — Claude (Anthropic) + Gemini (Google) Integration
 *
 * DROP YOUR KEYS IN .env:
 *   ANTHROPIC_API_KEY=sk-ant-...
 *   GOOGLE_AI_API_KEY=AIza...
 *
 * The logic tries Claude first. If no Anthropic key, falls back to Gemini.
 * If neither key is set, returns deterministic results (app still works fine).
 */

const ANTHROPIC_KEY = () => process.env.ANTHROPIC_API_KEY || '';
const GOOGLE_KEY = () => process.env.GOOGLE_AI_API_KEY || '';

function aiProvider(): 'claude' | 'gemini' | 'none' {
  if (ANTHROPIC_KEY()) return 'claude';
  if (GOOGLE_KEY()) return 'gemini';
  return 'none';
}

// ─── Low-level API callers ───────────────────────────────────────────────────

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY(),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API ${res.status}: ${err}`);
  }

  const data = await res.json();
  // Extract text from first content block
  return data.content?.[0]?.text || '';
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_KEY()}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const provider = aiProvider();
  if (provider === 'claude') return callClaude(systemPrompt, userPrompt);
  if (provider === 'gemini') return callGemini(systemPrompt, userPrompt);
  throw new Error('No AI provider configured');
}

function parseJSON<T>(raw: string, fallback: T): T {
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.warn('AI returned non-JSON, using fallback:', raw.slice(0, 200));
    return fallback;
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate personalized game content using AI.
 *
 * Returns themed rounds tailored to the user's cognitive profile and interests.
 * Falls back to deterministic content from game-data.ts if no API key is set.
 */
export async function generatePersonalizedContent(
  profile: { dimensions: CognitiveProfile; interests: InterestArea[] },
  gameType: GameType,
  difficulty: number
): Promise<AIGeneratedContent> {
  if (aiProvider() === 'none') {
    return { rounds: [], theme: profile.interests[0] || 'general' };
  }

  const systemPrompt = `You are a content generator for MindBloom, a brain training app for seniors (ages 70-90). Generate warm, encouraging, age-appropriate game content. Always respond with valid JSON only — no explanation text.`;

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
Always 4 options. Vary the pattern types (add, multiply, alternate, subtract). Increase complexity with difficulty.`,

    'number-crunch': `Generate 8 mental math rounds for difficulty ${difficulty}/5.
Return JSON: { "rounds": [{ "expression": "12 + 7", "answer": 19, "options": [19, 17, 21, 18], "correctIndex": 0 }], "theme": "math" }
Difficulty 1-2: single-digit add/subtract. Difficulty 3-4: two-digit or simple multiply. Difficulty 5: multi-step or division. Always 4 options.`,

    'knowledge-quiz': `Generate 8 trivia questions themed around: ${profile.interests.join(', ')}.
Difficulty: ${difficulty}/5. Target audience: seniors who enjoy learning.
Return JSON: { "rounds": [{ "question": "...", "options": ["A","B","C","D"], "correctIndex": 0, "category": "history", "funFact": "..." }], "theme": "history" }
Include a fun fact for each question. Keep language clear and warm.`,
  };

  try {
    const raw = await callAI(systemPrompt, prompts[gameType]);
    const parsed = parseJSON<AIGeneratedContent>(raw, { rounds: [], theme: profile.interests[0] || 'general' });
    if (parsed.rounds && parsed.rounds.length > 0) return parsed;
    return { rounds: [], theme: profile.interests[0] || 'general' };
  } catch (err) {
    console.error(`AI content generation failed (${aiProvider()}):`, err);
    return { rounds: [], theme: profile.interests[0] || 'general' };
  }
}

/**
 * Analyze a completed game session using AI.
 *
 * Returns personalized difficulty adjustments, recommendations,
 * and encouragement messages. Falls back to rule-based logic if no API key.
 */
export async function analyzeSession(sessionData: {
  gameType: GameType;
  accuracy: number;
  duration: number;
  difficulty: number;
  score: number;
}): Promise<AISessionAnalysis> {
  if (aiProvider() === 'none') {
    return deterministic_analyzeSession(sessionData);
  }

  const systemPrompt = `You are a compassionate brain training coach for seniors. Analyze game performance and provide warm, encouraging feedback. Always respond with valid JSON only.`;

  const userPrompt = `A senior user just finished a brain training session:
- Game: ${sessionData.gameType}
- Accuracy: ${sessionData.accuracy}%
- Duration: ${sessionData.duration} seconds
- Difficulty: ${sessionData.difficulty}/5
- Score: ${sessionData.score}

Return JSON:
{
  "difficultyAdjustment": {
    "newDifficulty": <1-5, current is ${sessionData.difficulty}>,
    "reason": "<one warm sentence explaining the adjustment>"
  },
  "recommendations": ["<tip 1>", "<tip 2>"],
  "encouragement": "<1-2 sentences of genuine, warm encouragement — not patronizing>"
}

Rules:
- If accuracy > 85%, consider increasing difficulty by 1
- If accuracy < 45%, consider decreasing difficulty by 1
- Otherwise keep the same difficulty
- Never go below 1 or above 5
- Be genuinely warm, not condescending`;

  try {
    const raw = await callAI(systemPrompt, userPrompt);
    const parsed = parseJSON<AISessionAnalysis>(raw, deterministic_analyzeSession(sessionData));
    return parsed;
  } catch (err) {
    console.error(`AI session analysis failed (${aiProvider()}):`, err);
    return deterministic_analyzeSession(sessionData);
  }
}

/**
 * Generate a visual theme based on user profile.
 *
 * Returns colors and a personalized greeting. Falls back to
 * interest-based theme mapping if no API key.
 */
export async function generateVisualTheme(
  profile: { dimensions: CognitiveProfile; interests: InterestArea[] }
): Promise<AITheme> {
  if (aiProvider() === 'none') {
    return deterministic_generateTheme(profile);
  }

  const systemPrompt = `You are a designer creating warm, accessible color themes for a brain training app used by seniors. Always respond with valid JSON only.`;

  const userPrompt = `Create a color theme for a user with these interests: ${profile.interests.join(', ')}.
Cognitive strengths: verbal=${profile.dimensions.verbal}, logical=${profile.dimensions.logical}, spatial=${profile.dimensions.spatial}, memory=${profile.dimensions.memory}.

Return JSON:
{
  "primaryColor": "<hex color — warm, not too saturated>",
  "accentColor": "<hex color — complements primary>",
  "greeting": "<warm, personalized 5-10 word greeting referencing their interests>"
}

Requirements:
- Colors must have good contrast on cream (#FFF8F0) backgrounds
- Avoid harsh neons or very dark colors
- Keep it warm and inviting`;

  try {
    const raw = await callAI(systemPrompt, userPrompt);
    return parseJSON<AITheme>(raw, deterministic_generateTheme(profile));
  } catch (err) {
    console.error(`AI theme generation failed (${aiProvider()}):`, err);
    return deterministic_generateTheme(profile);
  }
}

// ─── Deterministic fallbacks ─────────────────────────────────────────────────

function deterministic_analyzeSession(sessionData: {
  accuracy: number;
  difficulty: number;
}): AISessionAnalysis {
  let encouragement = '';
  let difficultyChange = 0;

  if (sessionData.accuracy > 85) {
    encouragement = 'Excellent performance! You\'re mastering this game.';
    difficultyChange = 1;
  } else if (sessionData.accuracy > 65) {
    encouragement = 'Great job! You\'re right in the learning zone.';
  } else if (sessionData.accuracy < 45) {
    encouragement = 'Keep trying! Every attempt strengthens your mind.';
    difficultyChange = -1;
  } else {
    encouragement = 'Good effort! You\'re making progress.';
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
