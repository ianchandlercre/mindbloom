'use client';
import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, TreePine } from 'lucide-react';
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
  const [submitted, setSubmitted] = useState(false);

  // Per-question state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [ranking, setRanking] = useState<string[]>([]);

  const questions = SURVEY_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Can we proceed to next? (ranking needs minRanks, scale needs a selection)
  const canProceed = currentQuestion.type === 'ranking'
    ? ranking.length >= (currentQuestion.minRanks ?? 3)
    : selectedAnswer !== null;

  // Handle ranking toggle: tap to add or remove from ranking
  const handleRankToggle = useCallback((answerId: string) => {
    setRanking(prev => {
      const idx = prev.indexOf(answerId);
      if (idx !== -1) {
        // Already ranked — remove it and shift remaining ranks down
        return prev.filter(id => id !== answerId);
      } else {
        // Add to end of ranking
        return [...prev, answerId];
      }
    });
  }, []);

  const handleSelect = useCallback((answerId: string) => {
    setSelectedAnswer(answerId);
  }, []);

  // Navigate to previous question, restoring previous state
  const handleBack = useCallback(() => {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    const prevQuestion = questions[prevIndex];
    const prevResponse = responses.find(r => r.questionId === prevQuestion.id);

    setCurrentIndex(prevIndex);

    if (prevQuestion.type === 'ranking') {
      setRanking(prevResponse?.ranking ?? []);
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(prevResponse?.answerId ?? null);
      setRanking([]);
    }
  }, [currentIndex, questions, responses]);

  // Advance to next question or submit
  const handleNext = useCallback(async () => {
    if (!canProceed || submitting) return;

    // Build response for current question
    const newResponse: SurveyResponse = currentQuestion.type === 'ranking'
      ? {
          questionId: currentQuestion.id,
          answerId: ranking[0] ?? '',
          ranking: [...ranking],
        }
      : {
          questionId: currentQuestion.id,
          answerId: selectedAnswer!,
        };

    const newResponses = [
      ...responses.filter(r => r.questionId !== currentQuestion.id),
      newResponse,
    ];
    setResponses(newResponses);

    if (!isLastQuestion) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];
      const existingNext = newResponses.find(r => r.questionId === nextQuestion.id);

      setCurrentIndex(nextIndex);

      if (nextQuestion.type === 'ranking') {
        setRanking(existingNext?.ranking ?? []);
        setSelectedAnswer(null);
      } else {
        setSelectedAnswer(existingNext?.answerId ?? null);
        setRanking([]);
      }
    } else {
      // Submit
      setSubmitting(true);
      try {
        const res = await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, responses: newResponses }),
        });
        if (!res.ok) throw new Error('Survey submission failed');
        setSubmitted(true);
        setTimeout(() => onComplete(), 1200);
      } catch (e) {
        console.error('Survey submit error:', e);
        setSubmitting(false);
      }
    }
  }, [canProceed, submitting, currentQuestion, ranking, selectedAnswer, responses, isLastQuestion, currentIndex, questions, userId, onComplete]);

  if (!currentQuestion) return null;

  // Success screen
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-forest-600" />
        </div>
        <h2 className="text-heading-lg font-bold text-stone-900 mb-3">
          Thank you, all done!
        </h2>
        <p className="text-body-lg text-stone-500 max-w-sm leading-relaxed">
          We are setting up your personalized brain training experience now.
        </p>
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-forest-400 animate-pulse-gentle"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Welcome banner on first question */}
      {currentIndex === 0 && (
        <div className="mb-8 p-5 bg-forest-800 rounded-lodge-xl text-white animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <TreePine className="w-6 h-6 text-forest-300 flex-shrink-0" />
            <h2 className="text-xl font-bold">Welcome to MindBloom</h2>
          </div>
          <p className="text-forest-200 text-body leading-relaxed">
            Answer five quick questions so we can personalize your experience.
            There are no right or wrong answers — just tell us about yourself.
          </p>
        </div>
      )}

      {/* Question card */}
      <div className="card p-6 sm:p-8 mb-6">
        <SurveyQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          ranking={ranking}
          onSelect={handleSelect}
          onRankToggle={handleRankToggle}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-4 rounded-lodge text-body font-semibold text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ minHeight: '56px' }}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed || submitting}
          className="flex items-center gap-2 px-8 py-4 bg-forest-700 text-white rounded-lodge text-body-lg font-bold hover:bg-forest-800 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lodge-md"
          style={{ minHeight: '56px' }}
        >
          {submitting ? (
            <span className="animate-pulse-gentle">Saving...</span>
          ) : isLastQuestion ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Finish
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Helper hint for ranking */}
      {currentQuestion.type === 'ranking' && !canProceed && (
        <p className="text-center text-sm text-stone-400 mt-4">
          Tap at least {currentQuestion.minRanks ?? 3} options to continue
        </p>
      )}
    </div>
  );
}
