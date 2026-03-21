'use client';
import { CheckCircle2 } from 'lucide-react';
import { SurveyQuestion as SQType } from '@/types';

interface Props {
  question: SQType;
  /** For scale questions: the selected answerId */
  selectedAnswer: string | null;
  /** For ranking questions: ordered array of answerIds (index 0 = 1st choice) */
  ranking: string[];
  onSelect: (answerId: string) => void;
  onRankToggle: (answerId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function SurveyQuestion({
  question,
  selectedAnswer,
  ranking,
  onSelect,
  onRankToggle,
  questionNumber,
  totalQuestions,
}: Props) {
  const progress = (questionNumber - 1) / totalQuestions;

  return (
    <div className="animate-fade-in">

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-body text-stone-500 font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-body font-semibold text-forest-700">
            {Math.round(progress * 100)}% complete
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <div className="mb-6">
        <h2 className="text-heading font-bold text-stone-900 mb-2">{question.text}</h2>
        {question.subtitle && (
          <p className="text-body text-stone-500 leading-relaxed">{question.subtitle}</p>
        )}
      </div>

      {/* Ranking-type question */}
      {question.type === 'ranking' && (
        <div className="space-y-3">
          {/* Instruction chip */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-forest-700 uppercase tracking-wide">
              Tap to rank — {question.minRanks ?? 3} or more
            </span>
          </div>

          {question.answers.map((answer) => {
            const rankIndex = ranking.indexOf(answer.id);
            const isRanked = rankIndex !== -1;
            const rankNumber = rankIndex + 1;

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => onRankToggle(answer.id)}
                className={`survey-option ${isRanked ? 'ranked' : ''} w-full`}
                aria-label={
                  isRanked
                    ? `${answer.text} — ranked ${rankNumber}. Tap to remove.`
                    : `${answer.text} — tap to rank`
                }
              >
                {/* Rank badge */}
                <div
                  className={`rank-badge flex-shrink-0 transition-all duration-200 ${
                    isRanked ? 'rank-badge-filled scale-110' : 'rank-badge-empty'
                  }`}
                  aria-hidden="true"
                >
                  {isRanked ? rankNumber : ''}
                </div>

                {/* Answer text */}
                <span className={`flex-1 text-body font-medium leading-snug ${
                  isRanked ? 'text-forest-800' : 'text-stone-700'
                }`}>
                  {answer.text}
                </span>

                {/* Checkmark when ranked */}
                {isRanked && (
                  <CheckCircle2 className="w-5 h-5 text-forest-600 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}

          {/* Ranking summary */}
          {ranking.length > 0 && (
            <div className="mt-4 p-4 bg-forest-50 rounded-lodge border border-forest-200 animate-fade-in">
              <p className="text-sm font-semibold text-forest-700 mb-2 uppercase tracking-wide">
                Your ranking so far
              </p>
              <ol className="space-y-1">
                {ranking.map((id, i) => {
                  const answer = question.answers.find(a => a.id === id);
                  return (
                    <li key={id} className="flex items-center gap-2 text-body text-forest-800">
                      <span className="font-bold text-forest-600 w-5 text-right">{i + 1}.</span>
                      <span>{answer?.text}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Scale-type question */}
      {question.type === 'scale' && (
        <div className="space-y-3">
          {question.answers.map((answer) => {
            const isSelected = selectedAnswer === answer.id;

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => onSelect(answer.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-lodge-lg border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-forest-600 bg-forest-50 shadow-lodge'
                    : 'border-cream-300 bg-white hover:border-forest-400 hover:bg-forest-50/50'
                }`}
                style={{ minHeight: '64px' }}
                aria-pressed={isSelected}
              >
                {/* Selection indicator */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'border-forest-600 bg-forest-600'
                      : 'border-stone-300 bg-white'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>

                <span className={`text-body font-medium leading-snug ${
                  isSelected ? 'text-forest-800' : 'text-stone-700'
                }`}>
                  {answer.text}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
