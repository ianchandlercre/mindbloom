'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';
import { getTimeGreeting } from '@/lib/adaptive-engine';
import GameCard from '@/components/dashboard/GameCard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: userLoading, logout } = useUser();
  const { recommendations, stats, loading: dataLoading } = useAdaptive(user?.id, profile);

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
          <p className="text-body-lg text-warm-gray-light">Loading your garden...</p>
        </div>
      </div>
    );
  }

  const greeting = getTimeGreeting(user.name);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-body font-bold text-warm-gray">MindBloom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-body text-soft-blue hover:text-soft-blue-dark transition-colors font-medium">
              My Profile
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="text-body text-warm-gray-light hover:text-warm-gray transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-heading-lg font-bold text-warm-gray mb-2">{greeting} 🌸</h1>
          {stats && stats.streak > 0 && (
            <p className="text-body-lg text-amber-dark">
              🔥 {stats.streak} day streak! Keep it going!
            </p>
          )}
          {stats && stats.totalSessions > 0 && (
            <p className="text-body text-warm-gray-light mt-1">
              You&apos;ve played {stats.totalSessions} {stats.totalSessions === 1 ? 'game' : 'games'} with an average accuracy of {stats.averageAccuracy}%.
              {stats.totalScore > 0 && ` Total score: ${stats.totalScore} points.`}
            </p>
          )}
          {(!stats || stats.totalSessions === 0) && (
            <p className="text-body-lg text-warm-gray-light">
              Ready to exercise your mind? Pick a game below to get started!
            </p>
          )}
        </div>

        {/* Quick Actions */}
        {profile && profile.interests.length === 0 && (
          <Link href="/survey">
            <div className="mb-6 p-5 bg-amber/10 border-2 border-amber/30 rounded-warm-lg cursor-pointer hover:bg-amber/20 transition-colors animate-slide-up">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📋</span>
                <div>
                  <p className="text-body-lg font-semibold text-warm-gray">Complete Your Profile</p>
                  <p className="text-body text-warm-gray-light">Take a quick survey so we can personalize your games!</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Games */}
        <div className="mb-6">
          <h2 className="text-heading font-bold text-warm-gray mb-4">
            {recommendations.length > 0 ? 'Recommended for You' : 'Brain Games'}
          </h2>
        </div>

        {dataLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-warm-lg shadow-warm p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cream-dark rounded-warm" />
                  <div className="flex-1">
                    <div className="h-5 bg-cream-dark rounded w-1/3 mb-3" />
                    <div className="h-4 bg-cream-dark rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((game, i) => (
              <GameCard key={game.config.id} game={game} rank={i} />
            ))}
          </div>
        )}

        {/* Retake Survey */}
        {profile && profile.interests.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/survey" className="text-body text-soft-blue hover:text-soft-blue-dark transition-colors">
              Retake personality survey →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
