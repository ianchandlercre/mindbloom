import { CognitiveProfile, InterestArea, SurveyAnswer, SurveyQuestion, SurveyResponse } from '@/types';

// ===== Original Survey Questions (kept for backward compatibility) =====

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q1',
    text: 'When you have a free afternoon, what sounds most appealing?',
    subtitle: 'Pick the activity that draws you in the most',
    answers: [
      { id: 'q1a', text: 'Reading a good book or magazine', emoji: '📚', dimensionWeights: { verbal: 20, memory: 10 }, interestTags: ['literature'] },
      { id: 'q1b', text: 'Working on a puzzle or brain teaser', emoji: '🧩', dimensionWeights: { logical: 20, spatial: 10 }, interestTags: ['puzzles'] },
      { id: 'q1c', text: 'Going for a walk in nature', emoji: '🌳', dimensionWeights: { spatial: 15, memory: 10 }, interestTags: ['nature'] },
      { id: 'q1d', text: 'Trying a new recipe in the kitchen', emoji: '👨‍🍳', dimensionWeights: { logical: 10, memory: 15 }, interestTags: ['cooking'] },
    ],
  },
  {
    id: 'q2',
    text: 'Which subject did you enjoy most in school?',
    subtitle: 'Think back to your favorite classes',
    answers: [
      { id: 'q2a', text: 'English or Literature', emoji: '✍️', dimensionWeights: { verbal: 25 }, interestTags: ['literature'] },
      { id: 'q2b', text: 'Math or Science', emoji: '🔬', dimensionWeights: { logical: 25 }, interestTags: ['science'] },
      { id: 'q2c', text: 'History or Social Studies', emoji: '🏛️', dimensionWeights: { memory: 20, verbal: 10 }, interestTags: ['history'] },
      { id: 'q2d', text: 'Art, Music, or Physical Education', emoji: '🎨', dimensionWeights: { spatial: 20, memory: 10 }, interestTags: ['music', 'sports'] },
    ],
  },
  {
    id: 'q3',
    text: 'How do you usually give directions to someone?',
    subtitle: 'This tells us about how you think!',
    answers: [
      { id: 'q3a', text: 'I describe landmarks and street names', emoji: '🗣️', dimensionWeights: { verbal: 20, spatial: 10 }, interestTags: [] },
      { id: 'q3b', text: 'I draw a map or picture', emoji: '🗺️', dimensionWeights: { spatial: 25 }, interestTags: ['travel'] },
      { id: 'q3c', text: 'I give step-by-step numbered instructions', emoji: '📝', dimensionWeights: { logical: 20, verbal: 10 }, interestTags: [] },
      { id: 'q3d', text: 'I walk them through it from memory', emoji: '🧠', dimensionWeights: { memory: 25 }, interestTags: [] },
    ],
  },
  {
    id: 'q4',
    text: 'What kind of TV shows or movies do you enjoy most?',
    answers: [
      { id: 'q4a', text: 'Documentaries and educational shows', emoji: '📺', dimensionWeights: { logical: 15, memory: 10 }, interestTags: ['science', 'history'] },
      { id: 'q4b', text: 'Game shows and trivia', emoji: '🎯', dimensionWeights: { memory: 20, verbal: 10 }, interestTags: ['puzzles', 'current_events'] },
      { id: 'q4c', text: 'Sports and competition', emoji: '🏆', dimensionWeights: { spatial: 15, logical: 10 }, interestTags: ['sports'] },
      { id: 'q4d', text: 'Drama, comedy, or classic films', emoji: '🎬', dimensionWeights: { verbal: 15, memory: 10 }, interestTags: ['literature'] },
    ],
  },
  {
    id: 'q5',
    text: 'When you need to remember something important, what do you do?',
    subtitle: 'Everyone has their own memory tricks',
    answers: [
      { id: 'q5a', text: 'Write it down in a list', emoji: '📋', dimensionWeights: { verbal: 15, logical: 10 }, interestTags: [] },
      { id: 'q5b', text: 'Repeat it to myself several times', emoji: '🔄', dimensionWeights: { memory: 25 }, interestTags: [] },
      { id: 'q5c', text: 'Associate it with a picture or place', emoji: '🖼️', dimensionWeights: { spatial: 20, memory: 10 }, interestTags: [] },
      { id: 'q5d', text: 'Set an alarm or ask someone to remind me', emoji: '⏰', dimensionWeights: { logical: 10, memory: 5 }, interestTags: [] },
    ],
  },
  {
    id: 'q6',
    text: 'Which of these would you enjoy at a party?',
    answers: [
      { id: 'q6a', text: 'Having a great conversation', emoji: '💬', dimensionWeights: { verbal: 25 }, interestTags: ['current_events'] },
      { id: 'q6b', text: 'Playing card or board games', emoji: '🃏', dimensionWeights: { logical: 15, memory: 15 }, interestTags: ['puzzles'] },
      { id: 'q6c', text: 'Enjoying the food and drinks', emoji: '🍷', dimensionWeights: { memory: 10, spatial: 10 }, interestTags: ['cooking'] },
      { id: 'q6d', text: 'Listening to or playing music', emoji: '🎶', dimensionWeights: { spatial: 15, memory: 10 }, interestTags: ['music'] },
    ],
  },
  {
    id: 'q7',
    text: 'If you could travel anywhere, where would you go?',
    answers: [
      { id: 'q7a', text: 'A historic city like Rome or Athens', emoji: '🏛️', dimensionWeights: { verbal: 10, memory: 15 }, interestTags: ['history', 'travel'] },
      { id: 'q7b', text: 'A beautiful natural landscape', emoji: '🏔️', dimensionWeights: { spatial: 20 }, interestTags: ['nature', 'travel'] },
      { id: 'q7c', text: 'A world-famous museum or gallery', emoji: '🎭', dimensionWeights: { spatial: 15, verbal: 10 }, interestTags: ['history', 'travel'] },
      { id: 'q7d', text: 'A different country to taste new food', emoji: '🍜', dimensionWeights: { memory: 15, verbal: 10 }, interestTags: ['cooking', 'travel'] },
    ],
  },
  {
    id: 'q8',
    text: 'How comfortable are you with numbers and math?',
    subtitle: 'Be honest — there are no wrong answers!',
    answers: [
      { id: 'q8a', text: 'Very comfortable — I enjoy calculations', emoji: '🔢', dimensionWeights: { logical: 30 }, interestTags: ['science'] },
      { id: 'q8b', text: 'Pretty good with everyday math', emoji: '👍', dimensionWeights: { logical: 20 }, interestTags: [] },
      { id: 'q8c', text: "I manage but it's not my strength", emoji: '😅', dimensionWeights: { logical: 10, verbal: 10 }, interestTags: [] },
      { id: 'q8d', text: 'I prefer words over numbers', emoji: '📖', dimensionWeights: { verbal: 20, logical: 5 }, interestTags: ['literature'] },
    ],
  },
  {
    id: 'q9',
    text: 'When solving a problem, how do you usually approach it?',
    answers: [
      { id: 'q9a', text: 'Break it into logical steps', emoji: '📊', dimensionWeights: { logical: 25 }, interestTags: [] },
      { id: 'q9b', text: 'Talk it through with someone', emoji: '🗨️', dimensionWeights: { verbal: 20, memory: 5 }, interestTags: [] },
      { id: 'q9c', text: 'Visualize the situation in my mind', emoji: '💭', dimensionWeights: { spatial: 25 }, interestTags: [] },
      { id: 'q9d', text: 'Think about similar past experiences', emoji: '💡', dimensionWeights: { memory: 25 }, interestTags: [] },
    ],
  },
  {
    id: 'q10',
    text: 'What do you most enjoy reading about?',
    answers: [
      { id: 'q10a', text: 'Current events and news', emoji: '📰', dimensionWeights: { verbal: 15, memory: 10 }, interestTags: ['current_events'] },
      { id: 'q10b', text: 'Science and nature', emoji: '🌿', dimensionWeights: { logical: 15, spatial: 10 }, interestTags: ['science', 'nature'] },
      { id: 'q10c', text: 'Stories, novels, or biographies', emoji: '📕', dimensionWeights: { verbal: 20, memory: 10 }, interestTags: ['literature'] },
      { id: 'q10d', text: 'How-to guides and practical topics', emoji: '🔧', dimensionWeights: { logical: 15, spatial: 10 }, interestTags: ['cooking', 'puzzles'] },
    ],
  },
  {
    id: 'q11',
    text: 'Which of these games sounds most fun to you?',
    subtitle: 'This helps us recommend the best brain games',
    answers: [
      { id: 'q11a', text: 'Crossword puzzles or word games', emoji: '🔤', dimensionWeights: { verbal: 25, memory: 5 }, interestTags: ['puzzles'] },
      { id: 'q11b', text: 'Sudoku or number puzzles', emoji: '🔢', dimensionWeights: { logical: 25, spatial: 5 }, interestTags: ['puzzles'] },
      { id: 'q11c', text: 'Memory card games', emoji: '🎴', dimensionWeights: { memory: 25, spatial: 5 }, interestTags: ['puzzles'] },
      { id: 'q11d', text: 'Trivia and quiz games', emoji: '❓', dimensionWeights: { memory: 20, verbal: 10 }, interestTags: ['puzzles', 'current_events'] },
    ],
  },
  {
    id: 'q12',
    text: "How would you describe your energy for learning new things?",
    subtitle: "Last question — you're almost done!",
    answers: [
      { id: 'q12a', text: 'I love learning and try new things often', emoji: '🚀', dimensionWeights: { verbal: 10, logical: 10, spatial: 10, memory: 10 }, interestTags: [] },
      { id: 'q12b', text: "I enjoy it when it's at a comfortable pace", emoji: '🌸', dimensionWeights: { verbal: 8, logical: 8, spatial: 8, memory: 8 }, interestTags: [] },
      { id: 'q12c', text: 'I prefer to stick with what I know well', emoji: '🏡', dimensionWeights: { memory: 15, verbal: 5 }, interestTags: [] },
      { id: 'q12d', text: 'I like gentle challenges that build slowly', emoji: '🌱', dimensionWeights: { verbal: 5, logical: 5, spatial: 5, memory: 10 }, interestTags: [] },
    ],
  },
];

