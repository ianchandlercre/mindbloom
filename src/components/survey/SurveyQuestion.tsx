'use client';
import { SurveyQuestion as SQType } from '@/types';

interface Props {
  question: SQType;
  ranking: string[];
  selectedAnswer: string | null;
  onRankToggle: (id: string) => void;
  onSelect: (id: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function SurveyQuestion({
  question,
  ranking,
  selectedAnswer,
  onRankToggle,
  onSelect,
  questionNumber,
  totalQuestions,
}: Props) {
  const isRanking = question.type === 'ranking';
  const maxRank = question.maxRank ?? 3;

  return (
    <div className="animate-fade-in">
      {/* Progress bar */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-body text-stone-light">{questionNumber} of {totalQuestions}</span>
        <span className="text-body font-semibold text-forest">
          {Math.round((questionNumber / totalQuestions) * 100)}%
        </span>
      </div>
      <div className="w-full bg-cream-deep rounded-full h-2 mb-8">
        <div
          className="bg-forest rounded-full h-2 transition-all duration-500"
          style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question text */}
      <div className="mb-6">
        <h2 className="font-serif text-heading font-bold text-forest-dark mb-2">
          {question.text}
        </h2>
        {question.subtitle && (
          <p className="text-body text-stone-light">{question.subtitle}</p>
        )}
        {isRanking && (
          <p className="text-body-lg text-forest font-medium mt-3">
            Select up to {maxRank} — tap again to remove
          </p>
        )}
      </div>

      {/* Ranking layout — 2-column grid */}
      {isRanking ? (
        <div className="grid grid-cols-2 gap-3">
          {question.answers.map(answer => {
            const rankIdx = ranking.indexOf(answer.id);
            const isRanked = rankIdx !== -1;
            const rank = rankIdx + 1;
            const atMax = ranking.length >= maxRank && !isRanked;

            return (
              <button
                key={answer.id}
                onClick={() => onRankToggle(answer.id)}
                disabled={atMax}
                className={[
                  'relative p-4 rounded-warm-lg text-left transition-all',
                  'min-h-[72px] flex items-center gap-3',
                  isRanked
                    ? 'bg-forest text-white shadow-forest border-2 border-forest'
                    : atMax
                    ? 'bg-cream-dark border-2 border-cream-deep opacity-40 cursor-not-allowed'
                    : 'bg-white border-2 border-cream-deep hover:border-forest-light hover:bg-forest-pale cursor-pointer',
                ].join(' ')}
              >
                <div className={[
                  'w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-body font-bold',
                  isRanked ? 'bg-white text-forest' : 'bg-cream-deep text-stone-pale',
                ].join(' ')}>
                  {isRanked ? rank : ''}
                </div>
                <span className={`text-body font-medium leading-tight ${isRanked ? 'text-white' : 'text-stone'}`}>
                  {answer.text}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Choice layout — single column, larger cards */
        <div className="grid grid-cols-1 gap-4">
          {question.answers.map(answer => {
            const isSelected = selectedAnswer === answer.id;
            return (
              <button
                key={answer.id}
                onClick={() => onSelect(answer.id)}
                className={[
                  'p-6 rounded-warm-lg text-left transition-all min-h-[72px]',
                  isSelected
                    ? 'bg-forest text-white shadow-forest border-2 border-forest'
                    : 'bg-white border-2 border-cream-deep hover:border-forest-light hover:bg-forest-pale',
                ].join(' ')}
              >
                <p className={`text-body-lg font-medium ${isSelected ? 'text-white' : 'text-stone'}`}>
                  {answer.text}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
