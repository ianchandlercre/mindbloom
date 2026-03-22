'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';
import { getActiveGameConfigs } from '@/lib/game-data';
import GameCard from '@/components/dashboard/GameCard';
import { LogOut, User, Brain, ChevronRight, Activity, TrendingUp, Calendar } from 'lucide-react';

const GAME_NAMES: Record<string, string> = {
  'story-detective': 'Story Detective',
  'memory-journey': 'Memory Journey',
  'word-weaver': 'Word Weaver',
  'number-flow': 'Number Flow',
  'era-quiz': 'Era Quiz',
  'pattern-garden': 'Pattern Garden',
  'knowledge-quiz': 'Knowledge Quiz',
  'word-scramble': 'Word Scramble',
  'word-connection': 'Word Connection',
};

const INTEREST_LABELS: Record<string, string> = {
  history: 'history', nature: 'nature', music: 'music', sports: 'sports',
  science: 'science', cooking: 'cooking', travel: 'travel', literature: 'literature',
  puzzles: 'puzzles', current_events: 'current events', art: 'art', animals: 'animals',
};

const NATURE_TIPS = [
  { headline: 'A good time to train your mind', body: 'Regular, gentle practice builds lasting mental strength more effectively than occasional long sessions. Even one game today counts.' },
  { headline: 'Curiosity keeps the mind alive', body: 'Every question you tackle strengthens the connections between ideas. Wondering is itself a cognitive exercise worth celebrating.' },
  { headline: 'Rest is part of the work', body: 'Your brain consolidates what you have practised while you sleep. A good night\'s rest makes tomorrow\'s games feel easier and more rewarding.' },
  { headline: 'Small steps build a long trail', body: 'Each session adds to your cognitive reserve — a lifetime of learning that pays dividends every decade.' },
  { headline: 'The mind, like a garden, rewards tending', body: 'Regular, gentle attention keeps mental pathways clear and growing. You are doing something wonderful for your future self.' },
  { headline: 'Nature restores, play sharpens', body: 'Time outdoors and brain games work beautifully together. Each refreshes a different kind of attention and keeps you at your best.' },
  { headline: 'Every season has its gifts', body: 'Some days scores will be higher, some lower — that is natural. What matters most is showing up and enjoying the journey.' },
];

function getDailyTip(): { headline: string; body: string } {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86_400_000);
  return NATURE_TIPS[dayOfYear % NATURE_TIPS.length];
}

function getTimeGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

function formatSessionDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function accuracyStyle(pct: number): { bg: string; color: string } {
  if (pct >= 80) return { bg: '#d1fae5', color: '#065f46' };
  if (pct >= 60) return { bg: '#fef3c7', color: '#92400e' };
  return { bg: '#fee2e2', color: '#991b1b' };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: userLoading, logout } = useUser();
  const { recommendations, sessions, stats, aiInsights, aiEncouragement, lastSessionSummary, loading: dataLoading } = useAdaptive(user?.id, profile);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [brainToday, setBrainToday] = useState<{ headline: string; body: string } | null>(null);

  useEffect(() => {
    if (!userLoading && !user) router.push('/');
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/images?userId=${user.id}&purpose=dashboard`)
      .then(r => r.json())
      .then(d => { if (d.imageUrl) setHeroImage(d.imageUrl); })
      .catch(() => {});
    fetch(`/api/user?userId=${user.id}&action=brain-today`)
      .then(r => r.json())
      .then(d => { if (d.brainToday) setBrainToday(d.brainToday); })
      .catch(() => {});
  }, [user?.id]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-soft-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body-lg text-warm-gray-light">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const greeting = getTimeGreeting(user.name);
  const topGame = recommendations[0] || null;
  const otherGames = recommendations.slice(1);
  const allGames = getActiveGameConfigs();
  const hasHistory = !dataLoading && stats && stats.totalSessions > 0;
  const recentSessions = sessions.slice(0, 6);

  // Brain Today content — always show something meaningful
  const brainTodayContent = (() => {
    if (brainToday) return brainToday;
    if (lastSessionSummary || aiEncouragement) {
      return {
        headline: lastSessionSummary ? 'Your Last Session' : 'Keep It Up',
        body: lastSessionSummary || aiEncouragement || '',
      };
    }
    // Interest-based fallback for users who have completed the survey
    if (profile && profile.interests.length > 0) {
      const labels = profile.interests.slice(0, 3).map(i => INTEREST_LABELS[i] || i);
      const interestText = labels.length === 1
        ? labels[0]
        : labels.length === 2
        ? `${labels[0]} and ${labels[1]}`
        : `${labels[0]}, ${labels[1]}, and ${labels[2]}`;
      return {
        headline: 'Your Mind Is Ready',
        body: `Today's games are tailored to your love of ${interestText}. Regular play — even just ten minutes — builds lasting memory and focus.`,
      };
    }
    // Rotating daily tip for new users with no profile yet
    return getDailyTip();
  })();

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-soft-blue rounded-warm flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-body font-bold text-warm-gray">MindBloom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/progress" className="flex items-center gap-1.5 text-body text-warm-gray-light hover:text-warm-gray transition-colors font-medium">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-1.5 text-body text-soft-blue hover:text-soft-blue-dark transition-colors font-medium">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-1.5 text-body text-warm-gray-light hover:text-warm-gray transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero Section */}
        <div className="relative rounded-warm-lg overflow-hidden mb-8 animate-fade-in">
          {heroImage ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #1E3A5F 0%, #2D6A4F 50%, #744210 100%)` }} />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative px-8 py-10">
            <h1 className="text-heading-lg font-bold text-white mb-2 drop-shadow">{greeting}</h1>
            {stats && stats.streak >= 2 && (
              <p className="text-body-lg text-white/80 mb-4">
                {stats.streak} days in a row — wonderful consistency.
              </p>
            )}
            {hasHistory ? (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats!.totalSessions}</p>
                  <p className="text-sm text-white/70">sessions</p>
                </div>
                <div className="w-px h-8 bg-white/30" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats!.averageAccuracy}%</p>
                  <p className="text-sm text-white/70">avg accuracy</p>
                </div>
                {stats!.streak >= 1 && (
                  <>
                    <div className="w-px h-8 bg-white/30" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{stats!.streak}</p>
                      <p className="text-sm text-white/70">{stats!.streak === 1 ? 'day active' : 'day streak'}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-body-lg text-white/80">
                Ready to exercise your mind? Your first game is waiting below.
              </p>
            )}
          </div>
        </div>

        {/* Complete Profile Banner */}
        {profile && profile.interests.length === 0 && (
          <Link href="/survey">
            <div className="mb-8 p-6 bg-amber/15 border-2 border-amber/40 rounded-warm-lg cursor-pointer hover:bg-amber/25 transition-colors animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-lg font-semibold text-warm-gray mb-1">Personalise Your Experience</p>
                  <p className="text-body text-warm-gray-light">Take a quick survey so we can choose games and topics you will genuinely enjoy.</p>
                </div>
                <ChevronRight className="w-6 h-6 text-warm-gray-light flex-shrink-0 ml-4" />
              </div>
            </div>
          </Link>
        )}

        {/* Your Brain Today — always visible */}
        {!dataLoading && (
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-soft-blue" />
              <h2 className="text-heading font-bold text-warm-gray">Your Brain Today</h2>
            </div>
            <div className="bg-white rounded-warm-lg shadow-warm-md p-6 border-l-4 border-soft-blue">
              <p className="text-body-lg font-semibold text-warm-gray mb-2">{brainTodayContent.headline}</p>
              <p className="text-body text-warm-gray-light">{brainTodayContent.body}</p>
              {aiInsights && aiInsights !== aiEncouragement && (
                <p className="text-body text-warm-gray-light mt-3 pt-3 border-t border-cream-dark">{aiInsights}</p>
              )}
            </div>
          </div>
        )}

        {/* Top recommended game */}
        {dataLoading ? (
          <div className="space-y-4 mb-8">
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
          <>
            {topGame && (
              <div className="mb-6">
                <GameCard game={topGame} rank={0} isHighlighted={true} />
              </div>
            )}
            {otherGames.length > 0 && (
              <div className="mb-8">
                <h2 className="text-heading font-bold text-warm-gray mb-4">More For You</h2>
                <div className="space-y-3">
                  {otherGames.map((game, i) => (
                    <GameCard key={game.config.id} game={game} rank={i + 1} />
                  ))}
                </div>
              </div>
            )}
            {recommendations.length === 0 && (
              <div className="mb-8">
                <h2 className="text-heading font-bold text-warm-gray mb-4">Brain Games</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allGames.map((config) => (
                    <Link key={config.id} href={`/game/${config.id}?difficulty=2`}>
                      <div className="bg-white rounded-warm-lg shadow-warm p-5 hover:shadow-warm-md transition-all border-2 border-transparent hover:border-soft-blue/20">
                        <h3 className="text-body-lg font-bold text-warm-gray mb-1">{config.name}</h3>
                        <p className="text-body text-warm-gray-light">{config.shortDesc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Your Journey — history section */}
        {hasHistory && (
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-soft-blue" />
              <h2 className="text-heading font-bold text-warm-gray">Your Journey</h2>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-warm shadow-warm p-4 text-center">
                <p className="text-2xl font-bold text-warm-gray">{stats!.totalSessions}</p>
                <p className="text-sm text-warm-gray-light">Games Played</p>
              </div>
              <div className="bg-white rounded-warm shadow-warm p-4 text-center">
                <p className="text-2xl font-bold text-warm-gray">{stats!.averageAccuracy}%</p>
                <p className="text-sm text-warm-gray-light">Avg Accuracy</p>
              </div>
              <div className="bg-white rounded-warm shadow-warm p-4 text-center">
                <p className="text-2xl font-bold text-warm-gray">{stats!.streak || 0}</p>
                <p className="text-sm text-warm-gray-light">Day Streak</p>
              </div>
              <div className="bg-white rounded-warm shadow-warm p-4 text-center">
                <p className="text-sm font-bold text-warm-gray leading-tight truncate px-1">
                  {GAME_NAMES[stats!.favoriteGame] || '—'}
                </p>
                <p className="text-sm text-warm-gray-light">Favourite Game</p>
              </div>
            </div>

            {/* Recent sessions list */}
            {recentSessions.length > 0 && (
              <div className="bg-white rounded-warm-lg shadow-warm overflow-hidden">
                <div className="px-5 py-3 border-b border-cream-dark flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-warm-gray-light" />
                  <p className="text-body font-semibold text-warm-gray">Recent Sessions</p>
                </div>
                <div className="divide-y divide-cream-dark">
                  {recentSessions.map((session: any, i: number) => {
                    const pct = Math.round(session.accuracy);
                    const style = accuracyStyle(pct);
                    const name = GAME_NAMES[session.game_type || session.gameType] || session.game_type || session.gameType || 'Game';
                    const dateStr = formatSessionDate(session.created_at || session.createdAt || '');
                    return (
                      <div key={session.id || i} className="px-5 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-body font-medium text-warm-gray">{name}</p>
                          <p className="text-sm text-warm-gray-light">{dateStr}</p>
                        </div>
                        <div
                          className="px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0"
                          style={{ backgroundColor: style.bg, color: style.color }}
                        >
                          {pct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Retake survey */}
        {profile && profile.interests.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/survey" className="text-body text-warm-gray-light hover:text-warm-gray transition-colors">
              Retake the preferences survey
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