// ===== Ranking Survey Types (defined locally — no changes to types/index.ts) =====

export type RankingQuestionType = 'ranking' | 'scale';

export interface RankingOption {
  id: string;
  text: string;
  dimensionWeights: Partial<CognitiveProfile>;
  interestTags: string[];
}

export interface RankingQuestion {
  id: string;
  text: string;
  subtitle?: string;
  type: RankingQuestionType;
  options: RankingOption[];
  scaleLabels?: { min: string; max: string };
  /** Minimum ranked items before the Next button unlocks */
  minRanks?: number;
}

// ===== Ranking Survey Questions =====

export const RANKING_QUESTIONS: RankingQuestion[] = [
  {
    id: 'rq1',
    text: 'What topics interest you most?',
    subtitle: 'Tap them in order — most interesting first. Rank at least 3.',
    type: 'ranking',
    minRanks: 3,
    options: [
      { id: 'rq1_nature',  text: 'The natural world — forests, wildlife, the outdoors', dimensionWeights: { spatial: 15, memory: 10 }, interestTags: ['nature'] },
      { id: 'rq1_history', text: 'History and the past — how the world came to be',      dimensionWeights: { memory: 20, verbal: 10 }, interestTags: ['history'] },
      { id: 'rq1_music',   text: 'Music and the arts — songs, instruments, creativity',   dimensionWeights: { spatial: 15, memory: 5 },  interestTags: ['music'] },
      { id: 'rq1_puzzles', text: 'Puzzles and problem-solving — figuring things out',     dimensionWeights: { logical: 20, spatial: 5 }, interestTags: ['puzzles'] },
      { id: 'rq1_stories', text: 'Stories and literature — books, films, conversation',   dimensionWeights: { verbal: 20, memory: 5 },  interestTags: ['literature'] },
      { id: 'rq1_science', text: 'Science and discovery — how things work',               dimensionWeights: { logical: 15, spatial: 5 }, interestTags: ['science'] },
    ],
  },
  {
    id: 'rq2',
    text: 'How do you prefer to spend a quiet afternoon?',
    subtitle: 'Rank from most to least appealing.',
    type: 'ranking',
    minRanks: 2,
    options: [
      { id: 'rq2_reading', text: 'Reading a book or magazine',         dimensionWeights: { verbal: 20, memory: 10 }, interestTags: ['literature'] },
      { id: 'rq2_walk',    text: 'Walking outside in nature',          dimensionWeights: { spatial: 15 },            interestTags: ['nature'] },
      { id: 'rq2_puzzle',  text: 'Working on a puzzle or game',        dimensionWeights: { logical: 20, spatial: 5 },interestTags: ['puzzles'] },
      { id: 'rq2_music',   text: 'Listening to music or the radio',    dimensionWeights: { spatial: 10, memory: 10 },interestTags: ['music'] },
      { id: 'rq2_cooking', text: 'Cooking, baking, or gardening',      dimensionWeights: { logical: 10, memory: 10 },interestTags: ['cooking'] },
    ],
  },
  {
    id: 'rq3',
    text: 'When learning something new, what helps you most?',
    subtitle: 'Rank from most helpful to least.',
    type: 'ranking',
    minRanks: 2,
    options: [
      { id: 'rq3_visual',  text: 'Seeing pictures, diagrams, or examples',      dimensionWeights: { spatial: 25 },            interestTags: [] },
      { id: 'rq3_reading', text: 'Reading or writing about it',                 dimensionWeights: { verbal: 25 },             interestTags: [] },
      { id: 'rq3_steps',   text: 'Following clear step-by-step instructions',   dimensionWeights: { logical: 20 },            interestTags: [] },
      { id: 'rq3_talking', text: 'Talking it through with someone',             dimensionWeights: { verbal: 15, memory: 10 }, interestTags: [] },
    ],
  },
  {
    id: 'rq4',
    text: 'Which brain games sound most appealing?',
    subtitle: 'Rank your favorites — at least 2.',
    type: 'ranking',
    minRanks: 2,
    options: [
      { id: 'rq4_words',   text: 'Word games — crosswords, anagrams, vocabulary',     dimensionWeights: { verbal: 25, memory: 5 },   interestTags: ['puzzles', 'literature'] },
      { id: 'rq4_numbers', text: 'Number puzzles — math, Sudoku, patterns',           dimensionWeights: { logical: 25 },             interestTags: ['puzzles', 'science'] },
      { id: 'rq4_memory',  text: 'Memory games — matching, recall, sequences',        dimensionWeights: { memory: 25, spatial: 5 },  interestTags: ['puzzles'] },
      { id: 'rq4_trivia',  text: 'Trivia — facts, history, culture, current events',  dimensionWeights: { memory: 20, verbal: 10 },  interestTags: ['puzzles', 'current_events'] },
      { id: 'rq4_pattern', text: 'Finding patterns and solving sequences',            dimensionWeights: { logical: 15, spatial: 10 },interestTags: ['puzzles'] },
    ],
  },
  {
    id: 'rq5',
    text: 'How challenging would you like your brain workouts?',
    subtitle: '1 is gentle and relaxing. 5 is a real workout.',
    type: 'scale',
    scaleLabels: { min: 'Gentle and easy', max: 'Challenging workout' },
    options: [],
  },
];

