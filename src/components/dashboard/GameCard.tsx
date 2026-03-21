'use client';
import { RecommendedGame } from '@/types';
import Link from 'next/link';
import {
  Search, Map, Layers, ShoppingBag, Clock, Flower2,
  BookOpen, Shuffle, Link2, Star,
} from 'lucide-react';

interface Props {
  game: RecommendedGame;
  rank: number;
  isHighlighted?: boolean;
}

const GAME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'story-detective': Search,
  'memory-journey': Map,
  'word-weaver': Layers,
  'number-flow': ShoppingBag,
  'era-quiz': Clock,
  'pattern-garden': Flower2,
  'knowledge-quiz': BookOpen,
  'word-scramble': Shuffle,
  'word-connection': Link2,
};

const difficultyLabels = ['', 'Easy', 'Comfortable', 'Moderate', 'Challenging', 'Advanced'];
const difficultyColors = ['', 'text-sage-dark', 'text-sage-dark', 'text-amber-dark', 'text-amber-dark', 'text-red-500'];

export default function GameCard({ game, rank, isHighlighted }: Props) {
  const { config, matchScore, difficulty, reason } = game;
  const IconComponent = GAME_ICONS[config.id] || Star;

  if (isHighlighted) {
    // Large featured card for top recommendation
    return (
      <Link href={`/game/${config.id}?difficulty=${difficulty}`}>
        <div className="bg-white rounded-warm-lg shadow-warm-md hover:shadow-warm-lg transition-all p-7 cursor-pointer border-2 border-soft-blue/20 hover:border-soft-blue/40 animate-slide-up">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-14 h-14 bg-soft-blue/10 rounded-warm-lg flex items-center justify-center">
              <IconComponent className="w-7 h-7 text-soft-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-soft-blue bg-soft-blue/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Recommended
                  </span>
                  <span className="text-sm font-semibold text-soft-blue">
                    {matchScore}% match
                  </span>
                </div>
              </div>
              <h3 className="text-heading font-bold text-warm-gray mb-2">{config.name}</h3>
              <p className="text-body text-warm-gray-light mb-3">{config.description}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-body font-medium ${difficultyColors[difficulty]}`}>
                  {difficultyLabels[difficulty]}
                </span>
                <span className="text-warm-gray-light">·</span>
                <span className="text-body text-warm-gray-light italic">{reason}</span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-cream-dark">
            <span className="text-body font-semibold text-soft-blue">Play now →</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/game/${config.id}?difficulty=${difficulty}`}>
      <div
        className="bg-white rounded-warm-lg shadow-warm hover:shadow-warm-md transition-all p-5 cursor-pointer border-2 border-transparent hover:border-soft-blue/20 animate-slide-up"
        style={{ animationDelay: `${rank * 60}ms` }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 bg-cream rounded-warm flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-warm-gray" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-body-lg font-bold text-warm-gray">{config.name}</h3>
              <span className="text-sm font-semibold text-soft-blue bg-soft-blue/10 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                {matchScore}%
              </span>
            </div>
            <p className="text-body text-warm-gray-light mb-2">{config.shortDesc}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-sm font-medium ${difficultyColors[difficulty]}`}>
                {difficultyLabels[difficulty]}
              </span>
              <span className="text-warm-gray-light text-sm">·</span>
              <span className="text-sm text-warm-gray-light italic truncate">{reason}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
