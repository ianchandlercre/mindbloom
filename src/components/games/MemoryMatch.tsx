'use client';
import { useState, useEffect, useCallback } from 'react';
import { InterestArea, MemoryMatchCard } from '@/types';
import { getMemoryMatchCards } from '@/lib/game-data';
import { getEncouragementMessage } from '@/lib/adaptive-engine';

interface Props {
  difficulty: number;
  interests: InterestArea[];
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  score: number;
  isComplete: boolean;
  initialRounds?: any[];
}

export default function MemoryMatch({ difficulty, interests, onAnswer, onComplete, score, isComplete, initialRounds }: Props) {
  const [cards, setCards] = useState<MemoryMatchCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const [totalPairs, setTotalPairs] = useState(0);

  useEffect(() => {
    const cardData = (initialRounds && initialRounds.length > 0)
      ? initialRounds.map((r: any) => ({ emoji: r.emoji, label: r.label }))
      : getMemoryMatchCards(difficulty, interests);
    setTotalPairs(cardData.length);

    // Create pairs and shuffle
    const pairs: MemoryMatchCard[] = [];
    cardData.forEach((item, index) => {
      pairs.push({ id: index * 2, emoji: item.emoji, label: item.label, isFlipped: false, isMatched: false });
      pairs.push({ id: index * 2 + 1, emoji: item.emoji, label: item.label, isFlipped: false, isMatched: false });
    });

    // Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    setCards(pairs);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  }, [difficulty, interests, initialRounds]);

  const handleFlip = useCallback((index: number) => {
    if (!canFlip || matched.has(index) || flipped.includes(index) || flipped.length >= 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      setMoves(m => m + 1);

      const [first, second] = newFlipped;
      const isMatch = cards[first].emoji === cards[second].emoji;

      setTimeout(() => {
        if (isMatch) {
          const newMatched = new Set(matched);
          newMatched.add(first);
          newMatched.add(second);
          setMatched(newMatched);
          onAnswer(true);

          // Check if all matched
          if (newMatched.size === cards.length) {
            setTimeout(onComplete, 500);
          }
        } else {
          onAnswer(false);
        }
        setFlipped([]);
        setCanFlip(true);
      }, 1000);
    }
  }, [canFlip, matched, flipped, cards, onAnswer, onComplete]);

  if (isComplete) {
    const accuracy = totalPairs > 0 ? Math.round((totalPairs / Math.max(totalPairs, moves)) * 100) : 0;
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-heading font-bold text-warm-gray mb-3">All Matched!</h2>
        <p className="text-body-lg text-warm-gray mb-2">Completed in {moves} moves</p>
        <p className="text-body text-warm-gray mb-2">Score: {score} points</p>
        <p className="text-body text-warm-gray-light mb-6">{getEncouragementMessage(accuracy, 'memory-match')}</p>
      </div>
    );
  }

  const cols = cards.length <= 8 ? 4 : cards.length <= 12 ? 4 : 4;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-body text-warm-gray-light">Moves: {moves}</span>
        <span className="text-body text-warm-gray-light">Pairs: {matched.size / 2} / {totalPairs}</span>
        <span className="text-body font-semibold text-soft-blue">Score: {score}</span>
      </div>
      <div className="w-full bg-cream-dark rounded-full h-3 mb-8">
        <div className="bg-sage rounded-full h-3 transition-all duration-500" style={{ width: `${(matched.size / cards.length) * 100}%` }} />
      </div>

      <div className={`grid grid-cols-${cols} gap-3 max-w-lg mx-auto`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {cards.map((card, index) => {
          const isFlippedNow = flipped.includes(index) || matched.has(index);

          return (
            <button
              key={card.id}
              onClick={() => handleFlip(index)}
              className={`aspect-square rounded-warm text-4xl flex flex-col items-center justify-center transition-all duration-300 shadow-warm ${
                matched.has(index)
                  ? 'bg-sage/20 border-2 border-sage scale-95'
                  : isFlippedNow
                  ? 'bg-white border-2 border-soft-blue'
                  : 'bg-soft-blue hover:bg-soft-blue-light cursor-pointer'
              }`}
              disabled={matched.has(index)}
              style={{ minHeight: '80px' }}
            >
              {isFlippedNow ? (
                <div className="animate-scale-in">
                  <span className="text-3xl">{card.emoji}</span>
                  <p className="text-xs text-warm-gray-light mt-1">{card.label}</p>
                </div>
              ) : (
                <span className="text-2xl text-white">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
