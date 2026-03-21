'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';
import { getGameConfig, GAME_CONFIGS } from '@/lib/game-data';
import ProfileRadar from '@/components/dashboard/ProfileRadar';
import {
  Trees, ArrowLeft, Flame, Trophy, Target, Star,
  BookOpen, Link2, Grid3X3, ListOrdered, Puzzle, Calculator, HelpCircle
} from 'lucide-react';

const GAME_ICON_MAP: Record<string, React.ReactNode> = {
  'word-scramble': <BookOpen className="w-5 h-5 text-forest-600" />,
  'word-connection': <Link2 className="w-5 h-5 text-sage-600" />,
  'memory-match': <Grid3X3 className="w-5 h-5 text-amber-700" />,
  'sequence-recall': <ListOrdered className="w-5 h-5 text-wood-600" />,
  'pattern-finder': <Puzzle className="w-5 h-5 text-forest-600" />,
  'number-crunch': <Calculator className="w-5 h-5 text-amber-700" />,
  'knowledge-quiz': <HelpCircle className="w-5 h-5 text-sage-600" />,
};

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
      <div className="min-h-screen flex items-center justify-center bg-cream-DEFAULT">
        <div className="text-center">
          <Trees className="w-10 h-10 text-forest-500 mx-auto mb-4 animate-gentle-pulse" />
          <p className="text-body-lg text-bark-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  const dimensions = profile?.dimensions || { verbal: 50, logical: 50, spatial: 50, memory: 50 };
  const interests = profile?.interests || [];

  const gameCounts: Record<string, number> = {};
  sessions.forEach((s: any) => {
    gameCounts[s.game_type || s.gameType] = (gameCounts[s.game_type || s.gameType] || 0) + 1;
  });

  const recentSessions = sessions.slice(0, 10);

  const getProgressMessage = () => {
    if (!stats) return 'Start playing to track your progress!';
    if (stats.totalSessions === 0) return 'Play some games to see your progress here!';
    if (stats.streak >= 7) return 'Amazing! A whole week of brain training!';
    if (stats.streak >= 3) return 'Great consistency! Keep your streak going!';
    if (stats.averageAccuracy >= 80) return 'Excellent accuracy! Your mind is sharp!';
    if (stats.totalSessions >= 20) return 'A dedicated learner!';
    if (stats.totalSessions >= 5) return 'Building a great habit!';
    return 'Every game strengthens your mind. Keep going!';
  };

  return (
    <div className="min-h-screen bg-cream-DEFAULT texture-paper">
      <header className="sticky top-0 bg-cream-DEFAULT/95 backdrop-blur-sm border-b border-wood-100 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-body text-forest-600 hover:text-forest-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Link>
          <div className="flex items-center gap-2">
            <Trees className="w-6 h-6 text-forest-600" />
            <span className="text-body font-display font-bold text-bark">MindBloom</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-heading-lg font-display font-bold text-bark mb-2">{user.name}&apos;s Profile</h1>
          <p className="text-body-lg text-bark-light">{getProgressMessage()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cognitive Profile */}
          <div className="lodge-card p-6 animate-slide-up">
            <h2 className="text-body-lg font-display font-bold text-bark mb-4 text-center">Cognitive Profile</h2>
            <ProfileRadar dimensions={dimensions} size={250} />
          </div>

          {/* Stats */}
          <div className="lodge-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-body-lg font-display font-bold text-bark mb-4">Your Stats</h2>
            {stats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-wood-100">
                  <span className="text-body text-bark-light">Games Played</span>
                  <span className="text-body-lg font-bold text-bark">{stats.totalSessions}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-wood-100">
                  <span className="text-body text-bark-light">Average Accuracy</span>
                  <span className="text-body-lg font-bold text-bark">{stats.averageAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-wood-100">
                  <span className="text-body text-bark-light">Total Score</span>
                  <span className="text-body-lg font-bold text-amber-700">{stats.totalScore}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-wood-100">
                  <div className="flex items-center gap-2">
                    <span className="text-body text-bark-light">Current Streak</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {stats.streak > 0 && <Flame className="w-5 h-5 text-amber-600" />}
                    <span className="text-body-lg font-bold text-bark">
                      {stats.streak > 0 ? `${stats.streak} days` : 'Start today!'}
                    </span>
                  </div>
                </div>
                {stats.favoriteGame && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-body text-bark-light">Favorite Game</span>
                    <div className="flex items-center gap-2">
                      {GAME_ICON_MAP[stats.favoriteGame] || <Star className="w-5 h-5 text-forest-600" />}
                      <span className="text-body-lg font-bold text-bark">{getGameConfig(stats.favoriteGame)?.name}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-body text-bark-light text-center py-8">Play some games to see your stats!</p>
            )}
          </div>

          {/* Interests */}
          <div className="lodge-card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-body-lg font-display font-bold text-bark mb-4">Your Interests</h2>
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <span key={interest} className="badge-forest capitalize">
                    {interest.replace('_', ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-body text-bark-light mb-3">Take the survey to discover your interests!</p>
                <Link href="/survey" className="text-body text-forest-600 hover:text-forest-700 font-medium">
                  Take Survey
                </Link>
              </div>
            )}
          </div>

          {/* Game History */}
          <div className="lodge-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-body-lg font-display font-bold text-bark mb-4">Games Played</h2>
            {Object.keys(gameCounts).length > 0 ? (
              <div className="space-y-3">
                {GAME_CONFIGS.map(gc => {
                  const count = gameCounts[gc.id] || 0;
                  if (count === 0) return null;
                  return (
                    <div key={gc.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {GAME_ICON_MAP[gc.id] || <Star className="w-5 h-5 text-bark-lighter" />}
                        <span className="text-body text-bark">{gc.name}</span>
                      </div>
                      <span className="text-body font-semibold text-bark-light">{count}x</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-body text-bark-light text-center py-4">No games played yet. Let&apos;s get started!</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {recentSessions.length > 0 && (
          <div className="mt-6 lodge-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-body-lg font-display font-bold text-bark mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentSessions.map((s: any, i: number) => {
                const gc = getGameConfig(s.game_type || s.gameType);
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-wood-100 last:border-0">
                    <div className="flex items-center gap-3">
                      {gc ? GAME_ICON_MAP[gc.id] : <Star className="w-5 h-5 text-bark-lighter" />}
                      <div>
                        <p className="text-body text-bark">{gc?.name || s.game_type}</p>
                        <p className="text-sm text-bark-lighter">
                          {new Date(s.created_at || s.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-body font-semibold text-bark">{s.score} pts</p>
                      <p className="text-sm text-bark-lighter">{s.accuracy}% accuracy</p>
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
