'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';
import { getActiveGameConfigs } from '@/lib/game-data';
import GameCard from '@/components/dashboard/GameCard';
import { LogOut, User, Brain, ChevronRight, Activity, TrendingUp } from 'lucide-react';

function getTimeGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

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

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: userLoading, logout } = useUser();
  const { recommendations, stats, aiInsights, aiEncouragement, lastSessionSummary, loading: dataLoading } = useAdaptive(user?.id, profile);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [brainToday, setBrainToday] = useState<{ headline: string; body: string } | null>(null);

  useEffect(() => {
    if (!userLoading && !user) router.push('/');
  }, [user, userLoading, router]);

  // Load hero image and brain-today card
  useEffect(() => {
    if (!user?.id) return;
    // Try to load a generated hero image
    fetch(`/api/images?userId=${user.id}&purpose=dashboard`)
      .then(r => r.json())
      .then(d => { if (d.imageUrl) setHeroImage(d.imageUrl); })
      .catch(() => {});
    // Load brain today card
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

  // Determine theme color from profile (simple fallback)
  const themeColor = '#2D6A4F'; // forest green default

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
          {/* Background — image or gradient */}
          {heroImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, #1E3A5F 0%, #2D6A4F 50%, #744210 100%)` }}
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative px-8 py-10">
            <h1 className="text-heading-lg font-bold text-white mb-2 drop-shadow">{greeting}</h1>
            {stats && stats.streak > 0 && (
              <p className="text-body-lg text-white/80 mb-4">
                {stats.streak} day streak — wonderful consistency.
              </p>
            )}
            {stats && stats.totalSessions > 0 && (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
                  <p className="text-sm text-white/70">sessions</p>
                </div>
                <div className="w-px h-8 bg-white/30" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.averageAccuracy}%</p>
                  <p className="text-sm text-white/70">avg accuracy</p>
                </div>
                {stats.streak > 0 && (
                  <>
                    <div className="w-px h-8 bg-white/30" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{stats.streak}</p>
                      <p className="text-sm text-white/70">day streak</p>
                    </div>
                  </>
                )}
              </div>
            )}
            {(!stats || stats.totalSessions === 0) && (
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

        {/* Your Brain Today */}
        {!dataLoading && (
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-soft-blue" />
              <h2 className="text-heading font-bold text-warm-gray">Your Brain Today</h2>
            </div>
            <div className="bg-white rounded-warm-lg shadow-warm-md p-6 border-l-4 border-soft-blue">
              {brainToday ? (
                <>
                  <p className="text-body-lg font-semibold text-warm-gray mb-2">{brainToday.headline}</p>
                  <p className="text-body text-warm-gray-light">{brainToday.body}</p>
                </>
              ) : (aiEncouragement || lastSessionSummary) ? (
                <>
                  {lastSessionSummary && (
                    <p className="text-body text-warm-gray mb-2">{lastSessionSummary}</p>
                  )}
                  {aiEncouragement && (
                    <p className="text-body text-warm-gray-light italic">{aiEncouragement}</p>
                  )}
                </>
              ) : (
                // Warm daily tip when no AI data yet
                (() => {
                  const tip = getDailyTip();
                  return (
                    <>
                      <p className="text-body-lg font-semibold text-warm-gray mb-2">{tip.headline}</p>
                      <p className="text-body text-warm-gray-light">{tip.body}</p>
                    </>
                  );
                })()
              )}
              {aiInsights && aiInsights !== aiEncouragement && (
                <p className="text-body text-warm-gray-light mt-2 pt-2 border-t border-cream-dark">{aiInsights}</p>
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

            {/* Other recommendations */}
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

            {/* All games grid (if no recommendations yet) */}
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
