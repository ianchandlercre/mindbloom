import { NextRequest, NextResponse } from 'next/server';
import { saveGameSession, getGameSessions, getProfile, updateProfile, updateDifficulty } from '@/lib/db';
import { updateDimensionScores, calculateDifficultyAdjustment } from '@/lib/adaptive-engine';
import { GameType } from '@/types';
import { runAutoResearch } from '@/lib/auto-research';

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

    // Fire off AI analysis in the background — user sees completion screen immediately
    runAutoResearch({ userId, sessionId: id, gameType, accuracy: accuracy || 0, duration: duration || 0, difficulty: difficulty || 2, score: score || 0 });

    return NextResponse.json({ id, success: true });
  } catch (e) {
    console.error('Sessions POST error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
