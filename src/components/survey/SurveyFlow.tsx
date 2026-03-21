'use client';
import { useState, useCallback } from 'react';
import { Trees } from 'lucide-react';
import { RANKING_QUESTIONS, rankingsToResponses } from '@/lib/profile-calculator';
import SurveyQuestion from './SurveyQuestion';

interface Props {
  userId: number;
  onComplete: () => void;
}

export default function SurveyFlow({ userId, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // ranking state: questionId -> ordered array of selected option IDs
  const [allRankings, setAllRankings] = useState<Map<string, string[]>>(new Map());
  // scale state: questionId -> 1-5 value
  const [allScales, setAllScales] = useState<Map<string, number>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const questions = RANKING_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const currentRanking = allRankings.get(currentQuestion.id) ?? [];
  const currentScale = allScales.get(currentQuestion.id) ?? 0;

  // Determine if Next can be activated
  const canProceed = currentQuestion.type === 'ranking'
    ? currentRanking.length >= (currentQuestion.minRanks ?? 1)
    : currentScale > 0;

  const handleRankToggle = useCallback((optionId: string) => {
    setAllRankings(prev => {
      const next = new Map(prev);
      const current = next.get(currentQuestion.id) ?? [];
      if (current.includes(optionId)) {
        next.set(currentQuestion.id, current.filter(id => id !== optionId));
      } else {
        next.set(currentQuestion.id, [...current, optionId]);
      }
      return next;
    });
  }, [currentQuestion.id]);

  const handleScaleSelect = useCallback((value: number) => {
    setAllScales(prev => {
      const next = new Map(prev);
      next.set(currentQuestion.id, value);
      return next;
    });
  }, [currentQuestion.id]);

  const handleNext = useCallback(async () => {
    if (!canProceed) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitting(true);
      setError('');
      try {
        const responses = rankingsToResponses(allRankings, allScales);
        const res = await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, responses }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Server error');
        }
        onComplete();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
        setError(msg);
        setSubmitting(false);
      }
    }
  }, [canProceed, currentIndex, questions.length, allRankings, allScales, userId, onComplete]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  if (!currentQuestion) return null;

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome on first question */}
      {currentIndex === 0 && (
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-forest-100 rounded-full mb-5">
            <Trees className="w-10 h-10 text-forest-600" />
          </div>
          <h1 className="text-heading-lg text-bark mb-3">
            Let&apos;s Get to Know You
          </h1>
          <p className="text-body-lg text-bark-light max-w-lg mx-auto">
            A few quick questions help us personalize your experience.
            There are no right or wrong answers &mdash; just your preferences.
          </p>
        </div>
      )}

      {/* Question card */}
      <div className="lodge-card p-8 mb-6">
        <SurveyQuestion
          question={currentQuestion}
          ranking={currentRanking}
          scaleValue={currentScale}
          onRankToggle={handleRankToggle}
          onScaleSelect={handleScaleSelect}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lodge text-body animate-fade-in">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="py-4 px-8 rounded-lodge text-body font-medium text-bark-light hover:text-bark disabled:opacity-30 transition-colors"
          type="button"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed || submitting}
          type="button"
          className="py-4 px-10 bg-forest-600 text-white rounded-lodge text-body-lg font-semibold hover:bg-forest-700 transition-colors disabled:opacity-40 shadow-lodge hover:shadow-lodge-md"
        >
          {submitting ? 'Saving...' : isLastQuestion ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
