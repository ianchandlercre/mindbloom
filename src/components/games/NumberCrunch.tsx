'use client';
import { useState, useEffect } from 'react';
import { NumberCrunchRound } from '@/types';
import { getNumberCrunchRounds } from '@/lib/game-data';
import { getEncouragementMessage } from '@/lib/adaptive-engine';

interface Props {
  difficulty: number;
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: any[];
}

export default function NumberCrunch({ difficulty, onAnswer, onComplete, currentRound, totalRounds, score, isComplete, initialRounds }: Props) {
  const [rounds, setRounds] = useState<NumberCrunchRound[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      setRounds(initialRounds as NumberCrunchRound[]);
    } else {
      setRounds(getNumberCrunchRounds(difficulty, totalRounds));
    }
  }, [difficulty, totalRounds, initialRounds]);

  const round = rounds[currentRound];

  const handleSelect = (index: number) => {
    if (feedback || !round) return;
    const isCorrect = index === round.correctIndex;
    const message = isCorrect
      ? `✅ Correct! ${round.expression} = ${round.answer}`
      : `❌ ${round.expression} = ${round.answer}`;

    setFeedback({ correct: isCorrect, message });
    onAnswer(isCorrect);

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 >= totalRounds) {
        onComplete();
      }
    }, 1500);
  };

  if (!round) return null;

  if (isComplete) {
    const accuracy = totalRounds > 0 ? Math.round((score / (totalRounds * 10)) * 100) : 0;
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-heading font-bold text-warm-gray mb-3">Game Complete!</h2>
        <p className="text-body-lg text-warm-gray mb-2">Score: {score} points</p>
        <p className="text-body text-warm-gray-light mb-6">{getEncouragementMessage(accuracy, 'number-crunch')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-body text-warm-gray-light">Round {currentRound + 1} of {totalRounds}</span>
        <span className="text-body font-semibold text-soft-blue">Score: {score}</span>
      </div>
      <div className="w-full bg-cream-dark rounded-full h-3 mb-8">
        <div className="bg-soft-blue rounded-full h-3 transition-all duration-500" style={{ width: `${(currentRound / totalRounds) * 100}%` }} />
      </div>

      <div className="text-center mb-8">
        <p className="text-body text-warm-gray-light mb-3">Solve this:</p>
        <div className="inline-block px-8 py-4 bg-white rounded-warm-lg shadow-warm-md">
          <p className="text-heading-lg font-bold text-soft-blue-dark">{round.expression} = ?</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {round.options.map((option, i) => {
          let btnClass = 'bg-white border-2 border-cream-dark hover:border-soft-blue text-warm-gray';
          if (feedback) {
            if (i === round.correctIndex) {
              btnClass = 'bg-sage/20 border-2 border-sage text-sage-dark';
            } else {
              btnClass = 'bg-white border-2 border-cream-dark text-warm-gray-light opacity-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={!!feedback}
              className={`p-5 rounded-warm text-heading font-bold transition-all shadow-warm ${btnClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`mt-6 p-4 rounded-warm text-center text-body-lg font-medium animate-scale-in ${
          feedback.correct ? 'bg-sage/20 text-sage-dark' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}
