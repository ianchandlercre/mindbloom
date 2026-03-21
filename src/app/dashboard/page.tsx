'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Brain,
  BookOpen,
  Layers,
  GitBranch,
  Calculator,
  Compass,
  Clock,
  Shuffle,
  TrendingUp,
  Flame,
  BarChart2,
  ClipboardList,
  Leaf,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';

// ===== Game card definitions =====
const GAMES = [
  {
    id: 'knowledge-quiz',
    name: 'Story Detective',
    description: 'Answer trivia questions drawn from history, culture, and everyday knowledge.',
    icon: BookOpen,
    color: 'forest',
    difficulty: 'Gentle',
  },
  {
    id: 'memory-match',
    name: 'Memory Journey',
    description: 'Flip cards and match pairs — a classic exercise for your recall.',
    icon: Layers,
    color: 'amber',
    difficulty: 'Moderate',
  },
  {
    id: 'word-connection',
    name: 'Word Weaver',
    description: 'Connect words by meaning, category, or association.',
    icon: GitBranch,
    color: 'sage',
    difficulty: 'Gentle',
  },
  {
    id: 'number-crunch',
    name: 'Number Flow',
    description: 'Solve simple math problems and keep your numerical thinking sharp.',
    icon: Calculator,
    color: 'wood',
    difficulty: 'Moderate',
  },
  {
    id: 'pattern-finder',
    name: 'Map Explorer',
    description: 'Spot the pattern in a sequence and discover what comes next.',
    icon: Compass,
    color: 'forest',
    difficulty: 'Moderate',
  },
  {
    id: 'sequence-recall',
    name: 'Era Quiz',
    description: 'Remember and recall historical sequences, timelines, and events.',
    icon: Clock,
    color: 'amber',
    difficulty: 'Challenging',
  },
  {
    id: 'word-scramble',
    name: 'Pattern Garden',
    description: 'Unscramble letters and tend your vocabulary, one word at a time.',
    icon: Shuffle,
    color: 'sage',
    difficulty: 'Gentle',
  },
] as const;

const DIFFICULTY_BADGE: Record<string, string> = {
  Gentle: 'badge-forest',
  Moderate: 'badge-amber',
  Challenging: 'badge-wood',
};

const ICON_CLASS: Record<string, string> = {
  forest: 'bg-forest-100 text-forest-600',
  amber:  'bg-amber-100 text-amber-700',
  sage:   'bg-sage-100 text-sage-600',
  wood:   'bg-wood-100 text-wood-600',
};

