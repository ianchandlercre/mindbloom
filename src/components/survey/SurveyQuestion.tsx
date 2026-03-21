'use client';
import { SurveyQuestion as SQType, RankingOption } from '@/types';
import { GripVertical, Check } from 'lucide-react';

interface RankingProps {
  question: SQType;
  rankings: string[];
  onRank: (optionId: string) => void;
  onUnrank: (optionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

interface ScaleProps {
  question: SQType;
  scaleValue: number | null;
  onScale: (value: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

type Props = RankingProps | ScaleProps;

function isScaleProps(props: Props): props is ScaleProps {
  return 'scaleValue' in props;
}

export default function SurveyQuestion(props: Props) {
  const { question, questionNumber, totalQuestions } = props;

  return (
    <div className="animate-fade-in">
      {/* Progress bar */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-body text-bark-lighter">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="text-body text-forest-600 font-medium">
          {Math.round((questionNumber / totalQuestions) * 100)}%
        </span>
      </div>
      <div className="w-full bg-wood-100 rounded-full h-2 mb-8">
        <div
          className="bg-forest-500 rounded-full h-2 transition-all duration-500 ease-out"
          style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question text */}
      <div className="text-center mb-8">
        <h2 className="text-heading font-display font-bold text-bark mb-2">{question.text}</h2>
        {question.subtitle && (
          <p className="text-body text-bark-light">{question.subtitle}</p>
        )}
      </div>

      {/* Render based on type */}
      {question.type === 'scale' && isScaleProps(props) ? (
        <ScaleInput
          question={question}
          value={props.scaleValue}
          onSelect={props.onScale}
        />
      ) : !isScaleProps(props) ? (
        <RankingInput
          options={question.options || []}
          rankings={props.rankings}
          onRank={props.onRank}
          onUnrank={props.onUnrank}
        />
      ) : null}
    </div>
  );
}

function RankingInput({
  options,
  rankings,
  onRank,
  onUnrank,
}: {
  options: RankingOption[];
  rankings: string[];
  onRank: (id: string) => void;
  onUnrank: (id: string) => void;
}) {
  const rankedOptions = rankings.map(id => options.find(o => o.id === id)).filter(Boolean) as RankingOption[];
  const unrankedOptions = options.filter(o => !rankings.includes(o.id));

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {/* Instructions */}
      <p className="text-sm text-bark-lighter text-center mb-4">
        Tap items to rank them in order of preference. Tap a ranked item to remove it.
      </p>

      {/* Ranked items */}
      {rankedOptions.length > 0 && (
        <div className="space-y-2 mb-4">
          {rankedOptions.map((option, idx) => (
            <button
              key={option.id}
              onClick={() => onUnrank(option.id)}
              className="w-full flex items-center gap-3 p-4 rounded-lodge-lg bg-forest-50 border-2 border-forest-300 text-left transition-all hover:bg-forest-100 group min-h-[60px]"
            >
              <span className="rank-badge-active flex-shrink-0">
                {idx + 1}
              </span>
              <span className="text-body font-medium text-bark flex-1">{option.text}</span>
              <Check className="w-5 h-5 text-forest-600 flex-shrink-0 opacity-60" />
            </button>
          ))}
        </div>
      )}

      {/* Divider when there are both ranked and unranked */}
      {rankedOptions.length > 0 && unrankedOptions.length > 0 && (
        <div className="divider-nature !my-4" />
      )}

      {/* Unranked items */}
      {unrankedOptions.length > 0 && (
        <div className="space-y-2">
          {unrankedOptions.map(option => (
            <button
              key={option.id}
              onClick={() => onRank(option.id)}
              className="w-full flex items-center gap-3 p-4 rounded-lodge-lg bg-white border-2 border-wood-100 text-left transition-all hover:border-forest-300 hover:bg-forest-50/50 group min-h-[60px]"
            >
              <span className="rank-badge-inactive flex-shrink-0 group-hover:bg-forest-100 group-hover:text-forest-600 transition-colors">
                <GripVertical className="w-4 h-4" />
              </span>
              <span className="text-body text-bark-light group-hover:text-bark transition-colors flex-1">
                {option.text}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Completion indicator */}
      {unrankedOptions.length === 0 && (
        <p className="text-center text-sm text-forest-600 font-medium mt-4 animate-fade-in">
          All ranked. You can tap any item to reorder.
        </p>
      )}
    </div>
  );
}

function ScaleInput({
  question,
  value,
  onSelect,
}: {
  question: SQType;
  value: number | null;
  onSelect: (v: number) => void;
}) {
  const min = question.scaleMin || 1;
  const max = question.scaleMax || 5;
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="max-w-xl mx-auto">
      {/* Scale labels */}
      <div className="flex justify-between mb-4 px-2">
        <span className="text-sm text-bark-lighter max-w-[40%]">{question.scaleMinLabel}</span>
        <span className="text-sm text-bark-lighter max-w-[40%] text-right">{question.scaleMaxLabel}</span>
      </div>

      {/* Scale buttons */}
      <div className="flex gap-3 justify-center">
        {steps.map(step => {
          const isSelected = value === step;
          return (
            <button
              key={step}
              onClick={() => onSelect(step)}
              className={`w-16 h-16 rounded-full text-heading-sm font-bold transition-all duration-200 ${
                isSelected
                  ? 'bg-forest-600 text-white shadow-lodge-md scale-110'
                  : 'bg-white border-2 border-wood-200 text-bark-light hover:border-forest-300 hover:text-forest-600'
              }`}
            >
              {step}
            </button>
          );
        })}
      </div>

      {/* Current selection label */}
      {value !== null && (
        <p className="text-center text-body text-forest-600 font-medium mt-6 animate-fade-in">
          {value <= 2 ? 'Nice and relaxed' : value === 3 ? 'A good balance' : 'Ready for a challenge'}
        </p>
      )}
    </div>
  );
}
