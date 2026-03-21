'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TreePine,
  Brain,
  BookOpen,
  Layers,
  Type,
  Hash,
  Compass,
  Clock,
  Grid2X2,
  ChevronRight,
  Flame,
  TrendingUp,
  BarChart3,
  ClipboardList,
  LogOut,
  User,
  Sparkles,
  Star,
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useAdaptive } from '@/hooks/useAdaptive';
import { getTimeGreeting } from '@/lib/adaptive-engine';
import { GameType } from '@/types';

// ===== Game card definitions =====

interface GameCardDef {
  gameId: GameType;
  displayName: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  difficultyLabel: string;
  difficultyColor: string;
  primaryDimension: string;
}

const GAME_CARDS: GameCardDef[] = [
  {
    gameId: 'knowledge-quiz',
    displayName: 'Story Detective',
    tagline: 'Trivia & Knowledge',
    description: 'Answer questions about history, science, and topics you love. Every round reveals a fascinating fact.',
    icon: BookOpen,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    difficultyLabel: 'Flexible',
    difficultyColor: 'badge-amber',
    primaryDimension: 'Memory',
  },
  {
    gameId: 'memory-match',
    displayName: 'Memory Journey',
    tagline: 'Matching & Recall',
    description: 'Flip cards to find matching pairs. Themed card sets — from nature to music — keep every game fresh.',
    icon: Layers,
    iconBg: 'bg-forest-100',
    iconColor: 'text-forest-700',
    difficultyLabel: 'Gentle Start',
    difficultyColor: 'badge-forest',
    primaryDimension: 'Memory',
  },
  {
    gameId: 'word-connection',
    displayName: 'Word Weaver',
    tagline: 'Vocabulary & Connections',
    description: 'Find the word that connects to a clue. Strengthen your vocabulary and sharpen word associations.',
    icon: Type,
    iconBg: 'bg-sage-100',
    iconColor: 'text-sage-600',
    difficultyLabel: 'Flexible',
    difficultyColor: 'badge-sage',
    primaryDimension: 'Verbal',
  },
  {
    gameId: 'number-crunch',
    displayName: 'Number Flow',
    tagline: 'Mental Math',
    description: 'Quick arithmetic at your own pace — no pen needed. Adapts to keep you challenged but never overwhelmed.',
    icon: Hash,
    iconBg: 'bg-wood-100',
    iconColor: 'text-wood-700',
    difficultyLabel: 'Adaptive',
    difficultyColor: 'badge-wood',
    primaryDimension: 'Logical',
  },
  {
    gameId: 'sequence-recall',
    displayName: 'Map Explorer',
    tagline: 'Sequence & Pattern',
    description: 'Watch a pattern light up, then repeat it from memory. Each round stretches your attention a little further.',
    icon: Compass,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    difficultyLabel: 'Progressive',
    difficultyColor: 'badge-amber',
    primaryDimension: 'Memory',
  },
  {
    gameId: 'word-scramble',
    displayName: 'Era Quiz',
    tagline: 'Word & Language',
    description: 'Unscramble letters to reveal words drawn from history, nature, cooking, and more topics you enjoy.',
    icon: Clock,
    iconBg: 'bg-forest-100',
    iconColor: 'text-forest-700',
    difficultyLabel: 'Flexible',
    difficultyColor: 'badge-forest',
    primaryDimension: 'Verbal',
  },
  {
    gameId: 'pattern-finder',
    displayName: 'Pattern Garden',
    tagline: 'Logic & Sequences',
    description: 'Spot the rule in a number or shape sequence and choose what comes next. A satisfying mental workout.',
    icon: Grid2X2,
    iconBg: 'bg-sage-100',
    iconColor: 'text-sage-600',
    difficultyLabel: 'Challenging',
    difficultyColor: 'badge-sage',
    primaryDimension: 'Logical',
  },
];

// ===== Stat Card =====

function StatCard({ label, value, icon: Icon, color }: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lodge-lg p-4 shadow-lodge border border-stone-200/60">
      <div className="flex items-center gap-3 mb-1">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm font-semibold text-stone-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-stone-900 leading-none">{value}</p>
    </div>
  );
}

// ===== Game Card Component =====

