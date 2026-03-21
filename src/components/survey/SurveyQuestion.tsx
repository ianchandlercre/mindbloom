'use client';
import { useCallback } from 'react';
import { RankingSurveyQuestion } from '@/types';

interface Props {
  question: RankingSurveyQuestion;
  currentAnswer: string;
  onAnswer: (questionId: string, answerId: string) => void;
}

export default function RankingQuestion({ question, currentAnswer, onAnswer }: Props) {
  const getRanking = (): string[] => {
    if (!currentAnswer) return [];
    if (question.type === 'single-choice') return [currentAnswer];
    try { return JSON.parse(currentAnswer); } catch { return []; }
  };

  const ranking = getRanking();

  const handleRankingTap = useCallback((itemId: string) => {
    const current = (() => {
      if (!currentAnswer) return [];
      try { return JSON.parse(currentAnswer) as string[]; } catch { return []; }
    })();
    const existingIdx = current.indexOf(itemId);
    const newRanking = existingIdx >= 0
      ? current.filter((id: string) => id !== itemId)
      : [...current, itemId];
    onAnswer(question.id, JSON.stringify(newRanking));
  }, [currentAnswer, question.id, onAnswer]);

  const handleSingleChoice = useCallback((itemId: string) => {
    onAnswer(question.id, itemId);
  }, [question.id, onAnswer]);

  if (question.type === 'single-choice') {
    return (
      <div>
        <h2 className="text-heading font-bold text-warm-gray mb-2">{question.text}</h2>
        {question.subtitle && (
          <p className="text-body text-warm-gray-light mb-8">{question.subtitle}</p>
        )}
        <div className="space-y-3">
          {question.items.map((item) => {
            const isSelected = currentAnswer === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSingleChoice(item.id)}
                className={`w-full text-left p-5 rounded-warm-lg border-2 transition-all text-body-lg font-medium ${
                  isSelected
                    ? 'border-soft-blue bg-soft-blue/10 text-warm-gray'
                    : 'border-cream-dark bg-white text-warm-gray hover:border-soft-blue/50 hover:bg-cream'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-soft-blue bg-soft-blue' : 'border-warm-gray-light'
                  }`}>
                    {isSelected && (
                      <svg viewBox="0 0 12 9" fill="none" className="w-3 h-3">
                        <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Ranking type
  const minRank = question.minRank || 1;
  const rankedCount = ranking.length;

  return (
    <div>
      <h2 className="text-heading font-bold text-warm-gray mb-2">{question.text}</h2>
      {question.subtitle && (
        <p className="text-body text-warm-gray-light mb-2">{question.subtitle}</p>
      )}
      <p className="text-body text-amber-dark mb-6 font-medium">
        Tap to add to your ranking. Tap a ranked item to remove it.
        {rankedCount < minRank && ` Rank at least ${minRank} item${minRank > 1 ? 's' : ''} to continue.`}
      </p>

      {/* Current ranking strip */}
      {rankedCount > 0 && (
        <div className="mb-5 p-4 bg-soft-blue/5 border border-soft-blue/20 rounded-warm-lg">
          <p className="text-sm text-warm-gray-light mb-3 font-medium uppercase tracking-wide">Your ranking</p>
          <div className="flex flex-wrap gap-2">
            {ranking.map((itemId, idx) => {
              const item = question.items.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <button
                  key={itemId}
                  onClick={() => handleRankingTap(itemId)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-warm border border-soft-blue/30 text-body hover:bg-red-50 hover:border-red-200 transition-colors"
                  title="Tap to remove from ranking"
                >
                  <span className="w-7 h-7 rounded-full bg-soft-blue text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-warm-gray font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Items grid — large touch targets */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {question.items.map((item) => {
          const rankIndex = ranking.indexOf(item.id);
          const isRanked = rankIndex >= 0;
          const rank = rankIndex + 1;

          return (
            <button
              key={item.id}
              onClick={() => handleRankingTap(item.id)}
              className={`relative p-5 rounded-warm-lg border-2 transition-all text-left min-h-[72px] ${
                isRanked
                  ? 'border-soft-blue bg-soft-blue/10'
                  : 'border-cream-dark bg-white hover:border-soft-blue/40 hover:bg-cream'
              }`}
            >
              {isRanked && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-soft-blue text-white rounded-full flex items-center justify-center text-sm font-bold shadow-warm">
                  {rank}
                </div>
              )}
              <span className="text-body-lg font-medium text-warm-gray">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
