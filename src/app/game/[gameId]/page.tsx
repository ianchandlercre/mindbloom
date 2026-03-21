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

const difficultyLabels = ['', 'Easy', 'Comfortable', 'Moderate', 'Challenging', 'Advanced'];

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile, loading } = useUser();

  const gameId = params.gameId as GameType;
  const difficulty = parseInt(searchParams.get('difficulty') || '2');
  const config = getGameConfig(gameId);

  const { gameState, accuracy, showFeedback, aiEncouragement, startGame, recordAnswer, completeGame, submitFeedback } = useGameSession(
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

  const defaultRounds = gameId === 'memory-journey' ? 1 : 8;

  const handleStart = () => {
    startGame(defaultRounds);
    setStarted(true);
  };

  const handleFeedbackSubmit = (feedback: any) => submitFeedback(feedback);
  const handleFeedbackSkip = () => submitFeedback({ enjoyment: 3, difficulty: 'just_right', playAgain: 'maybe' });

  const IconComponent = GAME_ICONS[gameId] || Star;

  // Post-game feedback
  if (showFeedback) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-body text-soft-blue hover:text-soft-blue-dark">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <PostGameSurvey onSubmit={handleFeedbackSubmit} onSkip={handleFeedbackSkip} />
        </main>
      </div>
    );
  }

  // Game complete summary
  if (gameState.isComplete && !showFeedback && started) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-body text-soft-blue hover:text-soft-blue-dark">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-warm-lg shadow-warm-md p-10 max-w-md mx-auto animate-slide-up">
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <Star className="w-8 h-8 text-sage-dark fill-sage/30" />
            </div>
            <h2 className="text-heading font-bold text-warm-gray mb-3">Well Done!</h2>
            <p className="text-body-lg text-warm-gray mb-1">Score: {gameState.score} points</p>
            <p className="text-body text-warm-gray-light mb-6">Accuracy: {accuracy}%</p>

            {aiEncouragement && (
              <div className="mb-6 p-4 bg-soft-blue/10 rounded-warm border border-soft-blue/20">
                <p className="text-body text-warm-gray italic">{aiEncouragement}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setAiRounds(null); setStarted(false); fetchAIContent(); }}
                className="py-4 px-8 bg-soft-blue text-white rounded-warm text-body-lg font-medium hover:bg-soft-blue-dark transition-colors"
              >
                Play Again
              </button>
              <Link href="/dashboard"
                className="py-4 px-8 bg-cream text-warm-gray rounded-warm text-body-lg font-medium hover:bg-cream-dark transition-colors text-center">
                Try Another Game
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Pre-game intro
  if (!started) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-body text-soft-blue hover:text-soft-blue-dark">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center animate-slide-up max-w-lg mx-auto">
            <div className="w-20 h-20 bg-soft-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconComponent className="w-10 h-10 text-soft-blue" />
            </div>
            <h1 className="text-heading-lg font-bold text-warm-gray mb-3">{config.name}</h1>
            <p className="text-body-lg text-warm-gray-light mb-8 leading-relaxed">{config.description}</p>

            <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
              <span className="px-4 py-2 bg-white rounded-warm shadow-warm text-body text-warm-gray">
                {difficultyLabels[difficulty] || 'Moderate'}
              </span>
              {gameId !== 'memory-journey' && (
                <span className="px-4 py-2 bg-white rounded-warm shadow-warm text-body text-warm-gray">
                  {defaultRounds} rounds
                </span>
              )}
              {aiRounds && aiRounds.length > 0 && (
                <span className="px-4 py-2 bg-soft-blue/10 border border-soft-blue/30 rounded-warm text-body text-soft-blue font-medium">
                  Personalised for you
                </span>
              )}
            </div>

            <button
              onClick={handleStart}
              className="py-5 px-14 bg-soft-blue text-white rounded-warm-lg text-body-lg font-semibold hover:bg-soft-blue-dark transition-all shadow-warm-md hover:shadow-warm-lg"
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
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-body text-soft-blue hover:text-soft-blue-dark">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <IconComponent className="w-5 h-5 text-warm-gray" />
            <span className="text-body font-bold text-warm-gray">{config.name}</span>
          </div>
          <span className="text-body text-warm-gray-light">Score: {gameState.score}</span>
        </div>
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