function GameCard({ game, rank }: { game: GameCardDef; rank: number }) {
  const Icon = game.icon;

  return (
    <Link
      href={`/game/${game.gameId}`}
      className="card-hover group block"
      aria-label={`Play ${game.displayName}`}
    >
      <div className="p-5 flex items-start gap-4">

        {/* Icon */}
        <div className={`game-icon-circle ${game.iconBg} flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${game.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="text-xl font-bold text-stone-900 leading-tight">{game.displayName}</h3>
            {rank === 0 && (
              <span className="badge badge-amber text-xs">
                <Star className="w-3 h-3 mr-1" />
                Top Pick
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-2">{game.tagline}</p>
          <p className="text-body text-stone-600 leading-snug">{game.description}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className={`badge ${game.difficultyColor} text-xs`}>{game.difficultyLabel}</span>
            <span className="text-sm text-stone-400">{game.primaryDimension} skills</span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-6 h-6 text-stone-300 group-hover:text-forest-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

// ===== Dashboard Page =====

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: userLoading, logout } = useUser();
  const {
    stats,
    aiInsights,
    aiEncouragement,
    lastSessionSummary,
    loading: dataLoading,
  } = useAdaptive(user?.id, profile);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
            <Brain className="w-8 h-8 text-forest-600" />
          </div>
          <p className="text-body-lg text-stone-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const greeting = getTimeGreeting(user.name);
  const hasStats = stats && stats.totalSessions > 0;

  return (
    <div className="min-h-screen bg-cream">

      {/* ===== Header ===== */}
      <header className="sticky top-0 z-20 bg-forest-800 border-b border-forest-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-600/40 flex items-center justify-center">
              <TreePine className="w-5 h-5 text-forest-300" />
            </div>
            <span className="text-body font-bold text-white">MindBloom</span>
          </div>

          <nav className="flex items-center gap-1">
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lodge text-forest-200 hover:text-white hover:bg-forest-700 transition-colors text-body font-medium"
              style={{ minHeight: '44px' }}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Profile</span>
            </Link>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lodge text-forest-300 hover:text-white hover:bg-forest-700 transition-colors text-body"
              style={{ minHeight: '44px' }}
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ===== Hero Greeting ===== */}
        <section className="animate-fade-in">
          <h1 className="text-heading-lg font-bold text-stone-900 mb-2">{greeting}</h1>
          {hasStats && stats.streak > 0 ? (
            <p className="text-body-lg text-amber-700 flex items-center gap-2 font-medium">
              <Flame className="w-5 h-5 text-amber-500" />
              {stats.streak} day streak — wonderful consistency!
            </p>
          ) : (
            <p className="text-body-lg text-stone-500 leading-relaxed">
              Ready to give your mind a great workout? Choose a game below to get started.
            </p>
          )}
        </section>

        {/* ===== Your Brain Today Card ===== */}
        {(aiEncouragement || aiInsights || lastSessionSummary) && !dataLoading && (
          <section className="animate-slide-up">
            <div className="card overflow-hidden">
              {/* Card header */}
              <div className="bg-forest-800 px-5 py-4 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Your Brain Today</h2>
              </div>

              <div className="p-5 space-y-4">
                {lastSessionSummary && (
                  <div>
                    <p className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-1">Last Session</p>
                    <p className="text-body text-stone-700 leading-relaxed">{lastSessionSummary}</p>
                  </div>
                )}
                {aiEncouragement && (
                  <div>
                    <p className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-1">Encouragement</p>
                    <p className="text-body text-stone-700 leading-relaxed">{aiEncouragement}</p>
                  </div>
                )}
                {aiInsights && aiInsights !== aiEncouragement && (
                  <div>
                    <p className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-1">Insight</p>
                    <p className="text-body text-stone-600 italic leading-relaxed">{aiInsights}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ===== Complete Profile Banner ===== */}
        {profile && profile.interests.length === 0 && (
          <section className="animate-slide-up">
            <Link href="/survey" className="block card border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 transition-colors">
              <div className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lodge bg-amber-200 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-amber-700" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-stone-900 mb-0.5">Personalize Your Experience</p>
                  <p className="text-body text-stone-600">Take a 2-minute survey so we can tailor your games just for you.</p>
                </div>
                <ChevronRight className="w-6 h-6 text-amber-600 flex-shrink-0" />
              </div>
            </Link>
          </section>
        )}

        {/* ===== Game Grid ===== */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading font-bold text-stone-900">Brain Games</h2>
            <span className="text-sm text-stone-400 font-medium">{GAME_CARDS.length} games available</span>
          </div>

          {dataLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lodge-lg bg-stone-100" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-stone-100 rounded w-1/3" />
                      <div className="h-4 bg-stone-100 rounded w-2/3" />
                      <div className="h-4 bg-stone-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {GAME_CARDS.map((game, i) => (
                <GameCard key={game.gameId} game={game} rank={i} />
              ))}
            </div>
          )}
        </section>

        {/* ===== Weekly Brain Report ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-forest-600" />
            <h2 className="text-heading font-bold text-stone-900">Weekly Brain Report</h2>
          </div>

          {hasStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard
                label="Games Played"
                value={stats.totalSessions}
                icon={TrendingUp}
                color="text-forest-600"
              />
              <StatCard
                label="Day Streak"
                value={stats.streak > 0 ? `${stats.streak} days` : 'Start today!'}
                icon={Flame}
                color="text-amber-600"
              />
              <StatCard
                label="Avg Accuracy"
                value={`${stats.averageAccuracy}%`}
                icon={Star}
                color="text-sage-600"
              />
              {stats.totalScore > 0 && (
                <StatCard
                  label="Total Points"
                  value={stats.totalScore.toLocaleString()}
                  icon={Sparkles}
                  color="text-amber-600"
                />
              )}
            </div>
          ) : (
            <div className="card p-6 text-center">
              <Brain className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-body-lg font-semibold text-stone-700 mb-1">No games played yet</p>
              <p className="text-body text-stone-400 leading-relaxed">
                Pick any game above to begin. Your progress and statistics will appear here after your first session.
              </p>
            </div>
          )}
        </section>

        {/* ===== Retake Survey Link ===== */}
        {profile && profile.interests.length > 0 && (
          <div className="text-center pb-4">
            <Link
              href="/survey"
              className="inline-link text-body text-forest-600 hover:text-forest-800 font-medium transition-colors border-b border-forest-300 hover:border-forest-600 pb-0.5"
            >
              Retake the personalization survey
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
