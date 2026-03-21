import { getProfile, getGameSessions, getSurveyResponses, getUserSessionCount, saveAIAnalysis } from './db';
import { runSessionPipeline, generateBrainTodayCard, generateSmartRecommendations } from './ai-service';
import { sql } from '@vercel/postgres';
import { GameType } from '@/types';

async function ensureInsightsTable() {
  await sql`CREATE TABLE IF NOT EXISTS user_insights (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, insight_type TEXT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`;
}

async function saveInsight(userId: number, type: string, content: any) {
  await ensureInsightsTable();
  await sql`INSERT INTO user_insights (user_id, insight_type, content) VALUES (${userId}, ${type}, ${JSON.stringify(content)})`;
}

export async function getLatestInsight(userId: number, type: string): Promise<any | null> {
  await ensureInsightsTable();
  const { rows } = await sql`SELECT content, created_at FROM user_insights WHERE user_id = ${userId} AND insight_type = ${type} ORDER BY created_at DESC LIMIT 1`;
  if (rows.length === 0) return null;
  try { return { ...JSON.parse(rows[0].content), createdAt: rows[0].created_at }; } catch { return null; }
}

export function runAutoResearch(params: { userId: number; sessionId: number; gameType: string; accuracy: number; duration: number; difficulty: number; score: number; }) {
  (async () => {
    try {
      const { userId, sessionId, gameType, accuracy, duration, difficulty, score } = params;
      const [profile, recentHistory, surveyResponses, sessionCount] = await Promise.all([
        getProfile(userId), getGameSessions(userId, 20), getSurveyResponses(userId), getUserSessionCount(userId),
      ]);
      if (!profile) return;
      const history = recentHistory.map((s: any) => ({ gameType: s.game_type || s.gameType, accuracy: s.accuracy, difficulty: s.difficulty, score: s.score, feedback: s.feedback, createdAt: s.created_at }));

      const analysis = await runSessionPipeline({ userId, sessionId, gameType: gameType as GameType, accuracy, duration, difficulty, score, recentHistory: history, profile: { dimensions: profile.dimensions, interests: profile.interests, difficultyLevel: profile.difficultyLevel }, surveyResponses: surveyResponses as Array<{ question_id: string; answer_id: string }>, sessionCount });
      await saveAIAnalysis(userId, sessionId, { encouragement: analysis.encouragement, sessionSummary: analysis.sessionSummary, gameRecommendations: analysis.gameRecommendations, insights: analysis.insights });

      const recentSessions = recentHistory.slice(0, 7).map((s: any) => ({ gameType: s.game_type || s.gameType, accuracy: s.accuracy, duration: s.duration, score: s.score, createdAt: s.created_at || s.createdAt }));
      const brainToday = await generateBrainTodayCard({ userId, recentSessions, profile: { interests: profile.interests, dimensions: profile.dimensions } });
      if (brainToday) await saveInsight(userId, 'brain_today', brainToday);

      const recommendations = await generateSmartRecommendations({ userId, profile: { dimensions: profile.dimensions, interests: profile.interests }, recentHistory: history.slice(0, 20), surveyResponses: surveyResponses as Array<{ question_id: string; answer_id: string }> });
      if (recommendations.length > 0) await saveInsight(userId, 'recommendations', recommendations);

      console.log(`[auto-research] Completed for user ${userId}, session ${sessionId}`);
    } catch (err) { console.error('[auto-research] Pipeline error:', err); }
  })();
}
