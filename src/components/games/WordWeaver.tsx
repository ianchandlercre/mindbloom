'use client';
import { useState, useEffect, useCallback } from 'react';
import { InterestArea, WordWeaverPuzzle } from '@/types';
import { WORD_WEAVER_PUZZLES } from '@/lib/game-data';

interface Props {
  difficulty: number;
  interests: InterestArea[];
  onAnswer: (correct: boolean, points: number) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: any[];
}

type GroupColor = 'blue' | 'green' | 'amber' | 'rose';

const colorStyles: Record<GroupColor, { bg: string; border: string; text: string; foundBg: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', foundBg: 'bg-blue-100' },
  green: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', foundBg: 'bg-green-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', foundBg: 'bg-amber-100' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800', foundBg: 'bg-rose-100' },
};

export default function WordWeaver({
  difficulty, interests, onAnswer, onComplete,
  currentRound, totalRounds, score, isComplete, initialRounds,
}: Props) {
  const [puzzles, setPuzzles] = useState<WordWeaverPuzzle[]>([]);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<Array<{ label: string; words: string[]; color: GroupColor }>>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'good' | 'bad' | 'neutral'>('neutral');
  const [mistakes, setMistakes] = useState(0);

  // Load puzzles
  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      const formatted = initialRounds.map((r: any) => ({
        words: r.words,
        groups: r.groups,
      })) as WordWeaverPuzzle[];
      setPuzzles(formatted);
      return;
    }
    // Use static puzzles shuffled
    const shuffled = [...WORD_WEAVER_PUZZLES].sort(() => Math.random() - 0.5);
    setPuzzles(shuffled.slice(0, totalRounds));
  }, [initialRounds, totalRounds]);

  const currentPuzzle = puzzles[puzzleIndex];

  // Set up words when puzzle changes
  useEffect(() => {
    if (!currentPuzzle) return;
    const shuffled = [...currentPuzzle.words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setSelected([]);
    setFoundGroups([]);
    setMessage('');
    setMistakes(0);
  }, [currentPuzzle]);

  const handleWordTap = useCallback((word: string) => {
    if (foundGroups.some(g => g.words.includes(word))) return;
    setSelected(prev => {
      if (prev.includes(word)) return prev.filter(w => w !== word);
      if (prev.length >= 4) return prev; // Max 4 selections
      return [...prev, word];
    });
  }, [foundGroups]);

  const handleSubmit = useCallback(() => {
    if (!currentPuzzle || selected.length < 3) return;

    // Check against all groups (support 3-word and 4-word groups)
    const match = currentPuzzle.groups.find(g => {
      const overlap = selected.filter(w => g.words.includes(w));
      return overlap.length === g.words.length && selected.length === g.words.length;
    });

    if (match) {
      const newFoundGroups = [...foundGroups, { label: match.label, words: match.words, color: match.color }];
      setFoundGroups(newFoundGroups);
      setSelected([]);
      setMessage(`Correct! "${match.label}" — well done!`);
      setMessageType('good');
      onAnswer(true, 100);

      if (newFoundGroups.length === currentPuzzle.groups.length) {
        setTimeout(() => {
          if (currentRound > totalRounds) {
            onComplete();
          } else {
            // advance to next puzzle
            setPuzzleIndex(prev => prev + 1);
            setFoundGroups([]);
          }
        }, 1200);
      }
    } else {
      setMistakes(prev => prev + 1);
      setMessage("Not quite — try a different combination.");
      setMessageType('bad');
      setSelected([]);
    }

    setTimeout(() => setMessage(''), 2000);
  }, [currentPuzzle, selected, foundGroups, onAnswer, currentRound, totalRounds, onComplete, setPuzzleIndex]);

  const handleClear = useCallback(() => setSelected([]), []);

  if (!currentPuzzle) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-soft-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const remainingWords = words.filter(w =>
    !foundGroups.some(g => g.words.includes(w))
  );
  const groupSize = currentPuzzle.groups[0]?.words.length || 3;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header stats */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-body text-warm-gray-light">Puzzle {currentRound} of {totalRounds}</span>
        <span className="text-body font-semibold text-warm-gray">Score: {score}</span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-cream-dark rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-soft-blue rounded-full transition-all duration-500"
          style={{ width: `${((currentRound - 1) / totalRounds) * 100}%` }}
        />
      </div>

      {/* Instructions */}
      <div className="mb-5 p-4 bg-soft-blue/5 border border-soft-blue/20 rounded-warm-lg">
        <p className="text-body text-warm-gray">
          Find groups of {groupSize} words that share a hidden connection.
          Select {groupSize} words and press <strong>Submit Group</strong>.
        </p>
      </div>

      {/* Found groups */}
      {foundGroups.length > 0 && (
        <div className="space-y-2 mb-5">
          {foundGroups.map((group) => {
            const style = colorStyles[group.color] || colorStyles.blue;
            return (
              <div key={group.label} className={`p-4 rounded-warm-lg border ${style.foundBg} ${style.border}`}>
                <p className={`text-sm font-semibold mb-1 uppercase tracking-wide ${style.text}`}>{group.label}</p>
                <p className={`text-body font-medium ${style.text}`}>{group.words.join(' · ')}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-warm text-center text-body font-medium animate-fade-in ${
          messageType === 'good' ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Word grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {remainingWords.map((word) => {
          const isSelected = selected.includes(word);
          return (
            <button
              key={word}
              onClick={() => handleWordTap(word)}
              className={`py-4 px-3 rounded-warm-lg border-2 text-center font-medium transition-all min-h-[64px] flex items-center justify-center ${
                isSelected
                  ? 'border-soft-blue bg-soft-blue text-white shadow-warm'
                  : 'border-cream-dark bg-white text-warm-gray hover:border-soft-blue/50 hover:bg-cream'
              } ${selected.length >= groupSize && !isSelected ? 'opacity-50' : ''}`}
            >
              <span className="text-body">{word}</span>
            </button>
          );
        })}
      </div>

      {/* Mistakes */}
      {mistakes > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-body text-warm-gray-light">Mistakes:</span>
          {Array.from({ length: Math.min(mistakes, 4) }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-red-400" />
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleClear}
          disabled={selected.length === 0}
          className="flex-1 py-4 border-2 border-cream-dark text-warm-gray rounded-warm text-body font-medium hover:bg-cream disabled:opacity-30 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={selected.length < groupSize}
          className="flex-1 py-4 bg-soft-blue text-white rounded-warm text-body-lg font-semibold hover:bg-soft-blue-dark disabled:opacity-40 transition-colors shadow-warm"
        >
          Submit Group
        </button>
      </div>
    </div>
  );
}
