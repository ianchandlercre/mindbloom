'use client';
import { useState, useCallback } from 'react';
import { SurveyResponse } from '@/types';
import { SURVEY_QUESTIONS } from '@/lib/profile-calculator';
import SurveyQuestion from './SurveyQuestion';

interface Props {
  userId: number;
  onComplete: () => void;
}

export default function SurveyFlow({ userId, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const questions = SURVEY_QUESTIONS;
  const currentQuestion = questions[currentIndex];

  const handleSelect = useCallback((answerId: string) => {
    setSelectedAnswer(answerId);
  }, []);

  const handleNext = useCallback(async () => {
    if (!selectedAnswer) return;

    const newResponses = [
      ...responses.filter(r => r.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, answerId: selectedAnswer },
    ];
    setResponses(newResponses);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Submit all responses
      setSubmitting(true);
      try {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, responses: newResponses }),
        });
        onComplete();
      } catch (e) {
        console.error('Survey submit error:', e);
        setSubmitting(false);
      }
    }
  }, [selectedAnswer, responses, currentIndex, currentQuestion, questions, userId, onComplete]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevResponse = responses.find(r => r.questionId === questions[currentIndex - 1].id);
      setSelectedAnswer(prevResponse?.answerId || null);
    }
  }, [currentIndex, responses, questions]);

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome header on first question */}
      {currentIndex === 0 && (
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-5xl mb-3">🌱</div>
          <h1 className="text-heading-lg font-bold text-warm-gray mb-2">Let&apos;s Get to Know You!</h1>
          <p className="text-body-lg text-warm-gray-light">
            Answer a few quick questions so we can personalize your brain training experience.
            There are no wrong answers!
          </p>
        </div>
      )}

      <SurveyQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onSelect={handleSelect}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-8 max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="py-4 px-8 rounded-warm text-body font-medium text-warm-gray-light hover:text-warm-gray disabled:opacity-30 transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer || submitting}
          className="py-4 px-10 bg-soft-blue text-white rounded-warm text-body-lg font-medium hover:bg-soft-blue-dark transition-colors disabled:opacity-50 shadow-warm"
        >
          {submitting ? 'Saving...' : currentIndex === questions.length - 1 ? 'Finish! 🎉' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