// ===== Rank multipliers: rank 1 = full weight, lower ranks get less =====
const RANK_MULTIPLIERS = [1.0, 0.65, 0.38, 0.20, 0.10, 0.05];

/**
 * Convert ranking survey state into SurveyResponse[] for the API.
 * - Ranking: { questionId: 'rq1_rank1', answerId: 'rq1_nature' }, { questionId: 'rq1_rank2', ... }, ...
 * - Scale:   { questionId: 'rq5', answerId: '3' }
 */
export function rankingsToResponses(
  rankings: Map<string, string[]>,
  scales: Map<string, number>
): SurveyResponse[] {
  const responses: SurveyResponse[] = [];

  for (const [questionId, orderedIds] of rankings.entries()) {
    orderedIds.forEach((optionId, i) => {
      responses.push({
        questionId: `${questionId}_rank${i + 1}`,
        answerId: optionId,
      });
    });
  }

  for (const [questionId, value] of scales.entries()) {
    responses.push({
      questionId,
      answerId: String(value),
    });
  }

  return responses;
}

// ===== Profile Calculator — handles both old and ranking formats =====

export function calculateProfile(responses: SurveyResponse[]): {
  dimensions: CognitiveProfile;
  interests: InterestArea[];
  difficultyLevel: number;
} {
  // Detect ranking/scale format
  const isRankingFormat = responses.some(r =>
    r.questionId.includes('_rank') ||
    RANKING_QUESTIONS.some(q => q.type === 'scale' && q.id === r.questionId)
  );

  if (isRankingFormat) {
    return calculateFromRankings(responses);
  }

  // ===== Original multiple-choice logic =====
  const dimensions: CognitiveProfile = { verbal: 30, logical: 30, spatial: 30, memory: 30 };
  const interestCounts: Record<string, number> = {};
  let difficultySignal = 0;

  for (const response of responses) {
    const question = SURVEY_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) continue;
    const answer = question.answers.find((a: SurveyAnswer) => a.id === response.answerId);
    if (!answer) continue;

    for (const [dim, weight] of Object.entries(answer.dimensionWeights)) {
      dimensions[dim as keyof CognitiveProfile] += weight as number;
    }
    for (const tag of answer.interestTags) {
      interestCounts[tag] = (interestCounts[tag] || 0) + 1;
    }

    if (response.questionId === 'q8') {
      if (response.answerId === 'q8a') difficultySignal += 2;
      else if (response.answerId === 'q8b') difficultySignal += 1;
      else if (response.answerId === 'q8d') difficultySignal -= 1;
    }
    if (response.questionId === 'q12') {
      if (response.answerId === 'q12a') difficultySignal += 1;
      else if (response.answerId === 'q12c') difficultySignal -= 1;
    }
  }

  const maxPossible = 100;
  for (const dim of Object.keys(dimensions) as (keyof CognitiveProfile)[]) {
    dimensions[dim] = Math.min(100, Math.round((dimensions[dim] / maxPossible) * 100));
  }

  const interests = Object.entries(interestCounts)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([interest]) => interest as InterestArea);

  if (interests.length === 0) interests.push('nature' as InterestArea);

  const difficultyLevel = Math.max(1, Math.min(4, 2 + difficultySignal));
  return { dimensions, interests, difficultyLevel };
}

