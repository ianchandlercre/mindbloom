'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useGameSession } from '@/hooks/useGameSession';
import { getGameConfig } from '@/lib/game-data';
import { GameType, InterestArea } from '@/types';
import PostGameSurvey from '@/components/feedback/PostGameSurvey';

import WordScramble from '@/components/games/WordScramble';
import WordConnection from '@/components/games/WordConnection';
import MemoryMatch from '@/components/games/MemoryMatch';
import SequenceRecall from '@/components/games/SequenceRecall';
import PatternFinder from '@/components/games/PatternFinder';
import NumberCrunch from '@/components/games/NumberCrunch';
import KnowledgeQuiz from '@/components/games/KnowledgeQuiz';

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile, loading } = useUser();

  const gameId = params.gameId as GameType;
  const difficulty = parseInt(searchParams.get('difficulty') || '2');
  const config = getGameConfig(gameId);

  const { gameState, accuracy, showFeedback, startGame, recordAnswer, completeGame, submitFeedback } = useGameSession(
    user?.id || 0,
    gameId,
    difficulty
  );

  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-gentle">🌱</div>
          <p className="text-body-lg text-warm-gray-light">Loading...</p>
        </div>
      </div>
    );
  }

  const interests: InterestArea[] = profile?.interests || [];

  const handleStart = () => {
    const rounds = gameId === 'memory-match' ? 1 : 8; // Memory match uses different scoring
    startGame(rounds);
    setStarted(true);
  };

  const handleFeedbackSubmit = (feedback: any) => {
    submitFeedback(feedback);
  };

  const handleFeedbackSkip = () => {
    submitFeedback({ enjoyment: 3, difficulty: 'just_right', playAgain: 'maybe' });
  };

  // Show post-game feedback
  if (showFeedback) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-body text-soft-blue hover:text-soft-blue-dark">
              ← Back to Games
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <PostGameSurvey onSubmit={handleFeedbackSubmit} onSkip={handleFeedbackSkip} />
        </main>
      </div>
    );
  }

  // Show game-complete summary (after feedback dismissed)
  if (gameState.isComplete && !showFeedback && started) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-body text-soft-blue hover:text-soft-blue-dark">
              ← Back to Games
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-warm-lg shadow-warm-md p-8 max-w-md mx-auto animate-slide-up">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-heading font-bold text-warm-gray mb-3">Well Done!</h2>
            <p className="text-body-lg text-warm-gray mb-1">Score: {gameState.score} points</p>
            <p className="text-body text-warm-gray-light mb-6">Accuracy: {accuracy}%</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setStarted(false); }}
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
              ← Back to Games
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center animate-slide-up">
            <div className="text-7xl mb-4">{config.emoji}</div>
            <h1 className="text-heading-lg font-bold text-warm-gray mb-3">{config.name}</h1>
            <p className="text-body-lg text-warm-gray-light mb-8 max-w-md mx-auto">{config.description}</p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="px-4 py-2 bg-white rounded-warm shadow-warm text-body">
                Difficulty: <span className="font-semibold">{['', 'Easy', 'Comfortable', 'Moderate', 'Challenging', 'Advanced'][difficulty]}</span>
              </span>
              {gameId !== 'memory-match' && (
                <span className="px-4 py-2 bg-white rounded-warm shadow-warm text-body">
                  8 rounds
                </span>
              )}
            </div>

            <button
              onClick={handleStart}
              className="py-5 px-12 bg-soft-blue text-white rounded-warm-lg text-body-lg font-semibold hover:bg-soft-blue-dark transition-all shadow-warm-md hover:shadow-warm-lg transform hover:scale-105"
            >
              Start Playing!
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
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 bg-cream/95 backdrop-blur-sm border-b border-cream-dark z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-body text-soft-blue hover:text-soft-blue-dark">
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.emoji}</span>
            <span className="text-body font-bold text-warm-gray">{config.name}</span>
          </div>
          <span className="text-body text-warm-gray-light">Score: {gameState.score}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {gameId === 'word-scramble' && <WordScramble {...gameProps} />}
        {gameId === 'word-connection' && <WordConnection {...gameProps} />}
        {gameId === 'memory-match' && (
          <MemoryMatch
            difficulty={difficulty}
            interests={interests}
            onAnswer={recordAnswer}
            onComplete={completeGame}
            score={gameState.score}
            isComplete={gameState.isComplete}
          />
        )}
        {gameId === 'sequence-recall' && <SequenceRecall difficulty={difficulty} onAnswer={recordAnswer} onComplete={completeGame} currentRound={gameState.currentRound} totalRounds={gameState.totalRounds} score={gameState.score} isComplete={gameState.isComplete} />}
        {gameId === 'pattern-finder' && <PatternFinder difficulty={difficulty} onAnswer={recordAnswer} onComplete={completeGame} currentRound={gameState.currentRound} totalRounds={gameState.totalRounds} score={gameState.score} isComplete={gameState.isComplete} />}
        {gameId === 'number-crunch' && <NumberCrunch difficulty={difficulty} onAnswer={recordAnswer} onComplete={completeGame} currentRound={gameState.currentRound} totalRounds={gameState.totalRounds} score={gameState.score} isComplete={gameState.isComplete} />}
        {gameId === 'knowledge-quiz' && <KnowledgeQuiz {...gameProps} />}
      </main>
    </div>
  );
}
