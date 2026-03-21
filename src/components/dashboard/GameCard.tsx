'use client';
import { RecommendedGame, GameType } from '@/types';
import Link from 'next/link';
import {
  Shuffle,
  Link2,
  LayoutGrid,
  List,
  ScanLine,
  Hash,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';

interface Props {
  game: RecommendedGame;
  rank: number;
}

const GAME_ICONS: Record<GameType, LucideIcon> = {
  'word-scramble':   Shuffle,
  'word-connection': Link2,
  'memory-match':    LayoutGrid,
  'sequence-recall': List,
  'pattern-finder':  ScanLine,
  'number-crunch':   Hash,
  'knowledge-quiz':  BookOpen,
};

const difficultyLabels: Record<number, string> = {
  1: 'Easy',
  2: 'Comfortable',
  3: 'Moderate',
  4: 'Challenging',
  5: 'Advanced',
};

export default function GameCard({ game, rank }: Props) {
  const { config, matchScore, difficulty, reason } = game;
  const Icon = GAME_ICONS[config.id] ?? BookOpen;

  return (
    <Link href={`/game/${config.id}?difficulty=${difficulty}`}>
      <div
        className="bg-white rounded-warm-lg shadow-warm hover:shadow-warm-md transition-all p-6 cursor-pointer border-2 border-transparent hover:border-forest-light animate-slide-up"
        style={{ animationDelay: `${rank * 80}ms` }}
      >
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div className="w-14 h-14 bg-forest-pale rounded-warm-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-7 h-7 text-forest" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif text-body-lg font-bold text-forest-dark">{config.name}</h3>
              <span className="text-sm font-semibold text-forest bg-forest-pale px-3 py-1 rounded-full flex-shrink-0 ml-3">
                {matchScore}% match
              </span>
            </div>

            <p className="text-body text-stone mb-3">{config.shortDesc}</p>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-amber-dark">
                {difficultyLabels[difficulty] ?? 'Moderate'}
              </span>
              <span className="text-sm text-stone-pale">·</span>
              <span className="text-sm text-stone-light italic">{reason}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
