'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useGameSession } from '@/hooks/useGameSession';
import { getGameConfig } from '@/lib/game-data';
import { GameType, InterestArea } from '@/types';
import PostGameSurvey from '@/components/feedback/PostGameSurvey';
import {
  Search, Map, Layers, ShoppingBag, Clock, Flower2,
  BookOpen, Shuffle, Link2, ArrowLeft, Star,
} from 'lucide-react';

// New game components
import StoryDetective from '@/components/games/StoryDetective';
import MemoryJourney from '@/components/games/MemoryJourney';
import WordWeaver from '@/components/games/WordWeaver';
import NumberFlow from '@/components/games/NumberFlow';
import EraQuiz from '@/components/games/EraQuiz';
import PatternGarden from '@/components/games/PatternGarden';

// Legacy game components
import WordScramble from '@/components/games/WordScramble';
import WordConnection from '@/components/games/WordConnection';
import KnowledgeQuiz from '@/components/games/KnowledgeQuiz';

const GAME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'story-detective': Search,
  'memory-journey': Map,
  'word-weaver': Layers,
  'number-flow': ShoppingBag,
  'era-quiz': Clock,
  'pattern-garden': Flower2,
  'knowledge-quiz': BookOpen,
  'word-scramble': Shuffle,
  'word-connection': Link2,
};

