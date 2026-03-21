'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';
import { getTimeGreeting } from '@/lib/adaptive-engine';
import GameCard from '@/components/dashboard/GameCard';
import { TreePine, Flame, ClipboardList, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: userLoading, logout } = useUser();
  const { recommendations, stats, aiInsights, aiEncouragement, lastSessionSummary, loading: dataLoading } = useAdaptive(user?.id, profile);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-body-lg text-stone-light">Loading your experience...</p>
      </div>
    );
  }

  const greeting = getTimeGreeting(user.name);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-deep z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreePine className="w-6 h-6 text-forest" />
            <span className="font-serif text-body font-bold text-forest-dark">MindBloom</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/profile"
              className="text-body text-forest hover:text-forest-dark transition-colors font-medium"
            >
              My Profile
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="text-body text-stone-light hover:text-stone transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Hero greeting */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-serif text-heading-lg font-bold text-forest-dark mb-2">
            {greeting}
          </h1>
          {stats && stats.streak > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <Flame className="w-5 h-5 text-amber" />
              <span className="text-body-lg text-amber-dark font-semibold">
                {stats.streak}-day streak
              </span>
            </div>
          )}
          {stats && stats.totalSessions > 0 && (
            <p className="text-body text-stone mt-2">
              {stats.totalSessions} {stats.totalSessions === 1 ? 'session' : 'sessions'} completed
              {stats.averageAccuracy > 0 && ` · ${stats.averageAccuracy}% average accuracy`}
              {stats.totalScore > 0 && ` · ${stats.totalScore} total points`}
            </p>
          )}
          {(!stats || stats.totalSessions === 0) && (
            <p className="text-body-lg text-stone mt-2">
              Ready to begin? Choose a game below.
            </p>
          )}
        </div>

        {/* Last session summary */}
        {lastSessionSummary && (
          <div className="mb-4 p-5 bg-white rounded-warm-lg border-l-4 border-forest shadow-warm animate-fade-in">
            <p className="text-sm font-semibold text-forest mb-1 uppercase tracking-wide">Last Session</p>
            <p className="text-body text-stone">{lastSessionSummary}</p>
          </div>
        )}

        {/* AI insight */}
        {(aiEncouragement || aiInsights) && (
          <div className="mb-8 p-6 bg-amber-pale border border-amber-light rounded-warm-lg animate-fade-in">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-amber flex-shrink-0 mt-1" />
              <div>
                {aiEncouragement && (
                  <p className="text-body text-stone mb-1">{aiEncouragement}</p>
                )}
                {aiInsights && aiInsights !== aiEncouragement && (
                  <p className="text-body text-stone-light italic">{aiInsights}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Complete profile banner */}
        {profile && profile.interests.length === 0 && (
          <Link href="/survey">
            <div className="mb-8 p-6 bg-forest-pale border-2 border-forest-light rounded-warm-lg cursor-pointer hover:bg-forest-pale/80 transition-colors animate-slide-up">
              <div className="flex items-center gap-4">
                <ClipboardList className="w-8 h-8 text-forest flex-shrink-0" />
                <div>
                  <p className="text-body-lg font-semibold text-forest-dark">Complete Your Profile</p>
                  <p className="text-body text-stone">Take the preference survey so we can personalize your games.</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Games section */}
        <div className="mb-5">
          <h2 className="font-serif text-heading font-bold text-forest-dark">
            {recommendations.length > 0 ? 'Recommended for You' : 'Brain Games'}
          </h2>
        </div>

        {dataLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-warm-lg shadow-warm p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-cream-deep rounded-warm-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-cream-deep rounded w-1/3 mb-3" />
                    <div className="h-4 bg-cream-deep rounded w-2/3" />
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

        {profile && profile.interests.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/survey"
              className="text-body text-forest hover:text-forest-dark transition-colors border-b border-forest/30 hover:border-forest pb-0.5"
            >
              Retake the preference survey
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
