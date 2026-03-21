'use client';
import { SurveyQuestion as SQType } from '@/types';

interface Props {
  question: SQType;
  selectedAnswer: string | null;
  onSelect: (answerId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function SurveyQuestion({ question, selectedAnswer, onSelect, questionNumber, totalQuestions }: Props) {
  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-body text-warm-gray-light">Question {questionNumber} of {totalQuestions}</span>
        <span className="text-body text-soft-blue font-medium">{Math.round((questionNumber / totalQuestions) * 100)}%</span>
      </div>
      <div className="w-full bg-cream-dark rounded-full h-3 mb-8">
        <div
          className="bg-soft-blue rounded-full h-3 transition-all duration-500"
          style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-heading font-bold text-warm-gray mb-2">{question.text}</h2>
        {question.subtitle && (
          <p className="text-body text-warm-gray-light">{question.subtitle}</p>
        )}
      </div>

      {/* Answer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswer === answer.id;
          return (
            <button
              key={answer.id}
              onClick={() => onSelect(answer.id)}
              className={`p-6 rounded-warm-lg text-left transition-all shadow-warm hover:shadow-warm-md ${
                isSelected
                  ? 'bg-soft-blue/10 border-2 border-soft-blue ring-2 ring-soft-blue/20'
                  : 'bg-white border-2 border-cream-dark hover:border-soft-blue-light'
              }`}
            >
              <div className="text-4xl mb-3">{answer.emoji}</div>
              <p className={`text-body-lg font-medium ${isSelected ? 'text-soft-blue-dark' : 'text-warm-gray'}`}>
                {answer.text}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
