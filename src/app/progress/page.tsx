'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { getGameConfig } from '@/lib/game-data';
import { GameType } from '@/types';
import { ArrowLeft, Calendar, Clock, TrendingUp, Award } from 'lucide-react';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDuration(seconds: number): string {
  if (!seconds) return '—';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const difficultyLabels: Record<number, string> = { 1: 'Easy', 2: 'Comfortable', 3: 'Moderate', 4: 'Challenging', 5: 'Advanced' };

export default function ProgressPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [sessions, setSessions] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/sessions?userId=${user.id}`)
      .then(r => r.json())
      .then(d => {
        setSessions((d.sessions || []).slice(0, 20));
        setDataLoading(false);
      })
      .catch(() => setDataLoading(false));
  }, [user?.id]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-2 border-soft-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalSessions = sessions.length;
  const avgAccuracy = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / totalSessions)
    : 0;
  const bestScore = totalSessions > 0
    ? Math.max(...sessions.map(s => s.score || 0))
    : 0;
  const gamesPlayed = new Set(sessions.map(s => s.game_type || s.gameType)).size;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-body font-medium text-soft-blue hover:text-soft-blue-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
          <span className="text-warm-gray-light mx-1">|</span>
          <h1 className="text-body font-bold text-warm-gray">Your Progress</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Summary stats */}
        {!dataLoading && totalSessions > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fade-in">
            <div className="bg-white rounded-warm-lg shadow-warm p-5 text-center">
              <p className="text-2xl font-bold text-warm-gray">{totalSessions}</p>
              <p className="text-sm text-warm-gray-light mt-1">sessions</p>
            </div>
            <div className="bg-white rounded-warm-lg shadow-warm p-5 text-center">
              <p className="text-2xl font-bold text-warm-gray">{avgAccuracy}%</p>
              <p className="text-sm text-warm-gray-light mt-1">avg accuracy</p>
            </div>
            <div className="bg-white rounded-warm-lg shadow-warm p-5 text-center">
              <p className="text-2xl font-bold text-warm-gray">{bestScore}</p>
              <p className="text-sm text-warm-gray-light mt-1">best score</p>
            </div>
            <div className="bg-white rounded-warm-lg shadow-warm p-5 text-center">
              <p className="text-2xl font-bold text-warm-gray">{gamesPlayed}</p>
              <p className="text-sm text-warm-gray-light mt-1">game types</p>
            </div>
          </div>
        )}

        {/* Session list */}
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-soft-blue" />
          <h2 className="text-heading font-bold text-warm-gray">Recent Sessions</h2>
        </div>

        {dataLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-warm-lg shadow-warm p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-4 bg-cream-dark rounded w-1/3 mb-2" />
                    <div className="h-3 bg-cream-dark rounded w-1/4" />
                  </div>
                  <div className="h-8 w-14 bg-cream-dark rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-warm-lg shadow-warm p-10 text-center animate-fade-in">
            <div className="w-14 h-14 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7 text-warm-gray-light" />
            </div>
            <p className="text-body-lg font-semibold text-warm-gray mb-2">No sessions yet</p>
            <p className="text-body text-warm-gray-light mb-6">
              Play your first game and your results will appear here.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-soft-blue text-white rounded-warm text-body font-semibold hover:bg-soft-blue-dark transition-colors"
            >
              Choose a Game
            </Link>
          </div>
        ) : (
          <div className="space-y-3 animate-slide-up">
            {sessions.map((session, i) => {
              const gameType = session.game_type || session.gameType;
              const config = getGameConfig(gameType as GameType);
              const acc = Math.round(session.accuracy || 0);
              const accentColor =
                acc >= 80 ? 'border-l-forest-600' :
                acc >= 60 ? 'border-l-amber-500' :
                'border-l-wood-500';
              const accBadge =
                acc >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                acc >= 60 ? 'bg-amber-50 text-amber-800 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <div
                  key={session.id || i}
                  className={`bg-white rounded-warm-lg shadow-warm p-5 border-l-4 ${
                    acc >= 80 ? 'border-l-green-500' :
                    acc >= 60 ? 'border-l-amber-400' :
                    'border-l-rose-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-semibold text-warm-gray">
                        {config?.name || gameType}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-sm text-warm-gray-light">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(session.created_at || session.createdAt)}
                        </span>
                        {session.duration > 0 && (
                          <span className="flex items-center gap-1 text-sm text-warm-gray-light">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDuration(session.duration)}
                          </span>
                        )}
                        {session.difficulty && (
                          <span className="text-sm text-warm-gray-light">
                            {difficultyLabels[session.difficulty] || ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-body-lg font-bold text-warm-gray">{session.score || 0}</p>
                        <p className="text-xs text-warm-gray-light">points</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-warm border text-sm font-semibold ${accBadge}`}>
                        {acc}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sessions.length > 0 && (
          <div className="text-center mt-8 pb-4">
            <Link href="/dashboard" className="text-body text-warm-gray-light hover:text-warm-gray transition-colors">
              Back to your games
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
