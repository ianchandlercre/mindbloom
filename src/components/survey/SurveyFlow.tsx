'use client';
import { useState, useCallback } from 'react';
import { RANKING_SURVEY_QUESTIONS } from '@/lib/profile-calculator';
import RankingQuestion from './SurveyQuestion';

interface Props {
  userId: number;
  onComplete: () => void;
}

export default function SurveyFlow({ userId, onComplete }: Props) {
  const questions = RANKING_SURVEY_QUESTIONS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback((questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  }, []);

  const canAdvance = (): boolean => {
    const q = currentQuestion;
    const answer = answers[q.id];
    if (!answer) return false;

    if (q.type === 'single-choice') return true;

    // For ranking, need minRank items ranked
    try {
      const ranked = JSON.parse(answer) as string[];
      return ranked.length >= (q.minRank || 1);
    } catch {
      return false;
    }
  };

  const handleNext = useCallback(async () => {
    if (!canAdvance()) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Submit
      setSubmitting(true);
      try {
        const responses = Object.entries(answers).map(([questionId, answerId]) => ({
          questionId,
          answerId,
        }));
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, responses }),
        });
        onComplete();
      } catch (e) {
        console.error('Survey submit error:', e);
        setSubmitting(false);
      }
    }
  }, [currentIndex, questions.length, answers, canAdvance, userId, onComplete]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome header */}
      {isFirst && (
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-soft-blue/10 rounded-full mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-soft-blue">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <h1 className="text-heading-lg font-bold text-warm-gray mb-3">A Few Quick Questions</h1>
          <p className="text-body-lg text-warm-gray-light max-w-md mx-auto">
            Your answers help us personalize your games and choose topics you will genuinely enjoy.
            There are no right or wrong answers.
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body text-warm-gray-light">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-body text-warm-gray-light">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-soft-blue rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="animate-fade-in" key={currentQuestion.id}>
        <RankingQuestion
          question={currentQuestion}
          currentAnswer={answers[currentQuestion.id] || ''}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <button
          onClick={handleBack}
          disabled={isFirst}
          className="py-4 px-8 rounded-warm text-body font-medium text-warm-gray-light hover:text-warm-gray disabled:opacity-30 transition-colors"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canAdvance() || submitting}
          className="py-4 px-10 bg-soft-blue text-white rounded-warm text-body-lg font-semibold hover:bg-soft-blue-dark transition-colors disabled:opacity-40 shadow-warm min-w-[160px]"
        >
          {submitting ? 'Saving...' : isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
