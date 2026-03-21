'use client';
import { useState, useEffect, useCallback } from 'react';
import { InterestArea } from '@/types';
import { getMemoryJourneyCards } from '@/lib/game-data';

interface Card {
  id: number;
  pairId: number;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'word' | 'pair';
}

interface Props {
  difficulty: number;
  interests: InterestArea[];
  onAnswer: (correct: boolean, points: number) => void;
  onComplete: () => void;
  score: number;
  isComplete: boolean;
  initialRounds?: any[];
}

// Warm, distinct colors for matched pair groups
const PAIR_COLORS = [
  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }, // amber
  { bg: '#d1fae5', border: '#10b981', text: '#065f46' }, // emerald
  { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' }, // blue
  { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' }, // pink
  { bg: '#ede9fe', border: '#8b5cf6', text: '#4c1d95' }, // violet
  { bg: '#fde68a', border: '#f59e0b', text: '#78350f' }, // yellow
  { bg: '#cffafe', border: '#06b6d4', text: '#155e75' }, // cyan
  { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }, // red
];

export default function MemoryJourney({
  difficulty, interests, onAnswer, onComplete, score, isComplete, initialRounds,
}: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [lastResult, setLastResult] = useState<'match' | 'miss' | null>(null);
  const [animatingCards, setAnimatingCards] = useState<number[]>([]);

  const buildCards = useCallback(() => {
    const pairs = getMemoryJourneyCards(difficulty, interests);
    const cardList: Card[] = [];
    pairs.forEach((pair, idx) => {
      cardList.push({ id: idx * 2, pairId: idx, label: pair.word, isFlipped: false, isMatched: false, type: 'word' });
      cardList.push({ id: idx * 2 + 1, pairId: idx, label: pair.pair, isFlipped: false, isMatched: false, type: 'pair' });
    });
    // Shuffle
    for (let i = cardList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
    }
    return cardList;
  }, [difficulty, interests]);

  useEffect(() => {
    setCards(buildCards());
    setFlipped([]);
    setMatched([]);
    setMatchedPairIds([]);
    setAttempts(0);
    setMatchCount(0);
    setLastResult(null);
    setAnimatingCards([]);
  }, [buildCards]);

  const totalPairs = cards.length / 2;
  const accuracy = attempts > 0 ? Math.round((matchCount / attempts) * 100) : 0;

  const handleCardTap = useCallback((cardId: number) => {
    if (checking) return;
    if (matched.includes(cardId)) return;
    if (flipped.includes(cardId)) return;
    if (flipped.length >= 2) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1);
      setChecking(true);

      const [id1, id2] = newFlipped;
      const card1 = cards.find(c => c.id === id1);
      const card2 = cards.find(c => c.id === id2);
      const isMatch = card1 && card2 && card1.pairId === card2.pairId && card1.id !== card2.id;

      setTimeout(() => {
        if (isMatch) {
          const newMatched = [...matched, id1, id2];
          setMatched(newMatched);
          setMatchedPairIds(prev => [...prev, card1.pairId]);
          setMatchCount(prev => prev + 1);
          setLastResult('match');
          setAnimatingCards([id1, id2]);
          onAnswer(true, 50);

          setTimeout(() => setAnimatingCards([]), 600);

          if (newMatched.length === cards.length) {
            setTimeout(() => onComplete(), 1000);
          }
        } else {
          setLastResult('miss');
          onAnswer(false, 0);
        }
        setFlipped([]);
        setChecking(false);
        setTimeout(() => setLastResult(null), 1200);
      }, 900);
    }
  }, [checking, matched, flipped, cards, onAnswer, onComplete]);

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-soft-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pairsLeft = totalPairs - matchCount;
  const cols = cards.length <= 8 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="bg-white rounded-warm shadow-warm px-4 py-2 text-center">
          <p className="text-heading font-bold text-warm-gray">{matchCount}</p>
          <p className="text-sm text-warm-gray-light">matched</p>
        </div>
        <div className="flex-1 mx-4">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-1">
            {Array.from({ length: totalPairs }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i < matchCount
                    ? PAIR_COLORS[i % PAIR_COLORS.length].border
                    : '#e0ceb6',
                  transform: i < matchCount ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <p className="text-sm text-center text-warm-gray-light">
            {pairsLeft > 0 ? `${pairsLeft} pair${pairsLeft !== 1 ? 's' : ''} to find` : 'All found!'}
          </p>
        </div>
        <div className="bg-white rounded-warm shadow-warm px-4 py-2 text-center">
          <p className="text-heading font-bold text-warm-gray">{attempts}</p>
          <p className="text-sm text-warm-gray-light">tries</p>
        </div>
      </div>

      {/* Feedback message */}
      <div className="h-12 flex items-center justify-center mb-3">
        {lastResult === 'match' && (
          <div className="px-6 py-2 bg-green-100 text-green-800 rounded-warm font-semibold text-body animate-scale-in border border-green-300">
            Match found!
          </div>
        )}
        {lastResult === 'miss' && (
          <div className="px-6 py-2 bg-amber/20 text-amber-dark rounded-warm font-medium text-body animate-fade-in border border-amber/40">
            Not quite — keep looking!
          </div>
        )}
        {!lastResult && pairsLeft > 0 && (
          <p className="text-body text-warm-gray-light text-center">
            Flip two cards to find a matching pair
          </p>
        )}
      </div>

      {/* Card grid */}
      <div className={`grid gap-3 ${cols}`}>
        {cards.map((card) => {
          const isFlippedCard = flipped.includes(card.id);
          const isMatchedCard = matched.includes(card.id);
          const isAnimating = animatingCards.includes(card.id);
          const isVisible = isFlippedCard || isMatchedCard;
          const pairColor = isMatchedCard
            ? PAIR_COLORS[card.pairId % PAIR_COLORS.length]
            : null;

          return (
            <div key={card.id} className="card-flip-container" style={{ height: '100px' }}>
              <div className={`card-flip-inner ${isVisible ? 'flipped' : ''} ${isAnimating ? 'animate-match-pop' : ''}`}
                style={{ height: '100px' }}>
                {/* Face down */}
                <div
                  className="card-face cursor-pointer border-2 transition-colors"
                  style={{
                    backgroundColor: '#faf7f0',
                    borderColor: isFlippedCard ? '#3d8b3d' : '#e0ceb6',
                  }}
                  onClick={() => !isMatchedCard && handleCardTap(card.id)}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e0ceb6' }}>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ae7d4f' }} />
                  </div>
                </div>

                {/* Face up */}
                <div
                  className="card-face card-face-back border-2 transition-all"
                  style={isMatchedCard && pairColor ? {
                    backgroundColor: pairColor.bg,
                    borderColor: pairColor.border,
                  } : {
                    backgroundColor: '#eff6ff',
                    borderColor: '#3b82f6',
                  }}
                >
                  <span
                    className="text-center leading-tight font-bold px-2"
                    style={{
                      fontSize: card.label.length > 8 ? '14px' : '16px',
                      color: isMatchedCard && pairColor ? pairColor.text : '#1e40af',
                    }}
                  >
                    {card.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category hint */}
      {cards.length > 0 && (
        <p className="text-center text-sm text-warm-gray-light mt-6">
          Each word is paired with a closely related term
        </p>
      )}
    </div>
  );
}
