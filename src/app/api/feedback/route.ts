import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import {
  getProfile, getGameSessions, getSurveyResponses,
  saveAIAnalysis, getUserSessionCount,
} from '@/lib/db';
import { runSessionPipeline } from '@/lib/ai-service';
import { GameType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, feedback, userId } = await request.json();

    if (!sessionId || !feedback) {
      return NextResponse.json({ error: 'sessionId and feedback required' }, { status: 400 });
    }

    // Save feedback to the session
    await sql`UPDATE game_sessions SET feedback = ${JSON.stringify(feedback)} WHERE id = ${sessionId}`;

    // Fire off updated AI analysis in background with feedback data — don't block response
    if (userId) {
      (async () => {
        try {
          const { rows: sessionRows } = await sql`SELECT * FROM game_sessions WHERE id = ${sessionId}`;
          const session = sessionRows[0];
          if (!session) return;

          const [profile, recentHistory, surveyResponses, sessionCount] = await Promise.all([
            getProfile(userId),
            getGameSessions(userId, 20),
            getSurveyResponses(userId),
            getUserSessionCount(userId),
          ]);
          if (!profile) return;

          const history = recentHistory.map((s: any) => ({
            gameType: s.game_type || s.gameType,
            accuracy: s.accuracy,
            difficulty: s.difficulty,
            score: s.score,
            feedback: s.feedback,
            createdAt: s.created_at,
          }));

          const analysis = await runSessionPipeline({
            userId,
            sessionId,
            gameType: (session.game_type || session.gameType) as GameType,
            accuracy: session.accuracy || 0,
            duration: session.duration || 0,
            difficulty: session.difficulty || 2,
            score: session.score || 0,
            feedback,
            recentHistory: history,
            profile: {
              dimensions: profile.dimensions,
              interests: profile.interests,
              difficultyLevel: profile.difficultyLevel,
            },
            surveyResponses: surveyResponses as Array<{ question_id: string; answer_id: string }>,
            sessionCount,
          });

          await saveAIAnalysis(userId, sessionId, {
            encouragement: analysis.encouragement,
            sessionSummary: analysis.sessionSummary,
            gameRecommendations: analysis.gameRecommendations,
            insights: analysis.insights,
          });
        } catch (err) {
          console.error('Background AI re-analysis with feedback failed:', err);
        }
      })();
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Feedback error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
