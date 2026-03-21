'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';
import { getGameConfig, GAME_CONFIGS } from '@/lib/game-data';
import ProfileRadar from '@/components/dashboard/ProfileRadar';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: userLoading } = useUser();
  const { sessions, stats, loading: dataLoading } = useAdaptive(user?.id, profile);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-gentle">🌱</div>
          <p className="text-body-lg text-warm-gray-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  const dimensions = profile?.dimensions || { verbal: 50, logical: 50, spatial: 50, memory: 50 };
  const interests = profile?.interests || [];

  // Game play counts
  const gameCounts: Record<string, number> = {};
  sessions.forEach((s: any) => {
    gameCounts[s.game_type || s.gameType] = (gameCounts[s.game_type || s.gameType] || 0) + 1;
  });

  // Recent sessions
  const recentSessions = sessions.slice(0, 10);

  // Progress message
  const getProgressMessage = () => {
    if (!stats) return 'Start playing to track your progress!';
    if (stats.totalSessions === 0) return 'Play some games to see your progress here!';
    if (stats.streak >= 7) return 'Amazing! A whole week of brain training!';
    if (stats.streak >= 3) return 'Great consistency! Keep your streak going!';
    if (stats.averageAccuracy >= 80) return 'Excellent accuracy! Your mind is sharp!';
    if (stats.totalSessions >= 20) return 'A dedicated learner! You\'ve played many games.';
    if (stats.totalSessions >= 5) return 'You\'re building a great habit!';
    return 'Every game strengthens your mind. Keep going!';
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-body text-soft-blue hover:text-soft-blue-dark">
            ← Back to Games
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-body font-bold text-warm-gray">MindBloom</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-heading-lg font-bold text-warm-gray mb-2">{user.name}&apos;s Profile</h1>
          <p className="text-body-lg text-warm-gray-light">{getProgressMessage()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cognitive Profile */}
          <div className="bg-white rounded-warm-lg shadow-warm p-6 animate-slide-up">
            <h2 className="text-body-lg font-bold text-warm-gray mb-4 text-center">Cognitive Profile</h2>
            <ProfileRadar dimensions={dimensions} size={250} />
          </div>

          {/* Stats */}
          <div className="bg-white rounded-warm-lg shadow-warm p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-body-lg font-bold text-warm-gray mb-4">Your Stats</h2>
            {stats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-cream-dark">
                  <span className="text-body text-warm-gray-light">Games Played</span>
                  <span className="text-body-lg font-bold text-warm-gray">{stats.totalSessions}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-cream-dark">
                  <span className="text-body text-warm-gray-light">Average Accuracy</span>
                  <span className="text-body-lg font-bold text-warm-gray">{stats.averageAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-cream-dark">
                  <span className="text-body text-warm-gray-light">Total Score</span>
                  <span className="text-body-lg font-bold text-amber">{stats.totalScore}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-cream-dark">
                  <span className="text-body text-warm-gray-light">Current Streak</span>
                  <span className="text-body-lg font-bold text-warm-gray">
                    {stats.streak > 0 ? `🔥 ${stats.streak} days` : 'Start today!'}
                  </span>
                </div>
                {stats.favoriteGame && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-body text-warm-gray-light">Favorite Game</span>
                    <span className="text-body-lg font-bold text-warm-gray">
                      {getGameConfig(stats.favoriteGame)?.emoji} {getGameConfig(stats.favoriteGame)?.name}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-body text-warm-gray-light text-center py-8">Play some games to see your stats!</p>
            )}
          </div>

          {/* Interests */}
          <div className="bg-white rounded-warm-lg shadow-warm p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-body-lg font-bold text-warm-gray mb-4">Your Interests</h2>
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <span key={interest} className="px-4 py-2 bg-soft-blue/10 text-soft-blue rounded-full text-body font-medium capitalize">
                    {interest.replace('_', ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-body text-warm-gray-light mb-3">Take the survey to discover your interests!</p>
                <Link href="/survey" className="text-body text-soft-blue hover:text-soft-blue-dark font-medium">
                  Take Survey →
                </Link>
              </div>
            )}
          </div>

          {/* Game History */}
          <div className="bg-white rounded-warm-lg shadow-warm p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-body-lg font-bold text-warm-gray mb-4">Games Played</h2>
            {Object.keys(gameCounts).length > 0 ? (
              <div className="space-y-3">
                {GAME_CONFIGS.map(gc => {
                  const count = gameCounts[gc.id] || 0;
                  if (count === 0) return null;
                  return (
                    <div key={gc.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{gc.emoji}</span>
                        <span className="text-body text-warm-gray">{gc.name}</span>
                      </div>
                      <span className="text-body font-semibold text-warm-gray-light">{count}x</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-body text-warm-gray-light text-center py-4">No games played yet. Let&apos;s get started!</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {recentSessions.length > 0 && (
          <div className="mt-6 bg-white rounded-warm-lg shadow-warm p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-body-lg font-bold text-warm-gray mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentSessions.map((s: any, i: number) => {
                const gc = getGameConfig(s.game_type || s.gameType);
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-cream-dark last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{gc?.emoji || '🎮'}</span>
                      <div>
                        <p className="text-body text-warm-gray">{gc?.name || s.game_type}</p>
                        <p className="text-sm text-warm-gray-light">
                          {new Date(s.created_at || s.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-body font-semibold text-warm-gray">{s.score} pts</p>
                      <p className="text-sm text-warm-gray-light">{s.accuracy}% accuracy</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