function calculateFromRankings(responses: SurveyResponse[]): {
  dimensions: CognitiveProfile;
  interests: InterestArea[];
  difficultyLevel: number;
} {
  const dimensions: CognitiveProfile = { verbal: 30, logical: 30, spatial: 30, memory: 30 };
  const interestCounts: Record<string, number> = {};
  let challengeScale = 2; // default: comfortable

  for (const response of responses) {
    // Scale question
    const scaleQuestion = RANKING_QUESTIONS.find(
      q => q.type === 'scale' && q.id === response.questionId
    );
    if (scaleQuestion) {
      challengeScale = parseInt(response.answerId, 10) || 2;
      continue;
    }

    // Ranking response: questionId = 'rq1_rank1', etc.
    const rankMatch = response.questionId.match(/^(rq\d+)_rank(\d+)$/);
    if (!rankMatch) continue;

    const baseQId = rankMatch[1];
    const rankIndex = parseInt(rankMatch[2], 10) - 1; // 0-based
    const multiplier = RANK_MULTIPLIERS[rankIndex] ?? 0.05;

    const question = RANKING_QUESTIONS.find(q => q.id === baseQId);
    if (!question) continue;

    const option = question.options.find(o => o.id === response.answerId);
    if (!option) continue;

    for (const [dim, weight] of Object.entries(option.dimensionWeights)) {
      dimensions[dim as keyof CognitiveProfile] += Math.round((weight as number) * multiplier);
    }

    const interestMultiplier = rankIndex <= 1 ? 1.0 : 0.5;
    for (const tag of option.interestTags) {
      interestCounts[tag] = (interestCounts[tag] || 0) + interestMultiplier;
    }
  }

  // Normalize to 0-100
  for (const dim of Object.keys(dimensions) as (keyof CognitiveProfile)[]) {
    dimensions[dim] = Math.min(100, Math.max(0, dimensions[dim]));
  }

  const interests = Object.entries(interestCounts)
    .filter(([, count]) => count >= 0.5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([interest]) => interest as InterestArea);

  if (interests.length === 0) interests.push('nature' as InterestArea);

  // Map scale 1-5 to difficulty 1-4
  const difficultyLevel = Math.max(1, Math.min(4, Math.round(challengeScale * 0.8)));
  return { dimensions, interests, difficultyLevel };
}
