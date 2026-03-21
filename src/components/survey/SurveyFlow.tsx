'use client';
import { useState, useCallback } from 'react';
import { SurveyResponse } from '@/types';
import { SURVEY_QUESTIONS } from '@/lib/profile-calculator';
import SurveyQuestion from './SurveyQuestion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface Props {
  userId: number;
  onComplete: () => void;
}

export default function SurveyFlow({ userId, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const questions = SURVEY_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);

  const updateResponse = useCallback((questionId: string, update: Partial<SurveyResponse>) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (existing) {
        return prev.map(r => r.questionId === questionId ? { ...r, ...update } : r);
      }
      return [...prev, { questionId, answerId: '', ...update }];
    });
  }, []);

  // Ranking handlers
  const handleRank = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    const current = currentResponse?.rankings || [];
    if (!current.includes(optionId)) {
      updateResponse(currentQuestion.id, { rankings: [...current, optionId] });
    }
  }, [currentQuestion, currentResponse, updateResponse]);

  const handleUnrank = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    const current = currentResponse?.rankings || [];
    updateResponse(currentQuestion.id, { rankings: current.filter(id => id !== optionId) });
  }, [currentQuestion, currentResponse, updateResponse]);

  // Scale handler
  const handleScale = useCallback((value: number) => {
    if (!currentQuestion) return;
    updateResponse(currentQuestion.id, { scaleValue: value });
  }, [currentQuestion, updateResponse]);

  // Navigation
  const canProceed = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'ranking') {
      const rankings = currentResponse?.rankings || [];
      return rankings.length === (currentQuestion.options?.length || 0);
    }
    if (currentQuestion.type === 'scale') {
      return currentResponse?.scaleValue !== undefined;
    }
    return !!currentResponse?.answerId;
  };

  const handleNext = useCallback(async () => {
    if (!canProceed()) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitting(true);
      try {
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
  }, [currentIndex, questions.length, userId, responses, onComplete]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  if (!currentQuestion) return null;

  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome header on first question */}
      {currentIndex === 0 && (
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-heading-lg font-display font-bold text-bark mb-3">
            Let&apos;s Get to Know You
          </h1>
          <p className="text-body-lg text-bark-light max-w-md mx-auto">
            Rank your preferences so we can create a brain training experience tailored just for you.
            There are no wrong answers.
          </p>
        </div>
      )}

      {/* Question */}
      {currentQuestion.type === 'scale' ? (
        <SurveyQuestion
          question={currentQuestion}
          scaleValue={currentResponse?.scaleValue ?? null}
          onScale={handleScale}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      ) : (
        <SurveyQuestion
          question={currentQuestion}
          rankings={currentResponse?.rankings || []}
          onRank={handleRank}
          onUnrank={handleUnrank}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10 max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 py-4 px-6 rounded-lodge text-body font-medium text-bark-lighter hover:text-bark disabled:opacity-30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed() || submitting}
          className="flex items-center gap-2 btn-primary disabled:opacity-50"
        >
          {submitting ? (
            'Saving...'
          ) : isLast ? (
            <>
              <Check className="w-5 h-5" />
              Finish
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
