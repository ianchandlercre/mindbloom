'use client';
import { useState, useEffect, useCallback } from 'react';
import { WordScrambleRound, InterestArea } from '@/types';
import { getWordScrambleRounds } from '@/lib/game-data';
import { getEncouragementMessage } from '@/lib/adaptive-engine';

interface Props {
  difficulty: number;
  interests: InterestArea[];
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: any[];
}

export default function WordScramble({ difficulty, interests, onAnswer, onComplete, currentRound, totalRounds, score, isComplete, initialRounds }: Props) {
  const [rounds, setRounds] = useState<WordScrambleRound[]>([]);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      // AI rounds for word scramble need a scrambled version generated client-side
      setRounds(initialRounds.map((r: any) => ({
        word: r.word?.toUpperCase() || r.word,
        scrambled: r.scrambled || r.word?.toUpperCase().split('').sort(() => Math.random() - 0.5).join('') || '',
        hint: r.hint || '',
        category: r.category || 'general',
      })) as WordScrambleRound[]);
    } else {
      setRounds(getWordScrambleRounds(difficulty, interests, totalRounds));
    }
  }, [difficulty, interests, totalRounds, initialRounds]);

  const round = rounds[currentRound];

  const handleSubmit = useCallback(() => {
    if (!round || !input.trim()) return;
    const isCorrect = input.trim().toUpperCase() === round.word;
    const message = isCorrect
      ? '✅ Correct! Well done!'
      : `❌ The answer was: ${round.word}`;

    setFeedback({ correct: isCorrect, message });
    onAnswer(isCorrect);

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      setShowHint(false);
      setHintUsed(false);
      if (currentRound + 1 >= totalRounds) {
        onComplete();
      }
    }, 1800);
  }, [round, input, onAnswer, onComplete, currentRound, totalRounds]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (!round) return null;

  if (isComplete) {
    const accuracy = totalRounds > 0 ? Math.round((score / (totalRounds * 10)) * 100) : 0;
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-heading font-bold text-warm-gray mb-3">Game Complete!</h2>
        <p className="text-body-lg text-warm-gray mb-2">Score: {score} points</p>
        <p className="text-body text-warm-gray-light mb-6">{getEncouragementMessage(accuracy, 'word-scramble')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-body text-warm-gray-light">Round {currentRound + 1} of {totalRounds}</span>
        <span className="text-body font-semibold text-soft-blue">Score: {score}</span>
      </div>
      <div className="w-full bg-cream-dark rounded-full h-3 mb-8">
        <div className="bg-soft-blue rounded-full h-3 transition-all duration-500" style={{ width: `${(currentRound / totalRounds) * 100}%` }} />
      </div>

      {/* Scrambled Word */}
      <div className="text-center mb-8">
        <p className="text-body text-warm-gray-light mb-3">Unscramble this word:</p>
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {round.scrambled.split('').map((letter, i) => (
            <div key={i} className="w-14 h-14 bg-white rounded-warm shadow-warm flex items-center justify-center text-2xl font-bold text-soft-blue-dark">
              {letter}
            </div>
          ))}
        </div>
        {round.category && (
          <span className="inline-block px-3 py-1 bg-soft-blue/10 text-soft-blue rounded-full text-sm">
            {round.category}
          </span>
        )}
      </div>

      {/* Hint */}
      {showHint && (
        <div className="text-center mb-4 p-3 bg-amber/10 rounded-warm animate-fade-in">
          <p className="text-body text-amber-dark">💡 Hint: {round.hint}</p>
        </div>
      )}

      {/* Input */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={handleKeyPress}
          placeholder="Type your answer..."
          className="w-full text-body-lg p-4 border-2 border-cream-dark rounded-warm focus:border-soft-blue focus:outline-none text-center font-semibold tracking-wider bg-white"
          autoFocus
          disabled={!!feedback}
          maxLength={round.word.length + 2}
        />

        <div className="flex gap-3 mt-4">
          {!hintUsed && (
            <button
              onClick={() => { setShowHint(true); setHintUsed(true); }}
              className="flex-1 py-4 px-6 bg-amber/20 text-amber-dark rounded-warm text-body font-medium hover:bg-amber/30 transition-colors"
              disabled={!!feedback}
            >
              💡 Show Hint
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 px-6 bg-soft-blue text-white rounded-warm text-body font-medium hover:bg-soft-blue-dark transition-colors disabled:opacity-50"
            disabled={!input.trim() || !!feedback}
          >
            Check Answer
          </button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-6 p-4 rounded-warm text-center text-body-lg font-medium animate-scale-in ${
          feedback.correct ? 'bg-sage/20 text-sage-dark' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}
