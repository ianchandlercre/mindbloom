'use client';
import { useState, useEffect, useCallback } from 'react';
import { InterestArea, StoryDetectivePassage } from '@/types';
import { STORY_PASSAGES } from '@/lib/game-data';

interface Props {
  difficulty: number;
  interests: InterestArea[];
  onAnswer: (correct: boolean, points: number) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: StoryDetectivePassage[];
}

type PhaseType = 'reading' | 'selecting' | 'revealed';

export default function StoryDetective({
  difficulty, interests, onAnswer, onComplete,
  currentRound, totalRounds, score, isComplete, initialRounds,
}: Props) {
  const [passages, setPassages] = useState<StoryDetectivePassage[]>([]);
  const [passageIndex, setPassageIndex] = useState(0);
  const [phase, setPhase] = useState<PhaseType>('reading');
  const [selectedSentences, setSelectedSentences] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  // Load passages
  useEffect(() => {
    if (initialRounds && initialRounds.length > 0) {
      setPassages(initialRounds);
      return;
    }
    // Pick passages from static pool based on interests
    const allPassages: StoryDetectivePassage[] = [];
    const tried = new Set<string>();
    for (const interest of [...interests, 'general']) {
      const pool = STORY_PASSAGES[interest] || STORY_PASSAGES.general;
      for (const p of pool) {
        if (!tried.has(p.passage.slice(0, 30))) {
          allPassages.push(p);
          tried.add(p.passage.slice(0, 30));
        }
      }
    }
    // Shuffle and take totalRounds passages
    const shuffled = [...allPassages].sort(() => Math.random() - 0.5);
    setPassages(shuffled.slice(0, totalRounds));
  }, [initialRounds, interests, totalRounds]);

  const currentPassage = passages[passageIndex];

  const handleSentenceTap = useCallback((idx: number) => {
    if (phase !== 'selecting') return;
    setSelectedSentences(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  }, [phase]);

  const handleSubmitGuesses = useCallback(() => {
    if (!currentPassage) return;
    const errorIndices = currentPassage.errorIndices;

    // Score: points for each correctly identified error, deduct for false positives
    let correct = 0;
    let falsePositives = 0;

    for (const idx of selectedSentences) {
      if (errorIndices.includes(idx)) correct++;
      else falsePositives++;
    }

    // Missed errors
    const missed = errorIndices.filter(idx => !selectedSentences.includes(idx)).length;

    const perfectScore = errorIndices.length;
    const rawScore = correct - falsePositives;
    const isWin = correct > 0 && falsePositives === 0 && missed === 0;
    const isPartial = correct > 0;

    const points = isWin ? 100 : isPartial ? 50 : 0;
    onAnswer(isWin || isPartial, points);
    setRevealed(true);
    setPhase('revealed');
  }, [currentPassage, selectedSentences, onAnswer]);

  const handleNextPassage = useCallback(() => {
    setPassageIndex(prev => prev + 1);
    setPhase('reading');
    setSelectedSentences([]);
    setRevealed(false);
  }, []);

  const handleReadyToSelect = useCallback(() => {
    setPhase('selecting');
  }, []);

  if (!currentPassage) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-soft-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Progress bar
  const progress = totalRounds > 0 ? (passageIndex / totalRounds) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body text-warm-gray-light">Passage {passageIndex + 1} of {totalRounds}</span>
          <span className="text-body font-semibold text-warm-gray">Score: {score}</span>
        </div>
        <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
          <div className="h-full bg-soft-blue rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Theme tag */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-amber/20 text-amber-dark rounded-full text-sm font-medium capitalize">
          {currentPassage.theme}
        </span>
      </div>

      {/* Instructions */}
      {phase === 'reading' && (
        <div className="mb-6 p-4 bg-soft-blue/5 border border-soft-blue/20 rounded-warm-lg">
          <p className="text-body text-warm-gray">
            <strong>Read the passage carefully.</strong> There {currentPassage.errorIndices.length === 1 ? 'is 1 error' : `are ${currentPassage.errorIndices.length} errors`} hidden in it.
            When you are ready, tap "Find the Errors" to start selecting.
          </p>
        </div>
      )}
      {phase === 'selecting' && (
        <div className="mb-6 p-4 bg-amber/10 border border-amber/30 rounded-warm-lg">
          <p className="text-body text-warm-gray">
            <strong>Tap the sentences</strong> that contain errors. There {currentPassage.errorIndices.length === 1 ? 'is 1 error' : `are ${currentPassage.errorIndices.length} errors`} in this passage.
          </p>
        </div>
      )}

      {/* Passage */}
      <div className="bg-white rounded-warm-lg shadow-warm-md p-6 mb-6">
        <div className="space-y-4">
          {currentPassage.sentences.map((sentence, idx) => {
            const isSelected = selectedSentences.includes(idx);
            const isError = revealed && currentPassage.errorIndices.includes(idx);
            const isFalsePositive = revealed && isSelected && !currentPassage.errorIndices.includes(idx);
            const isMissed = revealed && !isSelected && currentPassage.errorIndices.includes(idx);

            let bgClass = 'bg-transparent';
            if (revealed) {
              if (isError && isSelected) bgClass = 'bg-green-100 border-l-4 border-green-500';
              else if (isFalsePositive) bgClass = 'bg-red-50 border-l-4 border-red-400';
              else if (isMissed) bgClass = 'bg-amber/20 border-l-4 border-amber';
            } else if (isSelected) {
              bgClass = 'bg-soft-blue/10 border-l-4 border-soft-blue';
            }

            return (
              <div key={idx}>
                <button
                  onClick={() => handleSentenceTap(idx)}
                  disabled={phase !== 'selecting'}
                  className={`w-full text-left p-4 rounded-warm transition-all text-body leading-relaxed ${bgClass} ${
                    phase === 'selecting'
                      ? 'hover:bg-soft-blue/5 cursor-pointer'
                      : 'cursor-default'
                  }`}
                >
                  {sentence}
                </button>

                {/* Error explanation */}
                {revealed && isError && (
                  <div className="mt-1 ml-4 px-4 py-2 bg-green-50 rounded-warm border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      Error found: {currentPassage.errors.find(e => e.sentenceIndex === idx)?.issue}
                    </p>
                  </div>
                )}
                {revealed && isMissed && (
                  <div className="mt-1 ml-4 px-4 py-2 bg-amber/20 rounded-warm border border-amber/40">
                    <p className="text-sm text-amber-dark font-medium">
                      Missed error: {currentPassage.errors.find(e => e.sentenceIndex === idx)?.issue}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {phase === 'reading' && (
        <button
          onClick={handleReadyToSelect}
          className="w-full py-5 bg-soft-blue text-white rounded-warm text-body-lg font-semibold hover:bg-soft-blue-dark transition-colors shadow-warm"
        >
          Find the Errors
        </button>
      )}

      {phase === 'selecting' && (
        <button
          onClick={handleSubmitGuesses}
          disabled={selectedSentences.length === 0}
          className="w-full py-5 bg-soft-blue text-white rounded-warm text-body-lg font-semibold hover:bg-soft-blue-dark transition-colors shadow-warm disabled:opacity-40"
        >
          Submit My Guesses ({selectedSentences.length} selected)
        </button>
      )}

      {phase === 'revealed' && (
        <button
          onClick={handleNextPassage}
          className="w-full py-5 bg-sage text-white rounded-warm text-body-lg font-semibold hover:bg-sage-dark transition-colors shadow-warm"
        >
          {passageIndex + 1 >= totalRounds ? 'See Results' : 'Next Passage'}
        </button>
      )}
    </div>
  );
}
