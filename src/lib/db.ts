import { sql } from '@vercel/postgres';
import { hashSync, compareSync } from 'bcryptjs';

let initialized = false;

async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      pin_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id),
      dimensions TEXT NOT NULL DEFAULT '{"verbal":50,"logical":50,"spatial":50,"memory":50}',
      interests TEXT NOT NULL DEFAULT '[]',
      difficulty_level INTEGER NOT NULL DEFAULT 2
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS game_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      game_type TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      accuracy REAL NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      difficulty INTEGER NOT NULL DEFAULT 2,
      feedback TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      question_id TEXT NOT NULL,
      answer_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS ai_recommendations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      session_id INTEGER REFERENCES game_sessions(id),
      encouragement TEXT,
      session_summary TEXT,
      game_recommendations TEXT,
      insights TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS ai_usage (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      model TEXT NOT NULL,
      input_tokens INTEGER NOT NULL DEFAULT 0,
      output_tokens INTEGER NOT NULL DEFAULT 0,
      cost_usd REAL NOT NULL DEFAULT 0,
      purpose TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  initialized = true;
}

// ===== User Operations =====

export async function createUser(name: string, pin: string): Promise<{ id: number; name: string }> {
  await ensureInitialized();
  const pinHash = hashSync(pin, 10);
  const { rows } = await sql`
    INSERT INTO users (name, pin_hash) VALUES (${name}, ${pinHash})
    RETURNING id, name
  `;
  const user = rows[0];
  await sql`INSERT INTO profiles (user_id) VALUES (${user.id})`;
  return { id: user.id, name: user.name };
}

export async function authenticateUser(name: string, pin: string): Promise<{ id: number; name: string } | null> {
  await ensureInitialized();
  const { rows } = await sql`
    SELECT id, name, pin_hash FROM users WHERE LOWER(name) = LOWER(${name})
  `;
  if (rows.length === 0) return null;
  const user = rows[0];
  if (!compareSync(pin, user.pin_hash)) return null;
  return { id: user.id, name: user.name };
}

export async function getUser(userId: number): Promise<{ id: number; name: string; created_at: string } | null> {
  await ensureInitialized();
  const { rows } = await sql`SELECT id, name, created_at FROM users WHERE id = ${userId}`;
  return (rows[0] as any) || null;
}

// ===== Profile Operations =====

export async function getProfile(userId: number) {
  await ensureInitialized();
  const { rows } = await sql`SELECT * FROM profiles WHERE user_id = ${userId}`;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    userId: row.user_id,
    dimensions: JSON.parse(row.dimensions),
    interests: JSON.parse(row.interests),
    difficultyLevel: row.difficulty_level,
  };
}

export async function updateProfile(userId: number, dimensions: any, interests: string[], difficultyLevel?: number) {
  await ensureInitialized();
  if (difficultyLevel !== undefined) {
    await sql`
      UPDATE profiles SET dimensions = ${JSON.stringify(dimensions)}, interests = ${JSON.stringify(interests)}, difficulty_level = ${difficultyLevel}
      WHERE user_id = ${userId}
    `;
  } else {
    await sql`
      UPDATE profiles SET dimensions = ${JSON.stringify(dimensions)}, interests = ${JSON.stringify(interests)}
      WHERE user_id = ${userId}
    `;
  }
}

export async function updateDifficulty(userId: number, difficulty: number) {
  await ensureInitialized();
  await sql`UPDATE profiles SET difficulty_level = ${difficulty} WHERE user_id = ${userId}`;
}

// ===== Game Session Operations =====

export async function saveGameSession(session: {
  userId: number;
  gameType: string;
  score: number;
  accuracy: number;
  duration: number;
  difficulty: number;
  feedback?: any;
}) {
  await ensureInitialized();
  const feedbackJson = session.feedback ? JSON.stringify(session.feedback) : null;
  const { rows } = await sql`
    INSERT INTO game_sessions (user_id, game_type, score, accuracy, duration, difficulty, feedback)
    VALUES (${session.userId}, ${session.gameType}, ${session.score}, ${session.accuracy}, ${session.duration}, ${session.difficulty}, ${feedbackJson})
    RETURNING id
  `;
  return rows[0].id;
}

export async function getGameSessions(userId: number, limit = 50): Promise<any[]> {
  await ensureInitialized();
  const { rows } = await sql`
    SELECT * FROM game_sessions WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows.map(r => ({ ...r, feedback: r.feedback ? JSON.parse(r.feedback) : null }));
}

export async function getGameSessionsByType(userId: number, gameType: string, limit = 10): Promise<any[]> {
  await ensureInitialized();
  const { rows } = await sql`
    SELECT * FROM game_sessions WHERE user_id = ${userId} AND game_type = ${gameType} ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows.map(r => ({ ...r, feedback: r.feedback ? JSON.parse(r.feedback) : null }));
}

