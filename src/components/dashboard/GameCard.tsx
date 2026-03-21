'use client';
import { RecommendedGame } from '@/types';
import Link from 'next/link';
import {
  BookOpen, Link2, Grid3X3, ListOrdered,
  Puzzle, Calculator, HelpCircle, ArrowRight
} from 'lucide-react';

interface Props {
  game: RecommendedGame;
  rank: number;
}

const GAME_ICONS: Record<string, React.ReactNode> = {
  'word-scramble': <BookOpen className="w-7 h-7" />,
  'word-connection': <Link2 className="w-7 h-7" />,
  'memory-match': <Grid3X3 className="w-7 h-7" />,
  'sequence-recall': <ListOrdered className="w-7 h-7" />,
  'pattern-finder': <Puzzle className="w-7 h-7" />,
  'number-crunch': <Calculator className="w-7 h-7" />,
  'knowledge-quiz': <HelpCircle className="w-7 h-7" />,
};

const GAME_COLORS: Record<string, string> = {
  'word-scramble': 'bg-forest-100 text-forest-700',
  'word-connection': 'bg-sage-100 text-sage-700',
  'memory-match': 'bg-amber-100 text-amber-800',
  'sequence-recall': 'bg-wood-100 text-wood-700',
  'pattern-finder': 'bg-forest-100 text-forest-700',
  'number-crunch': 'bg-amber-100 text-amber-800',
  'knowledge-quiz': 'bg-sage-100 text-sage-700',
};

const difficultyLabels = ['', 'Easy', 'Comfortable', 'Moderate', 'Challenging', 'Advanced'];
const difficultyBadge = ['', 'badge-forest', 'badge-forest', 'badge-amber', 'badge-amber', 'badge-amber'];

export default function GameCard({ game, rank }: Props) {
  const { config, matchScore, difficulty, reason } = game;
  const icon = GAME_ICONS[config.id] || <Puzzle className="w-7 h-7" />;
  const colorClass = GAME_COLORS[config.id] || 'bg-forest-100 text-forest-700';

  return (
    <Link href={`/game/${config.id}?difficulty=${difficulty}`}>
      <div
        className="lodge-card-hover p-5 flex items-center gap-4 group animate-slide-up"
        style={{ animationDelay: `${rank * 60}ms` }}
      >
        {/* Icon */}
        <div className={`w-14 h-14 rounded-lodge flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-body-lg font-semibold text-bark">{config.name}</h3>
            <span className="text-xs font-semibold text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full flex-shrink-0">
              {matchScore}% match
            </span>
          </div>
          <p className="text-body text-bark-light mb-2">{config.shortDesc}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={difficultyBadge[difficulty]}>
              {difficultyLabels[difficulty]}
            </span>
            <span className="text-sm text-bark-lighter italic">{reason}</span>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-bark-lighter flex-shrink-0 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
