import { NextRequest, NextResponse } from 'next/server';
import { saveGameSession, getGameSessions, getProfile, updateProfile, updateDifficulty, saveAIAnalysis, getSurveyResponses, getUserSessionCount } from '@/lib/db';
import { updateDimensionScores, calculateDifficultyAdjustment } from '@/lib/adaptive-engine';
import { runSessionPipeline } from '@/lib/ai-service';
import { GameType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '0');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const sessions = await getGameSessions(userId);
    return NextResponse.json({ sessions });
  } catch (e) {
    console.error('Sessions GET error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameType, score, accuracy, duration, difficulty } = body;

    if (!userId || !gameType) {
      return NextResponse.json({ error: 'userId and gameType required' }, { status: 400 });
    }

    const id = await saveGameSession({
      userId,
      gameType,
      score: score || 0,
      accuracy: accuracy || 0,
      duration: duration || 0,
      difficulty: difficulty || 2,
    });

    const profile = await getProfile(userId);
    if (profile) {
      const updatedDimensions = updateDimensionScores(
        profile.dimensions,
        gameType as GameType,
        accuracy || 0
      );
      await updateProfile(userId, updatedDimensions, profile.interests);

      const recentSessions = (await getGameSessions(userId, 5)).filter((s: any) => (s.game_type || s.gameType) === gameType);
      if (recentSessions.length >= 3) {
        const avgAcc = recentSessions.slice(0, 3).reduce((sum: number, s: any) => sum + s.accuracy, 0) / 3;
        const adjustment = calculateDifficultyAdjustment(avgAcc, recentSessions);
        if (adjustment.newDifficulty !== profile.difficultyLevel) {
          await updateDifficulty(userId, adjustment.newDifficulty);
        }
      }
    }

    // Fire off AI analysis in the background — don't await, user shouldn't wait
    if (profile) {
      (async () => {
        try {
          const [surveyResponses, sessionCount, allSessions] = await Promise.all([
            getSurveyResponses(userId),
            getUserSessionCount(userId),
            getGameSessions(userId, 20),
          ]);
          const history = allSessions.map((s: any) => ({
            gameType: s.game_type || s.gameType,
            accuracy: s.accuracy,
            difficulty: s.difficulty,
            score: s.score,
            feedback: s.feedback,
            createdAt: s.created_at,
          }));
          const analysis = await runSessionPipeline({
            userId,
            sessionId: id,
            gameType: gameType as GameType,
            accuracy: accuracy || 0,
            duration: duration || 0,
            difficulty: difficulty || 2,
            score: score || 0,
            feedback: undefined,
            recentHistory: history,
            profile: {
              dimensions: profile.dimensions,
              interests: profile.interests,
              difficultyLevel: profile.difficultyLevel,
            },
            surveyResponses: surveyResponses as Array<{ question_id: string; answer_id: string }>,
            sessionCount,
          });
          await saveAIAnalysis(userId, id, {
            encouragement: analysis.encouragement,
            sessionSummary: analysis.sessionSummary,
            gameRecommendations: analysis.gameRecommendations,
            insights: analysis.insights,
          });
        } catch (err) {
          console.error('Background AI analysis failed:', err);
        }
      })();
    }

    return NextResponse.json({ id, success: true });
  } catch (e) {
    console.error('Sessions POST error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
