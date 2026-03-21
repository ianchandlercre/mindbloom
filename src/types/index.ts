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
  | 'current_events'
  | 'art'
  | 'animals';

// ===== Survey (Ranking-based) =====
export type SurveyQuestionType = 'ranking' | 'single-choice';

export interface RankingSurveyItem {
  id: string;
  label: string;
  iconName?: string;
}

export interface RankingSurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  text: string;
  subtitle?: string;
  items: RankingSurveyItem[];
  minRank?: number; // minimum items user must rank
}

export interface RankingSurveyResponse {
  questionId: string;
  answerId: string; // JSON string for ranking, plain string for single-choice
}

// Legacy types kept for backward compatibility
export interface SurveyQuestion {
  id: string;
  text: string;
  subtitle?: string;
  answers: SurveyAnswer[];
}

export interface SurveyAnswer {
  id: string;
  text: string;
  emoji?: string;
  dimensionWeights: Partial<CognitiveProfile>;
  interestTags: InterestArea[];
}

export interface SurveyResponse {
  questionId: string;
  answerId: string;
}

// ===== User Profile =====
export interface UserProfile {
  userId: number;
  dimensions: CognitiveProfile;
  interests: InterestArea[];
  difficultyLevel: number; // 1-5
  preferredEra?: string;
  sessionLength?: 'quick' | 'medium' | 'extended';
}

// ===== Games =====
export type GameType =
  // New games
  | 'story-detective'
  | 'memory-journey'
  | 'word-weaver'
  | 'number-flow'
  | 'era-quiz'
  | 'pattern-garden'
  // Kept games
  | 'knowledge-quiz'
  | 'word-scramble'
  | 'word-connection'
  // Legacy games (still in DB, not shown on dashboard)
  | 'memory-match'
  | 'sequence-recall'
  | 'pattern-finder'
  | 'number-crunch';

export interface GameConfig {
  id: GameType;
  name: string;
  icon: string; // lucide-react icon name
  description: string;
  shortDesc: string;
  primaryDimension: CognitiveDimension;
  secondaryDimension?: CognitiveDimension;
  minDifficulty: number;
  maxDifficulty: number;
  // Legacy
  emoji?: string;
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

// ===== New Game Content Types =====
export interface StoryDetectivePassage {
  passage: string;
  sentences: string[];  // split sentences
  errorIndices: number[]; // which sentences have errors
  errors: Array<{ sentenceIndex: number; issue: string }>;
  theme: string;
}

export interface MemoryJourneyCard {
  id: number;
  label: string;
  imageUrl?: string;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface WordWeaverGroup {
  label: string;
  words: string[];
  color: 'blue' | 'green' | 'amber' | 'rose';
  found?: boolean;
}

export interface WordWeaverPuzzle {
  words: string[]; // all 12 words shuffled
  groups: WordWeaverGroup[];
}

export interface NumberFlowRound {
  scenario: string;
  question: string;
  answer: number;
  options: number[];
  correctIndex: number;
  unit?: string;
}

export interface EraQuizRound {
  question: string;
  options: string[];
  correctIndex: number;
  era: string;
  funFact: string;
  category: string;
}

export interface PatternGardenRound {
  sequence: (number | string)[];
  options: (number | string)[];
  correctIndex: number;
  rule: string;
  theme: string;
}

// Legacy game content types
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
  bgColor?: string;
  textColor?: string;
  greeting: string;
  description?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  theme: string;
  createdAt?: string;
}
