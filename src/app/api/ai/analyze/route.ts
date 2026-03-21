import { NextRequest, NextResponse } from 'next/server';
import {
  getProfile, getGameSessions, getSurveyResponses,
  saveAIAnalysis, getUserSessionCount,
} from '@/lib/db';
import { runSessionPipeline } from '@/lib/ai-service';
import { GameType } from '@/types';

/**
 * POST /api/ai/analyze
 *
 * Background analysis pipeline triggered after a game session.
 * Collects full session history, profile, and survey data, sends to Claude,
 * stores the result in ai_recommendations for dashboard display.
 *
 * Body: { userId, sessionId, gameType, accuracy, duration, difficulty, score, feedback? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sessionId, gameType, accuracy, duration, difficulty, score, feedback } = body;

    if (!userId || !gameType) {
      return NextResponse.json({ error: 'userId and gameType required' }, { status: 400 });
    }

    const [profile, recentHistory, surveyResponses, sessionCount] = await Promise.all([
      getProfile(userId),
      getGameSessions(userId, 20),
      getSurveyResponses(userId),
      getUserSessionCount(userId),
    ]);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Map raw DB rows to expected format
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
      sessionId: sessionId || null,
      gameType: gameType as GameType,
      accuracy: accuracy || 0,
      duration: duration || 0,
      difficulty: difficulty || 2,
      score: score || 0,
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

    await saveAIAnalysis(userId, sessionId || null, {
      encouragement: analysis.encouragement,
      sessionSummary: analysis.sessionSummary,
      gameRecommendations: analysis.gameRecommendations,
      insights: analysis.insights,
    });

    return NextResponse.json({
      success: true,
      encouragement: analysis.encouragement,
      sessionSummary: analysis.sessionSummary,
      insights: analysis.insights,
    });
  } catch (e) {
    console.error('AI analyze error:', e);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
