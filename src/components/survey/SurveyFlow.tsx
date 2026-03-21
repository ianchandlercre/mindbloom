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

  // Ranking state: ordered array of selected answer IDs
  const [currentRanking, setCurrentRanking] = useState<string[]>([]);
  // Choice state: single selected ID
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const questions = SURVEY_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const isRanking = currentQuestion?.type === 'ranking';
  const maxRank = currentQuestion?.maxRank ?? 3;

  const canProceed = isRanking
    ? currentRanking.length >= 1
    : selectedAnswer !== null;

  const handleRankToggle = useCallback((answerId: string) => {
    setCurrentRanking(prev => {
      const idx = prev.indexOf(answerId);
      if (idx !== -1) {
        // Remove this item and everything ranked after it
        return prev.slice(0, idx);
      } else if (prev.length < maxRank) {
        return [...prev, answerId];
      }
      return prev;
    });
  }, [maxRank]);

  const handleSelect = useCallback((answerId: string) => {
    setSelectedAnswer(answerId);
  }, []);

  const restoreState = useCallback((allResponses: SurveyResponse[], questionId: string, qType?: string) => {
    const saved = allResponses.find(r => r.questionId === questionId);
    if (saved) {
      if (qType === 'ranking') {
        setCurrentRanking(saved.answerId.split('|').filter(Boolean));
        setSelectedAnswer(null);
      } else {
        setSelectedAnswer(saved.answerId);
        setCurrentRanking([]);
      }
    } else {
      setCurrentRanking([]);
      setSelectedAnswer(null);
    }
  }, []);

  const handleNext = useCallback(async () => {
    if (!canProceed) return;

    const encodedAnswer = isRanking ? currentRanking.join('|') : selectedAnswer!;
    const newResponses = [
      ...responses.filter(r => r.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, answerId: encodedAnswer },
    ];
    setResponses(newResponses);

    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      restoreState(newResponses, nextQuestion.id, nextQuestion.type);
      setCurrentIndex(currentIndex + 1);
    } else {
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
  }, [canProceed, isRanking, currentRanking, selectedAnswer, responses, currentIndex, currentQuestion, questions, userId, onComplete, restoreState]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      const prevQuestion = questions[currentIndex - 1];
      restoreState(responses, prevQuestion.id, prevQuestion.type);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, responses, questions, restoreState]);

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {currentIndex === 0 && (
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="font-serif text-heading-lg font-bold text-forest-dark mb-3">
            Let&apos;s Get to Know You
          </h1>
          <p className="text-body-lg text-stone-light">
            A few questions to personalize your experience. There are no wrong answers.
          </p>
        </div>
      )}

      <SurveyQuestion
        question={currentQuestion}
        ranking={currentRanking}
        selectedAnswer={selectedAnswer}
        onRankToggle={handleRankToggle}
        onSelect={handleSelect}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="py-4 px-8 rounded-warm text-body font-medium text-stone-light hover:text-stone disabled:opacity-30 transition-colors"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed || submitting}
          className="py-4 px-10 bg-forest text-white rounded-warm text-body-lg font-semibold hover:bg-forest-dark transition-colors disabled:opacity-40 shadow-forest"
        >
          {submitting
            ? 'Saving...'
            : currentIndex === questions.length - 1
            ? 'Finish'
            : 'Continue'}
        </button>
      </div>
    </div>
  );
}
