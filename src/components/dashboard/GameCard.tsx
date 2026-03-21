'use client';
import { RecommendedGame } from '@/types';
import Link from 'next/link';

interface Props {
  game: RecommendedGame;
  rank: number;
}

const difficultyLabels = ['', 'Easy', 'Comfortable', 'Moderate', 'Challenging', 'Advanced'];
const difficultyColors = ['', 'text-sage', 'text-sage', 'text-amber', 'text-amber-dark', 'text-red-500'];

export default function GameCard({ game, rank }: Props) {
  const { config, matchScore, difficulty, reason } = game;

  return (
    <Link href={`/game/${config.id}?difficulty=${difficulty}`}>
      <div className="bg-white rounded-warm-lg shadow-warm hover:shadow-warm-md transition-all p-6 cursor-pointer border-2 border-transparent hover:border-soft-blue-light animate-slide-up"
        style={{ animationDelay: `${rank * 80}ms` }}>
        <div className="flex items-start gap-4">
          {/* Emoji Icon */}
          <div className="text-5xl flex-shrink-0">{config.emoji}</div>

          <div className="flex-1 min-w-0">
            {/* Name and Match */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-body-lg font-bold text-warm-gray">{config.name}</h3>
              <span className="text-sm font-semibold text-soft-blue bg-soft-blue/10 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                {matchScore}% match
              </span>
            </div>

            {/* Description */}
            <p className="text-body text-warm-gray-light mb-3">{config.shortDesc}</p>

            {/* Difficulty and Reason */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-sm font-medium ${difficultyColors[difficulty]}`}>
                {difficultyLabels[difficulty]}
              </span>
              <span className="text-sm text-warm-gray-light">•</span>
              <span className="text-sm text-warm-gray-light italic">{reason}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
