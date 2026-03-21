// ===== User & Auth =====
export interface User {
  id: number;
  name: string;
  created_at: string;
}

export interface AuthPayload {
  name: string;
  pin: string;
}

// ===== Cognitive Dimensions =====
export type CognitiveDimension = 'verbal' | 'logical' | 'spatial' | 'memory';

export interface CognitiveProfile {
  verbal: number;   // 0-100
  logical: number;
  spatial: number;
  memory: number;
}

// ===== Interests =====
export type InterestArea =
  | 'history'
  | 'nature'
  | 'music'
  | 'sports'
  | 'science'
  | 'cooking'
  | 'travel'
  | 'literature'
  | 'puzzles'
  | 'current_events';

export interface UserProfile {
  userId: number;
  dimensions: CognitiveProfile;
  interests: InterestArea[];
  difficultyLevel: number; // 1-5
}

// ===== Survey =====

/** A single option the user can rank */
export interface SurveyAnswer {
  id: string;
  text: string;
  icon?: string; // lucide-react icon name, optional
  dimensionWeights: Partial<CognitiveProfile>;
  interestTags: InterestArea[];
}

/**
 * ranking: user taps items in order of preference (1st, 2nd, 3rd...)
 * scale:   user picks a single value from a range of options
 */
export type SurveyQuestionType = 'ranking' | 'scale';

export interface SurveyQuestion {
  id: string;
  text: string;
  subtitle?: string;
  type: SurveyQuestionType;
  answers: SurveyAnswer[];
  /** Minimum number of items that must be ranked before continuing (ranking type only) */
  minRanks?: number;
}

export interface SurveyResponse {
  questionId: string;
  /** For scale questions: the selected answerId.
   *  For ranking questions: the top-ranked answerId (ranking[0]). */
  answerId: string;
  /** Full ordered ranking (ranking questions only). ranking[0] = 1st choice. */
  ranking?: string[];
}

// ===== Games =====
export type GameType =
  | 'word-scramble'
  | 'word-connection'
  | 'memory-match'
  | 'sequence-recall'
  | 'pattern-finder'
  | 'number-crunch'
  | 'knowledge-quiz';

export interface GameConfig {
  id: GameType;
  name: string;
  emoji: string;
  description: string;
  shortDesc: string;
  primaryDimension: CognitiveDimension;
  secondaryDimension?: CognitiveDimension;
  minDifficulty: number;
  maxDifficulty: number;
}

export interface GameSession {
  id?: number;
  userId: number;
  gameType: GameType;
  score: number;
  accuracy: number;
  duration: number;
  difficulty: number;
  feedback?: GameFeedback;
  createdAt?: string;
}

export interface GameFeedback {
  enjoyment: number;    // 1-5 stars
  difficulty: 'too_easy' | 'just_right' | 'too_hard';
  playAgain: 'yes' | 'maybe' | 'no';
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  score: number;
  correct: number;
  incorrect: number;
  startTime: number;
  isComplete: boolean;
}

// ===== Adaptive Engine =====
export interface RecommendedGame {
  config: GameConfig;
  matchScore: number;    // 0-100
  difficulty: number;
  reason: string;
}

export interface DifficultyAdjustment {
  newDifficulty: number;
  reason: string;
}

// ===== Game Content Types =====
export interface WordScrambleRound {
  word: string;
  scrambled: string;
  hint: string;
  category: string;
}

export interface WordConnectionRound {
  prompt: string;
  options: string[];
  correctIndex: number;
  category: string;
}

export interface MemoryMatchCard {
  id: number;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface SequenceRecallRound {
  sequence: number[];
  displayColors: string[];
}

export interface PatternFinderRound {
  sequence: (number | string)[];
  options: (number | string)[];
  correctIndex: number;
  rule: string;
}

export interface NumberCrunchRound {
  expression: string;
  answer: number;
  options: number[];
  correctIndex: number;
}

export interface KnowledgeQuizRound {
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  funFact: string;
}

// ===== AI Service =====
export interface AIGeneratedContent {
  rounds: any[];
  theme?: string;
}

export interface AISessionAnalysis {
  difficultyAdjustment: DifficultyAdjustment;
  recommendations: string[];
  encouragement: string;
}

export interface AITheme {
  primaryColor: string;
  accentColor: string;
  greeting: string;
}
