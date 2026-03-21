'use client';
import { useState, useEffect, useCallback } from 'react';
import { InterestArea, PatternGardenRound } from '@/types';
import { getPatternGardenRounds } from '@/lib/game-data';

interface Props {
  difficulty: number;
  interests: InterestArea[];
  onAnswer: (correct: boolean, points: number) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: PatternGardenRound[];
}

export default function PatternGarden({
  difficulty, interests, onAnswer, onComplete,
  currentRound, totalRounds, score, isComplete, initialRounds,
}: Props) {
  const [rounds, setRounds] = useState<PatternGardenRound[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      setRounds(initialRounds);
    } else {
      setRounds(getPatternGardenRounds(difficulty, totalRounds));
    }
  }, [initialRounds, difficulty, totalRounds]);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [currentRound]);

  const current = rounds[currentRound - 1];

  const handleSelect = useCallback((idx: number) => {
    if (revealed) return;
    setSelected(idx);
  }, [revealed]);

  const handleSubmit = useCallback(() => {
    if (selected === null || !current) return;
    const isCorrect = selected === current.correctIndex;
    onAnswer(isCorrect, isCorrect ? 100 : 0);
    setRevealed(true);
  }, [selected, current, onAnswer]);

  const handleNext = useCallback(() => {
    if (currentRound >= totalRounds) {
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
  const isCorrect = revealed && selected === current.correctIndex;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body text-warm-gray-light">Pattern {currentRound} of {totalRounds}</span>
          <span className="text-body font-semibold text-warm-gray">Score: {score}</span>
        </div>
        <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
          <div className="h-full bg-sage rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-sage/10 border border-sage/30 rounded-warm-lg">
        <p className="text-body text-warm-gray">
          Look at the sequence and find the number that replaces the <strong>question mark</strong>.
        </p>
      </div>

      {/* Sequence display */}
      <div className="bg-white rounded-warm-lg shadow-warm-md p-8 mb-6 animate-fade-in">
        <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
          {current.sequence.map((item, idx) => {
            const isQuestion = item === '?';
            return (
              <div
                key={idx}
                className={`w-16 h-16 rounded-warm-lg flex items-center justify-center border-2 flex-shrink-0 ${
                  isQuestion
                    ? 'border-soft-blue bg-soft-blue/10 text-soft-blue'
                    : 'border-cream-dark bg-cream text-warm-gray'
                }`}
              >
                <span className={`font-bold ${isQuestion ? 'text-heading text-soft-blue' : 'text-body-lg text-warm-gray'}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        {revealed && (
          <div className="text-center animate-fade-in">
            <span className="text-sm text-warm-gray-light">Pattern: </span>
            <span className="text-sm font-medium text-warm-gray">{current.rule}</span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {current.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isCorrectOption = revealed && idx === current.correctIndex;
          const isWrong = revealed && isSelected && idx !== current.correctIndex;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
              className={`py-6 rounded-warm-lg border-2 text-center transition-all font-bold ${
                isCorrectOption
                  ? 'border-green-500 bg-green-100 text-green-800'
                  : isWrong
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : isSelected
                  ? 'border-soft-blue bg-soft-blue/10 text-warm-gray'
                  : 'border-cream-dark bg-cream text-warm-gray hover:border-soft-blue/50 hover:bg-white'
              } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="text-heading">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Result */}
      {revealed && (
        <div className={`mb-6 p-4 rounded-warm-lg text-center animate-fade-in ${
          isCorrect ? 'bg-green-100 border border-green-300' : 'bg-amber/20 border border-amber/40'
        }`}>
          <p className="text-body font-semibold text-warm-gray">
            {isCorrect
              ? `Correct! The pattern: ${current.rule}`
              : `The answer was ${current.options[current.correctIndex]}. Pattern: ${current.rule}`}
          </p>
        </div>
      )}

      {/* Action */}
      {!revealed ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-5 bg-sage text-white rounded-warm text-body-lg font-semibold hover:bg-sage-dark disabled:opacity-40 transition-colors shadow-warm"
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-5 bg-soft-blue text-white rounded-warm text-body-lg font-semibold hover:bg-soft-blue-dark transition-colors shadow-warm"
        >
          {currentRound >= totalRounds ? 'See Results' : 'Next Pattern'}
        </button>
      )}
    </div>
  );
}
