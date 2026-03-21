'use client';
import { useState, useEffect } from 'react';
import { KnowledgeQuizRound, InterestArea } from '@/types';
import { getKnowledgeQuizRounds } from '@/lib/game-data';
import { getEncouragementMessage } from '@/lib/adaptive-engine';
import { Star } from 'lucide-react';

interface Props {
  difficulty: number;
  interests: InterestArea[];
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: any[];
}

export default function KnowledgeQuiz({ difficulty, interests, onAnswer, onComplete, currentRound, totalRounds, score, isComplete, initialRounds }: Props) {
  const [rounds, setRounds] = useState<KnowledgeQuizRound[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string; funFact: string } | null>(null);

  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      setRounds(initialRounds as KnowledgeQuizRound[]);
    } else {
      setRounds(getKnowledgeQuizRounds(difficulty, interests, totalRounds));
    }
  }, [difficulty, interests, totalRounds, initialRounds]);

  const round = rounds[currentRound - 1];

  const handleSelect = (index: number) => {
    if (feedback || !round) return;
    const isCorrect = index === round.correctIndex;
    const message = isCorrect ? 'Correct!' : `The answer is: ${round.options[round.correctIndex]}`;

    setFeedback({ correct: isCorrect, message, funFact: round.funFact });
    onAnswer(isCorrect);

    setTimeout(() => {
      setFeedback(null);
      if (currentRound >= totalRounds) {
        onComplete();
      }
    }, 3000); // Longer for fun fact reading
  };

  if (!round) return null;

  if (isComplete) {
    const accuracy = totalRounds > 0 ? Math.round((score / (totalRounds * 10)) * 100) : 0;
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4"><Star className="w-8 h-8 text-sage-dark" /></div>
        <h2 className="text-heading font-bold text-warm-gray mb-3">Quiz Complete!</h2>
        <p className="text-body-lg text-warm-gray mb-2">Score: {score} points</p>
        <p className="text-body text-warm-gray-light mb-6">{getEncouragementMessage(accuracy, 'knowledge-quiz')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-body text-warm-gray-light">Question {currentRound} of {totalRounds}</span>
        <span className="text-body font-semibold text-soft-blue">Score: {score}</span>
      </div>
      <div className="w-full bg-cream-dark rounded-full h-3 mb-8">
        <div className="bg-soft-blue rounded-full h-3 transition-all duration-500" style={{ width: `${((currentRound - 1) / totalRounds) * 100}%` }} />
      </div>

      <div className="text-center mb-4">
        {round.category && (
          <span className="inline-block px-3 py-1 bg-soft-blue/10 text-soft-blue rounded-full text-sm mb-3">
            {round.category}
          </span>
        )}
        <p className="text-heading font-semibold text-warm-gray">{round.question}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto mt-6">
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
              className={`p-5 rounded-warm text-body-lg font-medium transition-all shadow-warm text-left ${btnClass}`}
            >
              <span className="text-warm-gray-light mr-3">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`mt-6 p-5 rounded-warm animate-scale-in ${
          feedback.correct ? 'bg-sage/20' : 'bg-red-50'
        }`}>
          <p className={`text-body-lg font-medium mb-2 ${
            feedback.correct ? 'text-sage-dark' : 'text-red-700'
          }`}>
            {feedback.message}
          </p>
          <p className="text-body text-warm-gray">
            Did you know? {feedback.funFact}
          </p>
        </div>
      )}
    </div>
  );
}
