import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/db';
import { generatePersonalizedContent } from '@/lib/ai-service';
import { GameType } from '@/types';

/**
 * GET /api/content?userId=X&gameType=Y&difficulty=Z
 *
 * Returns AI-generated game content for the given game type and difficulty.
 * Falls back gracefully (returns empty rounds) if AI is unavailable.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '0');
    const gameType = searchParams.get('gameType') as GameType;
    const difficulty = parseInt(searchParams.get('difficulty') || '2');

    if (!userId || !gameType) {
      return NextResponse.json({ rounds: [], theme: 'general' });
    }

    const profile = await getProfile(userId);
    if (!profile) {
      return NextResponse.json({ rounds: [], theme: 'general' });
    }

    const content = await generatePersonalizedContent(
      {
        dimensions: profile.dimensions,
        interests: profile.interests,
        preferredEra: (profile as any).preferredEra,
      },
      gameType,
      difficulty
    );

    return NextResponse.json(content);
  } catch (e) {
    console.error('Content API error:', e);
    return NextResponse.json({ rounds: [], theme: 'general' });
  }
}