export async function getSessionStats(userId: number) {
  await ensureInitialized();
  const { rows: totalRows } = await sql`SELECT COUNT(*) as count FROM game_sessions WHERE user_id = ${userId}`;
  const { rows: avgRows } = await sql`SELECT AVG(accuracy) as avg FROM game_sessions WHERE user_id = ${userId}`;
  const { rows: scoreRows } = await sql`SELECT SUM(score) as total FROM game_sessions WHERE user_id = ${userId}`;
  const { rows: gameRows } = await sql`
    SELECT game_type, COUNT(*) as count FROM game_sessions WHERE user_id = ${userId}
    GROUP BY game_type ORDER BY count DESC LIMIT 1
  `;
  const { rows: dayRows } = await sql`
    SELECT DISTINCT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as day FROM game_sessions WHERE user_id = ${userId}
    ORDER BY day DESC LIMIT 30
  `;

  let streak = 0;
  for (let i = 0; i < dayRows.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split('T')[0];
    if (dayRows[i]?.day === expected) { streak++; } else { break; }
  }

  return {
    totalSessions: parseInt(totalRows[0]?.count || '0'),
    averageAccuracy: Math.round((parseFloat(avgRows[0]?.avg || '0')) * 100) / 100,
    totalScore: parseInt(scoreRows[0]?.total || '0'),
    favoriteGame: gameRows[0]?.game_type || null,
    streak,
  };
}

// ===== Survey Operations =====

export async function saveSurveyResponses(userId: number, responses: { questionId: string; answerId: string }[]) {
  await ensureInitialized();
  await sql`DELETE FROM survey_responses WHERE user_id = ${userId}`;
  for (const item of responses) {
    await sql`INSERT INTO survey_responses (user_id, question_id, answer_id) VALUES (${userId}, ${item.questionId}, ${item.answerId})`;
  }
}

export async function getSurveyResponses(userId: number) {
  await ensureInitialized();
  const { rows } = await sql`SELECT question_id, answer_id FROM survey_responses WHERE user_id = ${userId} ORDER BY id`;
  return rows;
}

export async function hasSurveyCompleted(userId: number): Promise<boolean> {
  await ensureInitialized();
  const { rows } = await sql`SELECT COUNT(*) as count FROM survey_responses WHERE user_id = ${userId}`;
  return parseInt(rows[0]?.count || '0') >= 10;
}

// ===== AI Operations =====

export async function saveAIAnalysis(
  userId: number,
  sessionId: number | null,
  analysis: {
    encouragement?: string;
    sessionSummary?: string;
    gameRecommendations?: any[];
    insights?: string;
  }
) {
  await ensureInitialized();
  await sql`
    INSERT INTO ai_recommendations (user_id, session_id, encouragement, session_summary, game_recommendations, insights)
    VALUES (
      ${userId},
      ${sessionId},
      ${analysis.encouragement || null},
      ${analysis.sessionSummary || null},
      ${analysis.gameRecommendations ? JSON.stringify(analysis.gameRecommendations) : null},
      ${analysis.insights || null}
    )
  `;
}

export async function getLatestAIAnalysis(userId: number) {
  await ensureInitialized();
  const { rows } = await sql`
    SELECT * FROM ai_recommendations WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT 1
  `;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    encouragement: row.encouragement,
    sessionSummary: row.session_summary,
    gameRecommendations: row.game_recommendations ? JSON.parse(row.game_recommendations) : [],
    insights: row.insights,
    createdAt: row.created_at,
  };
}

export async function trackAIUsage(
  userId: number | null,
  model: string,
  inputTokens: number,
  outputTokens: number,
  purpose: string
) {
  await ensureInitialized();
  // Approximate cost in USD (based on current pricing)
  const costUsd = model.includes('haiku')
    ? (inputTokens * 0.0000008) + (outputTokens * 0.000004)
    : model.includes('sonnet')
    ? (inputTokens * 0.000003) + (outputTokens * 0.000015)
    : 0; // Gemini is effectively free at this scale

  await sql`
    INSERT INTO ai_usage (user_id, model, input_tokens, output_tokens, cost_usd, purpose)
    VALUES (${userId}, ${model}, ${inputTokens}, ${outputTokens}, ${costUsd}, ${purpose})
  `;
  return costUsd;
}

export async function getMonthlyAICost(): Promise<number> {
  await ensureInitialized();
  const { rows } = await sql`
    SELECT COALESCE(SUM(cost_usd), 0) as total
    FROM ai_usage
    WHERE created_at >= DATE_TRUNC('month', NOW())
  `;
  return parseFloat(rows[0]?.total || '0');
}

export async function getUserSessionCount(userId: number): Promise<number> {
  await ensureInitialized();
  const { rows } = await sql`SELECT COUNT(*) as count FROM game_sessions WHERE user_id = ${userId}`;
  return parseInt(rows[0]?.count || '0');
}
