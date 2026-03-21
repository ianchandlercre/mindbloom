'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';
import { getTimeGreeting } from '@/lib/adaptive-engine';
import GameCard from '@/components/dashboard/GameCard';
import {
  Trees, Leaf, Sun, Brain, BarChart3, ClipboardList,
  Flame, Trophy, LogOut, UserCircle
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-cream-DEFAULT">
        <div className="text-center">
          <Leaf className="w-10 h-10 text-forest-500 mx-auto mb-4 animate-gentle-pulse" />
          <p className="text-body-lg text-bark-light">Loading your garden...</p>
        </div>
      </div>
    );
  }

  const greeting = getTimeGreeting(user.name);

  return (
    <div className="min-h-screen bg-cream-DEFAULT texture-paper">
      {/* Header */}
      <header className="sticky top-0 bg-cream-DEFAULT/95 backdrop-blur-sm border-b border-wood-100 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trees className="w-6 h-6 text-forest-600" />
            <span className="text-body font-display font-bold text-bark">MindBloom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-1 text-body text-forest-600 hover:text-forest-700 transition-colors font-medium">
              <UserCircle className="w-5 h-5" />
              Profile
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-1 text-body text-bark-lighter hover:text-bark transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero greeting */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-start gap-3 mb-2">
            <Sun className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-heading-lg font-display font-bold text-bark">{greeting}</h1>
              {stats && stats.streak > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <Flame className="w-5 h-5 text-amber-600" />
                  <p className="text-body-lg text-amber-700 font-medium">
                    {stats.streak} day streak — keep it going!
                  </p>
                </div>
              )}
            </div>
          </div>

          {stats && stats.totalSessions > 0 && (
            <p className="text-body text-bark-light mt-2 ml-11">
              You&apos;ve completed {stats.totalSessions} {stats.totalSessions === 1 ? 'session' : 'sessions'} with an average accuracy of {stats.averageAccuracy}%.
              {stats.totalScore > 0 && ` Total score: ${stats.totalScore} points.`}
            </p>
          )}

          {(!stats || stats.totalSessions === 0) && (
            <p className="text-body-lg text-bark-light mt-2 ml-11">
              Ready to exercise your mind? Pick a game below to get started.
            </p>
          )}
        </div>

        {/* AI Insights Card */}
        {(aiEncouragement || aiInsights || lastSessionSummary) && (
          <div className="lodge-card p-6 mb-6 animate-slide-up border-l-4 border-forest-400">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-forest-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-body font-semibold text-bark mb-1">Your Brain Today</h3>
                {lastSessionSummary && (
                  <p className="text-body text-bark-light mb-2">{lastSessionSummary}</p>
                )}
                {aiEncouragement && (
                  <p className="text-body text-bark-light">{aiEncouragement}</p>
                )}
                {aiInsights && aiInsights !== aiEncouragement && (
                  <p className="text-sm text-bark-lighter italic mt-2">{aiInsights}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Complete Profile Banner */}
        {profile && profile.interests.length === 0 && (
          <Link href="/survey">
            <div className="lodge-card p-6 mb-6 border-2 border-amber-300 bg-amber-50 cursor-pointer hover:shadow-lodge-md transition-all animate-slide-up">
              <div className="flex items-center gap-4">
                <ClipboardList className="w-8 h-8 text-amber-700 flex-shrink-0" />
                <div>
                  <p className="text-body-lg font-semibold text-bark">Complete Your Profile</p>
                  <p className="text-body text-bark-light">
                    Take a quick survey so we can personalize your games.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Games Section */}
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-forest-600" />
          <h2 className="text-heading font-display font-bold text-bark">
            {recommendations.length > 0 ? 'Recommended for You' : 'Brain Games'}
          </h2>
        </div>

        {dataLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="lodge-card p-6 animate-gentle-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-wood-100 rounded-lodge" />
                  <div className="flex-1">
                    <div className="h-5 bg-wood-100 rounded w-1/3 mb-3" />
                    <div className="h-4 bg-wood-100 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((game, i) => (
              <GameCard key={game.config.id} game={game} rank={i} />
            ))}
          </div>
        )}

        {/* Weekly Brain Report */}
        {stats && stats.totalSessions >= 3 && (
          <div className="mt-8 lodge-card p-6 animate-fade-in">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 text-sage-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-body-lg font-display font-semibold text-bark mb-1">Weekly Brain Report</h3>
                <p className="text-body text-bark-light">
                  You&apos;ve been active this week. Keep training consistently for your personalized
                  cognitive trends report, generated by our AI each week.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Retake Survey */}
        {profile && profile.interests.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/survey" className="inline-flex items-center gap-2 text-body text-forest-600 hover:text-forest-700 transition-colors font-medium">
              <ClipboardList className="w-4 h-4" />
              Retake personality survey
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
