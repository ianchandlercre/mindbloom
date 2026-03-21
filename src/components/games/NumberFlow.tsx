'use client';
import { useState, useEffect, useCallback } from 'react';
import { InterestArea, NumberFlowRound } from '@/types';
import { getNumberFlowRounds } from '@/lib/game-data';

interface Props {
  difficulty: number;
  interests: InterestArea[];
  onAnswer: (correct: boolean, points: number) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: NumberFlowRound[];
}

export default function NumberFlow({
  difficulty, interests, onAnswer, onComplete,
  currentRound, totalRounds, score, isComplete, initialRounds,
}: Props) {
  const [rounds, setRounds] = useState<NumberFlowRound[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      setRounds(initialRounds);
    } else {
      setRounds(getNumberFlowRounds(difficulty, interests, totalRounds));
    }
  }, [initialRounds, difficulty, interests, totalRounds]);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [currentRound]);

  const current = rounds[currentRound - 1];

  const handleSelect = useCallback((optionIdx: number) => {
    if (revealed) return;
    setSelected(optionIdx);
  }, [revealed]);

  const handleSubmit = useCallback(() => {
    if (selected === null || !current) return;
    const isCorrect = selected === current.correctIndex;
    onAnswer(isCorrect, isCorrect ? 100 : 0);
    setRevealed(true);
  }, [selected, current, onAnswer]);

  const handleNext = useCallback(() => {
    if (currentRound > totalRounds) {
      onComplete();
    } else {
      setSelected(null);
      setRevealed(false);
    }
  }, [currentRound, totalRounds, onComplete]);

  if (!current) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-soft-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progress = ((currentRound - 1) / totalRounds) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body text-warm-gray-light">Question {currentRound} of {totalRounds}</span>
          <span className="text-body font-semibold text-warm-gray">Score: {score}</span>
        </div>
        <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
          <div className="h-full bg-soft-blue rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Scenario card */}
      <div className="bg-white rounded-warm-lg shadow-warm-md p-8 mb-6 animate-fade-in">
        {/* Context */}
        <p className="text-body text-warm-gray-light mb-4 italic border-l-4 border-amber pl-4">
          {current.scenario}
        </p>

        {/* Question */}
        <p className="text-heading font-bold text-warm-gray mb-8 leading-snug">
          {current.question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {current.options.map((option, idx) => {
            const isSelected = selected === idx;
            const isCorrect = revealed && idx === current.correctIndex;
            const isWrong = revealed && isSelected && idx !== current.correctIndex;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className={`py-5 px-6 rounded-warm-lg border-2 text-center transition-all font-semibold ${
                  isCorrect
                    ? 'border-green-500 bg-green-100 text-green-800'
                    : isWrong
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : isSelected
                    ? 'border-soft-blue bg-soft-blue/10 text-warm-gray'
                    : 'border-cream-dark bg-cream text-warm-gray hover:border-soft-blue/50 hover:bg-white'
                } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="text-heading">{option}{current.unit || ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result message */}
      {revealed && (
        <div className={`mb-6 p-4 rounded-warm-lg text-center animate-fade-in ${
          selected === current.correctIndex
            ? 'bg-green-100 border border-green-300'
            : 'bg-amber/20 border border-amber/40'
        }`}>
          <p className="text-body font-semibold text-warm-gray">
            {selected === current.correctIndex
              ? `Correct! The answer is ${current.options[current.correctIndex]}${current.unit || ''}.`
              : `The correct answer was ${current.options[current.correctIndex]}${current.unit || ''}.`}
          </p>
        </div>
      )}

      {/* Action */}
      {!revealed ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-5 bg-soft-blue text-white rounded-warm text-body-lg font-semibold hover:bg-soft-blue-dark disabled:opacity-40 transition-colors shadow-warm"
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-5 bg-sage text-white rounded-warm text-body-lg font-semibold hover:bg-sage-dark transition-colors shadow-warm"
        >
          {currentRound > totalRounds ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