function getTimeGreeting(name: string): string {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: userLoading, logout } = useUser();
  const { stats, aiInsights, aiEncouragement, loading: dataLoading } = useAdaptive(user?.id, profile);

  useEffect(() => {
    if (!userLoading && !user) router.push('/');
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center animate-gentle-pulse">
          <Brain className="w-16 h-16 text-forest-600 mx-auto mb-4" />
          <p className="text-body-lg text-bark-light">Loading your garden...</p>
        </div>
      </div>
    );
  }

  const greeting = getTimeGreeting(user.name);
  const insight = aiEncouragement || aiInsights
    || 'Every day you practice, you are investing in the health of your mind. You are doing great.';

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b border-cream-300"
        style={{ background: 'rgba(250, 247, 240, 0.95)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-7 h-7 text-forest-600" />
            <span
              className="text-heading-sm text-bark font-bold"
              style={{ fontFamily: '"Palatino Linotype", Palatino, Georgia, serif' }}
            >
              MindBloom
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/profile"
              className="text-body text-forest-700 hover:text-forest-900 font-medium transition-colors"
            >
              My Profile
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-2 text-body text-bark-lighter hover:text-bark transition-colors"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── Greeting ── */}
        <section className="animate-fade-in">
          <h1 className="text-heading-lg text-bark mb-2">{greeting}</h1>
          {stats && stats.streak > 0 ? (
            <div className="flex items-center gap-2 text-body-lg text-amber-700">
              <Flame className="w-6 h-6" aria-hidden="true" />
              <span>{stats.streak}-day streak — keep the momentum going!</span>
            </div>
          ) : (
            <p className="text-body-lg text-bark-light">
              Ready to exercise your mind? Choose a game below to begin.
            </p>
          )}
        </section>

        {/* ── Your Brain Today ── */}
        <section className="animate-slide-up">
          <div
            className="lodge-card p-7"
            style={{
              background: 'linear-gradient(135deg, #f0f7f0 0%, #faf7f0 60%, #fdf4d6 100%)',
              borderLeft: '4px solid #3d8b3d',
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-6 h-6 text-forest-600" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-heading-sm text-bark mb-2">Your Brain Today</h2>
                <p className="text-body-lg text-bark-light leading-relaxed">
                  {dataLoading ? 'Gathering your insights...' : insight}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Profile Banner ── */}
        {profile && profile.interests.length === 0 && (
          <section>
            <Link href="/survey">
              <div className="lodge-card p-6 border-2 border-amber-300 bg-amber-50 hover:shadow-lodge-md transition-all duration-200 cursor-pointer animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lodge flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-6 h-6 text-amber-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-heading-sm text-bark">Personalize Your Experience</p>
                    <p className="text-body text-bark-light mt-1">
                      Take a 5-minute survey so we can tailor your games and suggestions.
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-bark-lighter flex-shrink-0" aria-hidden="true" />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ── Brain Games ── */}
        <section>
          <h2 className="text-heading text-bark mb-5">Brain Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map(game => {
              const Icon = game.icon;
              return (
                <Link key={game.id} href={`/game/${game.id}`}>
                  <div
                    className="lodge-card-hover p-6 flex flex-col h-full cursor-pointer"
                    style={{ minHeight: '190px' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lodge flex items-center justify-center ${ICON_CLASS[game.color]}`}>
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <span className={DIFFICULTY_BADGE[game.difficulty]}>
                        {game.difficulty}
                      </span>
                    </div>
                    <h3 className="text-heading-sm text-bark mb-2">{game.name}</h3>
                    <p className="text-body text-bark-light flex-1 leading-relaxed">
                      {game.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-body font-semibold text-forest-600">
                      <Leaf className="w-4 h-4" aria-hidden="true" />
                      <span>Play now</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Weekly Brain Report ── */}
        <section>
          <h2 className="text-heading text-bark mb-5">Weekly Brain Report</h2>

          {dataLoading ? (
            <div className="lodge-card p-7 animate-gentle-pulse">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="text-center space-y-3">
                    <div className="w-12 h-12 bg-cream-300 rounded-full mx-auto" />
                    <div className="h-7 bg-cream-300 rounded w-12 mx-auto" />
                    <div className="h-4 bg-cream-300 rounded w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ) : stats ? (
            <div className="lodge-card p-7">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart2 className="w-6 h-6 text-forest-600" aria-hidden="true" />
                  </div>
                  <p className="text-heading text-bark font-bold">{stats.totalSessions ?? 0}</p>
                  <p className="text-body text-bark-light">Games Played</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-6 h-6 text-amber-600" aria-hidden="true" />
                  </div>
                  <p className="text-heading text-bark font-bold">{stats.streak ?? 0}</p>
                  <p className="text-body text-bark-light">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-sage-600" aria-hidden="true" />
                  </div>
                  <p className="text-heading text-bark font-bold">{stats.averageAccuracy ?? 0}%</p>
                  <p className="text-body text-bark-light">Avg. Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-wood-600" aria-hidden="true" />
                  </div>
                  <p className="text-heading text-bark font-bold">{stats.totalScore ?? 0}</p>
                  <p className="text-body text-bark-light">Total Score</p>
                </div>
              </div>

              {(!stats.totalSessions || stats.totalSessions === 0) && (
                <div className="mt-6 pt-6 border-t border-cream-300 text-center">
                  <p className="text-body text-bark-light">
                    Play your first game to start building your report.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="lodge-card p-8 text-center">
              <Brain className="w-12 h-12 text-forest-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-body-lg text-bark-light">
                Play a few games to see your progress here.
              </p>
            </div>
          )}
        </section>

        {/* Retake survey */}
        {profile && profile.interests.length > 0 && (
          <div className="text-center pb-6">
            <Link href="/survey" className="text-body text-forest-600 hover:text-forest-800 transition-colors">
              Retake the preference survey
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
