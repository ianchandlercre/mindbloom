import { NextRequest, NextResponse } from 'next/server';
import { getProfile, getSessionStats, getGameSessions } from '@/lib/db';
import { getRecommendedGames } from '@/lib/adaptive-engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '0');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const profile = await getProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (action === 'recommendations') {
      const sessions = await getGameSessions(userId, 50);
      const recommendations = getRecommendedGames(
        profile.dimensions,
        profile.interests,
        sessions,
        profile.difficultyLevel
      );
      return NextResponse.json({ recommendations });
    }

    const stats = await getSessionStats(userId);
    return NextResponse.json({ profile, stats });
  } catch (e) {
    console.error('User API error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
