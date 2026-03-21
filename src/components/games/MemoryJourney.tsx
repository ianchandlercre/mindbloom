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

export default function MemoryJourney({ difficulty, interests, onAnswer, onComplete, score, isComplete, initialRounds }: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [message, setMessage] = useState('');

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
    setAttempts(0);
    setMatchCount(0);
    setMessage('');
  }, [buildCards]);

  const totalPairs = cards.length / 2;

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
          setMatchCount(prev => prev + 1);
          setMessage('Match found!');
          onAnswer(true, 50);

          if (newMatched.length === cards.length) {
            setTimeout(() => onComplete(), 800);
          }
        } else {
          setMessage('Not a match — keep looking!');
          onAnswer(false, 0);
        }
        setFlipped([]);
        setChecking(false);
        setTimeout(() => setMessage(''), 1500);
      }, 1000);
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats row */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-body text-warm-gray-light">
          <span className="font-semibold text-warm-gray">{matchCount}</span> of {totalPairs} pairs found
        </div>
        <div className="text-body text-warm-gray-light">
          {attempts} attempt{attempts !== 1 ? 's' : ''}
        </div>
        <div className="text-body font-semibold text-warm-gray">
          Score: {score}
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-cream-dark rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-sage rounded-full transition-all duration-500"
          style={{ width: `${(matchCount / totalPairs) * 100}%` }}
        />
      </div>

      {/* Instruction */}
      <div className="mb-6 p-4 bg-soft-blue/5 border border-soft-blue/20 rounded-warm-lg">
        <p className="text-body text-warm-gray">
          Tap two cards to find matching pairs. Each word is paired with a related term.
          {pairsLeft > 0 && ` ${pairsLeft} pair${pairsLeft !== 1 ? 's' : ''} remaining.`}
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-warm text-center text-body font-medium animate-fade-in ${
          message.includes('Match') ? 'bg-green-100 text-green-800' : 'bg-amber/20 text-amber-dark'
        }`}>
          {message}
        </div>
      )}

      {/* Card grid */}
      <div className={`grid gap-3 ${
        cards.length <= 8 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'
      }`}>
        {cards.map((card) => {
          const isFlippedCard = flipped.includes(card.id);
          const isMatchedCard = matched.includes(card.id);
          const isVisible = isFlippedCard || isMatchedCard;

          return (
            <button
              key={card.id}
              onClick={() => handleCardTap(card.id)}
              disabled={isMatchedCard || checking}
              className={`relative aspect-square rounded-warm-lg border-2 transition-all duration-300 flex items-center justify-center p-3 min-h-[90px] ${
                isMatchedCard
                  ? 'border-sage bg-sage/15 cursor-default'
                  : isFlippedCard
                  ? 'border-soft-blue bg-soft-blue/10'
                  : 'border-cream-dark bg-white hover:border-soft-blue/50 hover:bg-cream cursor-pointer'
              }`}
            >
              {isVisible ? (
                <span className={`text-center leading-tight font-semibold ${
                  cards.length <= 8 ? 'text-body' : 'text-sm'
                } ${isMatchedCard ? 'text-sage-dark' : 'text-warm-gray'}`}>
                  {card.label}
                </span>
              ) : (
                <div className="w-8 h-8 rounded-full bg-cream-dark" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
