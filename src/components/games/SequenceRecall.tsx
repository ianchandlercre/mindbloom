'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { SEQUENCE_COLORS, getSequenceLength } from '@/lib/game-data';
import { getEncouragementMessage } from '@/lib/adaptive-engine';

interface Props {
  difficulty: number;
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  currentRound: number;
  totalRounds: number;
  score: number;
  isComplete: boolean;
  initialRounds?: any[];
}

type Phase = 'watching' | 'playing' | 'feedback';

export default function SequenceRecall({ difficulty, onAnswer, onComplete, currentRound, totalRounds, score, isComplete, initialRounds }: Props) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('watching');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [pressedBtn, setPressedBtn] = useState<number>(-1);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  const generateSequence = useCallback(() => {
    if (initialRounds && initialRounds[currentRound]?.sequence) {
      return initialRounds[currentRound].sequence as number[];
    }
    const length = getSequenceLength(difficulty, currentRound);
    return Array.from({ length }, () => Math.floor(Math.random() * 4));
  }, [difficulty, currentRound, initialRounds]);

  const playSequence = useCallback((seq: number[]) => {
    setPhase('watching');
    setActiveIndex(-1);

    // Clear previous timeouts
    timeoutRef.current.forEach(t => clearTimeout(t));
    timeoutRef.current = [];

    seq.forEach((colorIdx, i) => {
      const t1 = setTimeout(() => setActiveIndex(colorIdx), (i + 1) * 800);
      const t2 = setTimeout(() => setActiveIndex(-1), (i + 1) * 800 + 500);
      timeoutRef.current.push(t1, t2);
    });

    const t3 = setTimeout(() => {
      setPhase('playing');
      setPlayerInput([]);
    }, (seq.length + 1) * 800);
    timeoutRef.current.push(t3);
  }, []);

  useEffect(() => {
    if (isComplete) return;
    const seq = generateSequence();
    setSequence(seq);
    playSequence(seq);

    return () => {
      timeoutRef.current.forEach(t => clearTimeout(t));
    };
  }, [currentRound, isComplete]);

  const handlePress = useCallback((colorIdx: number) => {
    if (phase !== 'playing') return;

    setPressedBtn(colorIdx);
    setTimeout(() => setPressedBtn(-1), 200);

    const newInput = [...playerInput, colorIdx];
    setPlayerInput(newInput);

    const stepIdx = newInput.length - 1;

    if (newInput[stepIdx] !== sequence[stepIdx]) {
      // Wrong!
      setPhase('feedback');
      setFeedbackMsg('❌ Not quite! Watch the sequence again.');
      onAnswer(false);
      setTimeout(() => {
        setFeedbackMsg('');
        if (currentRound + 1 >= totalRounds) {
          onComplete();
        }
      }, 1500);
      return;
    }

    if (newInput.length === sequence.length) {
      // Correct!
      setPhase('feedback');
      setFeedbackMsg('✅ Perfect recall!');
      onAnswer(true);
      setTimeout(() => {
        setFeedbackMsg('');
        if (currentRound + 1 >= totalRounds) {
          onComplete();
        }
      }, 1500);
    }
  }, [phase, playerInput, sequence, onAnswer, onComplete, currentRound, totalRounds]);

  if (isComplete) {
    const accuracy = totalRounds > 0 ? Math.round((score / (totalRounds * 10)) * 100) : 0;
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-heading font-bold text-warm-gray mb-3">Game Complete!</h2>
        <p className="text-body-lg text-warm-gray mb-2">Score: {score} points</p>
        <p className="text-body text-warm-gray-light mb-6">{getEncouragementMessage(accuracy, 'sequence-recall')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-body text-warm-gray-light">Round {currentRound + 1} of {totalRounds}</span>
        <span className="text-body font-semibold text-soft-blue">Score: {score}</span>
      </div>
      <div className="w-full bg-cream-dark rounded-full h-3 mb-8">
        <div className="bg-soft-blue rounded-full h-3 transition-all duration-500" style={{ width: `${(currentRound / totalRounds) * 100}%` }} />
      </div>

      <div className="text-center mb-6">
        {phase === 'watching' && (
          <p className="text-body-lg text-warm-gray animate-pulse-gentle">👀 Watch the sequence...</p>
        )}
        {phase === 'playing' && (
          <p className="text-body-lg text-warm-gray">🎯 Your turn! Tap the colors in order ({playerInput.length}/{sequence.length})</p>
        )}
        {phase === 'feedback' && (
          <p className="text-body-lg font-medium animate-scale-in">{feedbackMsg}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {SEQUENCE_COLORS.map((colorObj, i) => (
          <button
            key={i}
            onClick={() => handlePress(i)}
            disabled={phase !== 'playing'}
            className="aspect-square rounded-warm-lg transition-all duration-200 shadow-warm flex items-center justify-center"
            style={{
              backgroundColor: colorObj.color,
              opacity: activeIndex === i ? 1 : pressedBtn === i ? 0.9 : 0.6,
              transform: activeIndex === i || pressedBtn === i ? 'scale(1.05)' : 'scale(1)',
              boxShadow: activeIndex === i ? `0 0 30px ${colorObj.color}` : undefined,
              minHeight: '100px',
            }}
          >
            <span className="text-white text-body-lg font-medium drop-shadow">{colorObj.name}</span>
          </button>
        ))}
      </div>

      {sequence.length > 0 && (
        <p className="text-center text-sm text-warm-gray-light mt-6">Sequence length: {sequence.length}</p>
      )}
    </div>
  );
}
