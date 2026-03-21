'use client';
import { useState, useEffect, useCallback } from 'react';
import { InterestArea, EraQuizRound } from '@/types';
import { getEraQuizRounds } from '@/lib/game-data';

interface Props {
  difficulty: number;
  interests: InterestArea[];
  preferredEra?: string;
  onAnswer: (correct: boolean, points: number) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: EraQuizRound[];
}

export default function EraQuiz({
  difficulty, interests, preferredEra, onAnswer, onComplete,
  currentRound, totalRounds, score, isComplete, initialRounds,
}: Props) {
  const [rounds, setRounds] = useState<EraQuizRound[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showFact, setShowFact] = useState(false);

  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      setRounds(initialRounds);
    } else {
      setRounds(getEraQuizRounds(difficulty, interests, preferredEra, totalRounds));
    }
  }, [initialRounds, difficulty, interests, preferredEra, totalRounds]);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setShowFact(false);
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
    setTimeout(() => setShowFact(true), 500);
  }, [selected, current, onAnswer]);

  const handleNext = useCallback(() => {
    if (currentRound > totalRounds) {
      onComplete();
    } else {
      setSelected(null);
      setRevealed(false);
      setShowFact(false);
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
  const isCorrect = revealed && selected === current.correctIndex;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-body text-warm-gray-light">Question {currentRound} of {totalRounds}</span>
            <span className="px-2 py-1 bg-amber/20 text-amber-dark rounded-full text-sm font-medium">
              {current.era}
            </span>
          </div>
          <span className="text-body font-semibold text-warm-gray">Score: {score}</span>
        </div>
        <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
          <div className="h-full bg-amber rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-warm-lg shadow-warm-md p-8 mb-6 animate-fade-in">
        <p className="text-heading font-bold text-warm-gray mb-8 leading-snug">
          {current.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((option, idx) => {
            const isSelected = selected === idx;
            const isCorrectOption = revealed && idx === current.correctIndex;
            const isWrong = revealed && isSelected && idx !== current.correctIndex;
            const isUnselected = revealed && !isSelected && idx !== current.correctIndex;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className={`w-full text-left py-5 px-6 rounded-warm-lg border-2 transition-all ${
                  isCorrectOption
                    ? 'border-green-500 bg-green-100 text-green-800'
                    : isWrong
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : isUnselected
                    ? 'border-cream-dark bg-cream text-warm-gray-light cursor-default'
                    : isSelected
                    ? 'border-soft-blue bg-soft-blue/10 text-warm-gray'
                    : 'border-cream-dark bg-cream text-warm-gray hover:border-soft-blue/50 hover:bg-white'
                } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isCorrectOption ? 'border-green-500 bg-green-500 text-white'
                    : isWrong ? 'border-red-400 bg-red-400 text-white'
                    : isSelected ? 'border-soft-blue bg-soft-blue text-white'
                    : 'border-warm-gray-light text-warm-gray-light'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-body font-medium">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fun fact */}
      {showFact && (
        <div className={`mb-6 p-5 rounded-warm-lg border animate-fade-in ${
          isCorrect
            ? 'bg-green-50 border-green-200'
            : 'bg-amber/10 border-amber/30'
        }`}>
          <p className={`text-sm font-semibold mb-1 uppercase tracking-wide ${isCorrect ? 'text-green-700' : 'text-amber-dark'}`}>
            {isCorrect ? 'Well done!' : `The answer was ${current.options[current.correctIndex]}`}
          </p>
          <p className="text-body text-warm-gray italic">{current.funFact}</p>
        </div>
      )}

      {/* Action */}
      {!revealed ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-5 bg-amber text-white rounded-warm text-body-lg font-semibold hover:bg-amber-dark disabled:opacity-40 transition-colors shadow-warm"
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-5 bg-soft-blue text-white rounded-warm text-body-lg font-semibold hover:bg-soft-blue-dark transition-colors shadow-warm"
        >
          {currentRound > totalRounds ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