// Rich color themes per game — gives each game a distinct identity
const GAME_THEMES: Record<string, { gradient: string; accent: string; light: string }> = {
  'story-detective': { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)', accent: '#92400e', light: '#fef3c7' },
  'memory-journey': { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%)', accent: '#1e3a5f', light: '#e0f2fe' },
  'word-weaver':    { gradient: 'linear-gradient(135deg, #166534 0%, #15803d 100%)', accent: '#166534', light: '#dcfce7' },
  'number-flow':    { gradient: 'linear-gradient(135deg, #1e40af 0%, #0369a1 100%)', accent: '#1e40af', light: '#dbeafe' },
  'era-quiz':       { gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)', accent: '#78350f', light: '#fef3c7' },
  'pattern-garden': { gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', accent: '#4c1d95', light: '#f5f3ff' },
  'knowledge-quiz': { gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', accent: '#0f172a', light: '#f1f5f9' },
  'word-scramble':  { gradient: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', accent: '#065f46', light: '#d1fae5' },
  'word-connection':{ gradient: 'linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%)', accent: '#6b21a8', light: '#faf5ff' },
};

const difficultyLabels = ['', 'Easy', 'Comfortable', 'Moderate', 'Challenging', 'Advanced'];

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile, loading } = useUser();

  const gameId = params.gameId as GameType;
  const difficulty = parseInt(searchParams.get('difficulty') || '2');
  const config = getGameConfig(gameId);

  const { gameState, accuracy, sessionDuration, showFeedback, aiEncouragement, startGame, recordAnswer, completeGame, showSurvey, submitFeedback } = useGameSession(
    user?.id || 0,
    gameId,
    difficulty
  );

  const [started, setStarted] = useState(false);
  const [aiRounds, setAiRounds] = useState<any[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  const fetchAIContent = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/content?userId=${user.id}&gameType=${gameId}&difficulty=${difficulty}`);
      const data = await res.json();
      if (data.rounds && data.rounds.length > 0) setAiRounds(data.rounds);
    } catch {
      // Silently fall back to static content
    }
  }, [user?.id, gameId, difficulty]);

  useEffect(() => {
    if (user?.id && config) fetchAIContent();
  }, [user?.id, config, fetchAIContent]);

  useEffect(() => {
    if (started && gameState.isComplete) {
      completeGame();
    }
  }, [gameState.isComplete, started, completeGame]);

  if (loading || !user || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-soft-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body-lg text-warm-gray-light">Loading...</p>
        </div>
      </div>
    );
  }

  const interests: InterestArea[] = profile?.interests || [];
  const preferredEra = (profile as any)?.preferredEra;
  const theme = GAME_THEMES[gameId] || GAME_THEMES['knowledge-quiz'];

  // Memory Journey uses pair-matching, not round-based progression.
  // Set totalRounds high so recordAnswer never prematurely ends the game.
  // MemoryJourney calls onComplete directly when all pairs are matched.
  const defaultRounds = gameId === 'memory-journey' ? 999 : 8;

  const handleStart = () => {
    startGame(defaultRounds);
    setStarted(true);
  };

  const handleFeedbackSubmit = (feedback: any) => submitFeedback(feedback);
  const handleFeedbackSkip = () => submitFeedback({ enjoyment: 3, difficulty: 'just_right', playAgain: 'maybe' });

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }

  function getPerformanceBadge(acc: number): { label: string; color: string } {
    if (acc >= 90) return { label: 'Outstanding', color: 'text-amber' };
    if (acc >= 75) return { label: 'Excellent', color: 'text-sage-dark' };
    if (acc >= 60) return { label: 'Good work', color: 'text-soft-blue' };
    if (acc >= 45) return { label: 'Keep going', color: 'text-warm-gray' };
    return { label: 'Practice makes perfect', color: 'text-warm-gray-light' };
  }

  const IconComponent = GAME_ICONS[gameId] || Star;

  // Game complete: unified results + optional survey + AI insights
  if (gameState.isComplete && started) {
    const badge = getPerformanceBadge(accuracy);
    const duration = sessionDuration || Math.round((Date.now() - gameState.startTime) / 1000);

    return (
      <div className="min-h-screen bg-cream">
        <header className="sticky top-0 z-10" style={{ background: theme.gradient }}>
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-body font-medium" style={{ color: theme.light }}>
              <ArrowLeft className="w-5 h-5" />
              Back to Games
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="max-w-lg mx-auto space-y-5">

            {/* Results card */}
            {!showFeedback && (
              <div className="bg-white rounded-warm-lg shadow-warm-md p-8 animate-slide-up">
                {/* Header */}
                <div className="text-center mb-7">
                  <div className="w-16 h-16 bg-amber/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-amber" fill="currentColor" />
                  </div>
                  <h2 className="text-heading-lg font-bold text-warm-gray mb-1">
                    {accuracy >= 80 ? 'Well done!' : accuracy >= 55 ? 'Good effort!' : 'Keep practising!'}
                  </h2>
                  <p className={`text-body-lg font-semibold ${badge.color}`}>{badge.label}</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                  <div className="bg-cream rounded-warm p-4 text-center">
                    <p className="text-2xl font-bold text-warm-gray">{gameState.score}</p>
                    <p className="text-sm text-warm-gray-light mt-1">points</p>
                  </div>
                  <div className="bg-cream rounded-warm p-4 text-center">
                    <p className="text-2xl font-bold text-warm-gray">{accuracy}%</p>
                    <p className="text-sm text-warm-gray-light mt-1">accuracy</p>
                  </div>
                  <div className="bg-cream rounded-warm p-4 text-center">
                    <p className="text-2xl font-bold text-warm-gray">{formatDuration(duration)}</p>
                    <p className="text-sm text-warm-gray-light mt-1">time</p>
                  </div>
                </div>

                {/* Correct / Incorrect breakdown */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="flex-1 bg-sage/15 rounded-warm p-3 text-center">
                    <p className="text-lg font-bold text-sage-dark">{gameState.correct}</p>
                    <p className="text-sm text-warm-gray-light">correct</p>
                  </div>
                  <div className="flex-1 bg-rose-50 rounded-warm p-3 text-center">
                    <p className="text-lg font-bold text-rose-600">{gameState.incorrect}</p>
                    <p className="text-sm text-warm-gray-light">incorrect</p>
                  </div>
                </div>

                {/* AI encouragement (after survey) */}
                {aiEncouragement && (
                  <div className="mb-7 p-4 bg-soft-blue/8 rounded-warm border-l-4 border-soft-blue animate-fade-in">
                    <p className="text-body text-warm-gray italic leading-relaxed">{aiEncouragement}</p>
                  </div>
                )}

                {/* Rate this game (only if survey not yet done and no AI yet) */}
                {!aiEncouragement && (
                  <button
                    onClick={showSurvey}
                    className="w-full py-3 px-6 bg-cream border-2 border-cream-dark text-warm-gray rounded-warm text-body font-medium hover:border-soft-blue/40 hover:bg-soft-blue/5 transition-all mb-4"
                  >
                    How was this game?
                  </button>
                )}

                {/* Primary actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setAiRounds(null); setStarted(false); fetchAIContent(); }}
                    className="py-4 px-8 text-white rounded-warm text-body-lg font-semibold transition-all shadow-warm-md"
                    style={{ background: theme.gradient }}
                  >
                    Play Again
                  </button>
                  <Link href="/dashboard"
                    className="py-4 px-8 bg-cream text-warm-gray rounded-warm text-body-lg font-medium hover:bg-cream-dark transition-colors text-center border border-cream-dark">
                    Choose Another Game
                  </Link>
                </div>
              </div>
            )}

            {/* Survey (inline, shown after clicking "How was this game?") */}
            {showFeedback && (
              <PostGameSurvey onSubmit={handleFeedbackSubmit} onSkip={handleFeedbackSkip} />
            )}

          </div>
        </main>
      </div>
    );
  }

  // Pre-game intro
  if (!started) {
    return (
      <div className="min-h-screen bg-cream">
        {/* Themed hero banner */}
        <div className="relative" style={{ background: theme.gradient }}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-4xl mx-auto px-4 pt-5 pb-10">
            <Link href="/dashboard" className="flex items-center gap-2 text-body font-medium mb-8" style={{ color: theme.light }}>
              <ArrowLeft className="w-5 h-5" />
              Back to Games
            </Link>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border-2" style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-heading-lg font-bold text-white mb-2">{config.name}</h1>
              <p className="text-body" style={{ color: theme.light }}>{config.shortDesc}</p>
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 -mt-4">
          <div className="bg-white rounded-warm-lg shadow-warm-lg p-8 animate-slide-up max-w-lg mx-auto">
            <p className="text-body-lg text-warm-gray-light mb-8 leading-relaxed text-center">{config.description}</p>

            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              <span className="px-4 py-2 bg-cream rounded-warm text-body text-warm-gray font-medium">
                {difficultyLabels[difficulty] || 'Moderate'} difficulty
              </span>
              {gameId !== 'memory-journey' && (
                <span className="px-4 py-2 bg-cream rounded-warm text-body text-warm-gray font-medium">
                  {defaultRounds} rounds
                </span>
              )}
              {aiRounds && aiRounds.length > 0 && (
                <span className="px-4 py-2 rounded-warm text-body font-semibold" style={{ backgroundColor: theme.light, color: theme.accent }}>
                  Personalised for you
                </span>
              )}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-5 px-14 text-white rounded-warm-lg text-body-lg font-semibold transition-all shadow-warm-md hover:shadow-warm-lg"
              style={{ background: theme.gradient }}
            >
              Start Playing
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Active game
  const gameProps = {
    difficulty,
    interests,
    onAnswer: recordAnswer,
    onComplete: completeGame,
    currentRound: gameState.currentRound,
    totalRounds: gameState.totalRounds,
    score: gameState.score,
    isComplete: gameState.isComplete,
    initialRounds: aiRounds || undefined,
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Themed game header — shows throughout gameplay */}
      <header className="sticky top-0 z-10" style={{ background: theme.gradient }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-body font-medium" style={{ color: theme.light }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2 text-white">
            <IconComponent className="w-5 h-5" />
            <span className="text-body font-bold">{config.name}</span>
          </div>
          <div className="text-right">
            <span className="text-body-lg font-bold text-white">{gameState.score}</span>
            <span className="text-sm font-medium ml-1" style={{ color: theme.light }}>pts</span>
          </div>
        </div>
        {/* Round progress bar */}
        {gameId !== 'memory-journey' && gameState.totalRounds > 0 && (
          <div className="max-w-4xl mx-auto px-4 pb-2.5">
            <div className="flex gap-1.5">
              {Array.from({ length: gameState.totalRounds }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i < gameState.currentRound - 1
                      ? 'rgba(255,255,255,0.9)'
                      : i === gameState.currentRound - 1
                      ? 'rgba(255,255,255,0.6)'
                      : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {gameId === 'story-detective' && <StoryDetective {...gameProps} />}
        {gameId === 'memory-journey' && (
          <MemoryJourney
            difficulty={difficulty}
            interests={interests}
            onAnswer={recordAnswer}
            onComplete={completeGame}
            score={gameState.score}
            isComplete={gameState.isComplete}
            initialRounds={aiRounds || undefined}
          />
        )}
        {gameId === 'word-weaver' && <WordWeaver {...gameProps} />}
        {gameId === 'number-flow' && <NumberFlow {...gameProps} />}
        {gameId === 'era-quiz' && <EraQuiz {...gameProps} preferredEra={preferredEra} />}
        {gameId === 'pattern-garden' && <PatternGarden {...gameProps} />}
        {gameId === 'knowledge-quiz' && <KnowledgeQuiz {...gameProps} />}
        {gameId === 'word-scramble' && <WordScramble {...gameProps} />}
        {gameId === 'word-connection' && <WordConnection {...gameProps} />}
      </main>
    </div>
  );
}
