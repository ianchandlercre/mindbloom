import { NextRequest, NextResponse } from 'next/server';
import { getProfile, getSessionStats, getGameSessions, getLatestAIAnalysis } from '@/lib/db';
import { getRecommendedGames } from '@/lib/adaptive-engine';
import { generateBrainTodayCard } from '@/lib/ai-service';
import { RecommendedGame } from '@/types';

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
      const [sessions, aiAnalysis] = await Promise.all([
        getGameSessions(userId, 50),
        getLatestAIAnalysis(userId),
      ]);

      const baseRecs = getRecommendedGames(
        profile.dimensions,
        profile.interests,
        sessions,
        profile.difficultyLevel
      );

      let recommendations: RecommendedGame[] = baseRecs;
      if (aiAnalysis && aiAnalysis.gameRecommendations?.length > 0) {
        const boostMap = new Map<string, { reason: string; priorityBoost: number }>();
        for (const rec of aiAnalysis.gameRecommendations) {
          boostMap.set(rec.gameType, { reason: rec.reason, priorityBoost: rec.priorityBoost || 0 });
        }

        recommendations = baseRecs.map(rec => {
          const aiBoost = boostMap.get(rec.config.id);
          if (!aiBoost) return rec;
          return {
            ...rec,
            matchScore: Math.min(99, Math.max(40, rec.matchScore + aiBoost.priorityBoost)),
            reason: aiBoost.reason || rec.reason,
          };
        }).sort((a, b) => b.matchScore - a.matchScore);
      }

      return NextResponse.json({
        recommendations,
        aiInsights: aiAnalysis?.insights || null,
        aiEncouragement: aiAnalysis?.encouragement || null,
        lastSessionSummary: aiAnalysis?.sessionSummary || null,
      });
    }

    if (action === 'brain-today') {
      const sessions = await getGameSessions(userId, 7);
      if (sessions.length === 0) {
        return NextResponse.json({ brainToday: null });
      }
      const recentSessions = sessions.map((s: any) => ({
        gameType: s.game_type || s.gameType,
        accuracy: s.accuracy,
        duration: s.duration,
        score: s.score,
        createdAt: s.created_at || s.createdAt,
      }));
      const brainToday = await generateBrainTodayCard({
        userId,
        recentSessions,
        profile: { interests: profile.interests, dimensions: profile.dimensions },
      });
      return NextResponse.json({ brainToday });
    }

    const stats = await getSessionStats(userId);
    return NextResponse.json({ profile, stats });
  } catch (e) {
    console.error('User API error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
