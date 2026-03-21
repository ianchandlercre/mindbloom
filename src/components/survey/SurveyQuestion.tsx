'use client';
import { RankingQuestion } from '@/lib/profile-calculator';

interface Props {
  question: RankingQuestion;
  /** For ranking type: ordered array of selected option IDs (index 0 = rank 1) */
  ranking: string[];
  /** For scale type: selected value 1–5, or 0 for unset */
  scaleValue: number;
  onRankToggle: (optionId: string) => void;
  onScaleSelect: (value: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function SurveyQuestion({
  question,
  ranking,
  scaleValue,
  onRankToggle,
  onScaleSelect,
  questionNumber,
  totalQuestions,
}: Props) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-body text-bark-lighter mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-cream-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <div className="mb-6">
        <h2 className="text-heading text-bark mb-2">{question.text}</h2>
        {question.subtitle && (
          <p className="text-body text-bark-light">{question.subtitle}</p>
        )}
      </div>

      {/* Ranking type */}
      {question.type === 'ranking' && (
        <div className="space-y-3">
          {question.options.map(option => {
            const rankIndex = ranking.indexOf(option.id);
            const isRanked = rankIndex !== -1;
            const rankNumber = rankIndex + 1;

            return (
              <button
                key={option.id}
                onClick={() => onRankToggle(option.id)}
                className={`survey-option w-full text-left ${isRanked ? 'survey-option-ranked' : ''}`}
                style={{ minHeight: '72px' }}
                type="button"
                aria-label={isRanked ? `Ranked ${rankNumber}: ${option.text}. Tap to remove.` : `${option.text}. Tap to rank.`}
              >
                {/* Rank badge */}
                <div className="flex-shrink-0">
                  {isRanked ? (
                    <span className="rank-badge-active" aria-hidden="true">{rankNumber}</span>
                  ) : (
                    <span className="rank-badge-inactive" aria-hidden="true">?</span>
                  )}
                </div>

                {/* Option text */}
                <span className={`text-body flex-1 ${isRanked ? 'text-forest-800 font-medium' : 'text-bark'}`}>
                  {option.text}
                </span>

                {/* Selected indicator */}
                {isRanked && (
                  <span className="flex-shrink-0 text-forest-500">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <polyline points="3,10 8,15 17,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}

          {/* Hint text */}
          <p className="text-sm text-bark-lighter pt-2 text-center">
            {ranking.length === 0
              ? 'Tap an option to give it your top ranking.'
              : ranking.length < (question.minRanks ?? 1)
              ? `Rank ${(question.minRanks ?? 1) - ranking.length} more to continue.`
              : 'Tap again to remove a ranking, or keep going.'}
          </p>
        </div>
      )}

      {/* Scale type */}
      {question.type === 'scale' && (
        <div>
          {question.scaleLabels && (
            <div className="flex justify-between text-body text-bark-lighter mb-4">
              <span>{question.scaleLabels.min}</span>
              <span>{question.scaleLabels.max}</span>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map(value => {
              const isSelected = scaleValue === value;
              return (
                <button
                  key={value}
                  onClick={() => onScaleSelect(value)}
                  type="button"
                  style={{ minHeight: '72px', minWidth: '60px' }}
                  className={`flex-1 flex flex-col items-center justify-center rounded-lodge-lg border-2 font-bold text-heading transition-all duration-200 ${
                    isSelected
                      ? 'bg-forest-600 border-forest-600 text-white shadow-lodge-md scale-105'
                      : 'bg-white border-cream-300 text-bark hover:border-forest-300 hover:bg-forest-50'
                  }`}
                  aria-label={`${value} out of 5${isSelected ? ', selected' : ''}`}
                  aria-pressed={isSelected}
                >
                  {value}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between text-sm text-bark-lighter mt-3 px-1">
            {[1, 2, 3, 4, 5].map(v => (
              <span key={v} className="flex-1 text-center">{v}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
