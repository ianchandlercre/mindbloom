'use client';
import { useState, useCallback, useRef } from 'react';
import { GameState, GameType, GameFeedback } from '@/types';

export function useGameSession(userId: number, gameType: GameType, difficulty: number) {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    totalRounds: 8,
    score: 0,
    correct: 0,
    incorrect: 0,
    startTime: Date.now(),
    isComplete: false,
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [aiEncouragement, setAiEncouragement] = useState<string | null>(null);
  const savedRef = useRef(false);

  const startGame = useCallback((totalRounds = 8) => {
    setGameState({
      currentRound: 0,
      totalRounds,
      score: 0,
      correct: 0,
      incorrect: 0,
      startTime: Date.now(),
      isComplete: false,
    });
    setShowFeedback(false);
    setAiEncouragement(null);
    savedRef.current = false;
    setSessionId(null);
  }, []);

  const recordAnswer = useCallback((isCorrect: boolean, points = 10) => {
    setGameState(prev => {
      const newCorrect = prev.correct + (isCorrect ? 1 : 0);
      const newIncorrect = prev.incorrect + (isCorrect ? 0 : 1);
      const newScore = prev.score + (isCorrect ? points : 0);
      const newRound = prev.currentRound + 1;
      const isComplete = newRound >= prev.totalRounds;

      return {
        ...prev,
        currentRound: newRound,
        score: newScore,
        correct: newCorrect,
        incorrect: newIncorrect,
        isComplete,
      };
    });
  }, []);

  const completeGame = useCallback(async () => {
    if (savedRef.current) return;
    savedRef.current = true;

    const duration = Math.round((Date.now() - gameState.startTime) / 1000);
    const totalAnswered = gameState.correct + gameState.incorrect;
    const accuracy = totalAnswered > 0 ? Math.round((gameState.correct / totalAnswered) * 100) : 0;

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameType,
          score: gameState.score,
          accuracy,
          duration,
          difficulty,
        }),
      });
      const data = await res.json();
      setSessionId(data.id);
    } catch (e) {
      console.error('Failed to save session:', e);
    }

    setShowFeedback(true);
  }, [gameState, userId, gameType, difficulty]);

  const submitFeedback = useCallback(async (feedback: GameFeedback) => {
    if (!sessionId) {
      setShowFeedback(false);
      return;
    }
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, feedback, userId }),
      });
      const data = await res.json();
      if (data.aiEncouragement) {
        setAiEncouragement(data.aiEncouragement);
      }
    } catch (e) {
      console.error('Failed to save feedback:', e);
    }
    setShowFeedback(false);
  }, [sessionId, userId]);

  const accuracy = gameState.correct + gameState.incorrect > 0
    ? Math.round((gameState.correct / (gameState.correct + gameState.incorrect)) * 100)
    : 0;

  return {
    gameState,
    accuracy,
    showFeedback,
    aiEncouragement,
    startGame,
    recordAnswer,
    completeGame,
    submitFeedback,
  };
}
