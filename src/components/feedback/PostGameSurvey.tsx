'use client';
import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, HelpCircle, CheckCircle2, Minus, Plus } from 'lucide-react';
import { GameFeedback } from '@/types';

interface Props {
  onSubmit: (feedback: GameFeedback) => void;
  onSkip: () => void;
}

export default function PostGameSurvey({ onSubmit, onSkip }: Props) {
  const [enjoyment, setEnjoyment] = useState(0);
  const [difficulty, setDifficulty] = useState<GameFeedback['difficulty'] | null>(null);
  const [playAgain, setPlayAgain] = useState<GameFeedback['playAgain'] | null>(null);
  const [step, setStep] = useState(0);

  const handleSubmit = () => {
    if (enjoyment > 0 && difficulty && playAgain) {
      onSubmit({ enjoyment, difficulty, playAgain });
    }
  };

  const canContinue = () => {
    if (step === 0) return enjoyment > 0;
    if (step === 1) return difficulty !== null;
    if (step === 2) return playAgain !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-warm-lg shadow-warm-md animate-slide-up">
      <h3 className="text-heading font-bold text-warm-gray text-center mb-6">How was that?</h3>

      {/* Step 1: Enjoyment Stars */}
      {step === 0 && (
        <div className="text-center animate-fade-in">
          <p className="text-body-lg text-warm-gray mb-4">How much did you enjoy that game?</p>
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setEnjoyment(star)}
                className={`transition-transform hover:scale-110 ${
                  star <= enjoyment ? 'text-amber' : 'text-warm-gray-light/30'
                }`}
              >
                <Star className="w-10 h-10" fill={star <= enjoyment ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          {enjoyment > 0 && (
            <p className="text-body text-warm-gray-light animate-fade-in">
              {enjoyment <= 2 ? 'We\'ll find something you enjoy more!' :
               enjoyment === 3 ? 'Good to know!' :
               'Wonderful! Glad you enjoyed it!'}
            </p>
          )}
        </div>
      )}

      {/* Step 2: Difficulty */}
      {step === 1 && (
        <div className="text-center animate-fade-in">
          <p className="text-body-lg text-warm-gray mb-4">How was the difficulty level?</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'too_easy' as const, label: 'Too Easy', Icon: Minus, desc: 'I need more challenge' },
              { value: 'just_right' as const, label: 'Just Right', Icon: CheckCircle2, desc: 'Perfect for me' },
              { value: 'too_hard' as const, label: 'Too Hard', Icon: Plus, desc: 'A bit much for me' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                className={`p-4 rounded-warm text-left transition-all flex items-center gap-4 ${
                  difficulty === opt.value
                    ? 'bg-soft-blue/10 border-2 border-soft-blue'
                    : 'bg-cream border-2 border-cream-dark hover:border-soft-blue-light'
                }`}
              >
                <opt.Icon className={`w-7 h-7 ${difficulty === opt.value ? 'text-soft-blue' : 'text-warm-gray-light'}`} />
                <div>
                  <p className="text-body font-medium text-warm-gray">{opt.label}</p>
                  <p className="text-sm text-warm-gray-light">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Play Again */}
      {step === 2 && (
        <div className="text-center animate-fade-in">
          <p className="text-body-lg text-warm-gray mb-4">Would you play this game again?</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'yes' as const, label: 'Yes!', Icon: ThumbsUp },
              { value: 'maybe' as const, label: 'Maybe', Icon: HelpCircle },
              { value: 'no' as const, label: 'Not really', Icon: ThumbsDown },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setPlayAgain(opt.value)}
                className={`p-4 rounded-warm transition-all flex flex-col items-center gap-2 ${
                  playAgain === opt.value
                    ? 'bg-soft-blue/10 border-2 border-soft-blue'
                    : 'bg-cream border-2 border-cream-dark hover:border-soft-blue-light'
                }`}
              >
                <opt.Icon className={`w-7 h-7 ${playAgain === opt.value ? 'text-soft-blue' : 'text-warm-gray-light'}`} />
                <p className="text-body font-medium text-warm-gray">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onSkip}
          className="py-3 px-6 text-body text-warm-gray-light hover:text-warm-gray transition-colors"
        >
          Skip
        </button>
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          className="py-3 px-8 bg-soft-blue text-white rounded-warm text-body font-medium hover:bg-soft-blue-dark transition-colors disabled:opacity-50"
        >
          {step === 2 ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  );
}
