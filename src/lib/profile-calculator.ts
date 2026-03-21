import { CognitiveProfile, InterestArea, SurveyQuestion, SurveyResponse } from '@/types';

// ===== Survey Questions =====

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'topics',
    text: 'What topics fascinate you?',
    subtitle: 'Tap to rank your favorites — first tap is your top choice',
    type: 'ranking',
    maxRank: 3,
    answers: [
      { id: 'history',        text: 'History',        dimensionWeights: { memory: 15, verbal: 10 }, interestTags: ['history'] },
      { id: 'nature',         text: 'Nature',          dimensionWeights: { spatial: 15 },            interestTags: ['nature'] },
      { id: 'music',          text: 'Music',           dimensionWeights: { memory: 15, spatial: 10 }, interestTags: ['music'] },
      { id: 'sports',         text: 'Sports',          dimensionWeights: { spatial: 10, logical: 10 }, interestTags: ['sports'] },
      { id: 'science',        text: 'Science',         dimensionWeights: { logical: 20 },            interestTags: ['science'] },
      { id: 'travel',         text: 'Travel',          dimensionWeights: { spatial: 15, memory: 10 }, interestTags: ['travel'] },
      { id: 'art',            text: 'Art',             dimensionWeights: { spatial: 20 },            interestTags: ['literature'] },
      { id: 'cooking',        text: 'Cooking',         dimensionWeights: { logical: 10, memory: 15 }, interestTags: ['cooking'] },
      { id: 'animals',        text: 'Animals',         dimensionWeights: { memory: 10, spatial: 10 }, interestTags: ['nature'] },
      { id: 'current_events', text: 'Current Events', dimensionWeights: { verbal: 15, memory: 10 }, interestTags: ['current_events'] },
    ],
  },
  {
    id: 'challenge',
    text: 'What kind of challenge suits you?',
    subtitle: 'Rank your top choices — these become your recommended games',
    type: 'ranking',
    maxRank: 3,
    answers: [
      { id: 'word_puzzles',    text: 'Word puzzles',    dimensionWeights: { verbal: 25 },             interestTags: ['puzzles'] },
      { id: 'number_games',    text: 'Number games',    dimensionWeights: { logical: 25 },            interestTags: ['science'] },
      { id: 'memory_tests',    text: 'Memory tests',    dimensionWeights: { memory: 25 },             interestTags: ['puzzles'] },
      { id: 'visual_patterns', text: 'Visual patterns', dimensionWeights: { spatial: 25 },            interestTags: [] },
      { id: 'trivia',          text: 'Trivia',          dimensionWeights: { memory: 20, verbal: 10 }, interestTags: ['current_events'] },
      { id: 'logic_problems',  text: 'Logic problems',  dimensionWeights: { logical: 20, spatial: 10 }, interestTags: ['puzzles'] },
    ],
  },
  {
    id: 'learning_style',
    text: 'How do you like to learn?',
    subtitle: 'Rank what feels most natural to you',
    type: 'ranking',
    maxRank: 2,
    answers: [
      { id: 'reading',    text: 'Reading',    dimensionWeights: { verbal: 20, memory: 10 }, interestTags: ['literature'] },
      { id: 'watching',   text: 'Watching',   dimensionWeights: { spatial: 15, memory: 15 }, interestTags: [] },
      { id: 'doing',      text: 'Doing',      dimensionWeights: { logical: 15, spatial: 10 }, interestTags: [] },
      { id: 'discussing', text: 'Discussing', dimensionWeights: { verbal: 25 },              interestTags: ['current_events'] },
    ],
  },
  {
    id: 'era',
    text: 'What era speaks to you?',
    subtitle: 'The time period that feels like home',
    type: 'choice',
    answers: [
      { id: 'era_40s50s', text: '1940s – 1950s', dimensionWeights: { memory: 15 },            interestTags: ['history'] },
      { id: 'era_60s70s', text: '1960s – 1970s', dimensionWeights: { memory: 10, verbal: 10 }, interestTags: ['music'] },
      { id: 'era_80s90s', text: '1980s – 1990s', dimensionWeights: { logical: 10, memory: 10 }, interestTags: ['sports'] },
      { id: 'era_modern', text: 'Modern day',    dimensionWeights: { logical: 15 },            interestTags: ['current_events'] },
    ],
  },
  {
    id: 'session_length',
    text: 'How long do you like your sessions?',
    subtitle: 'Pick what feels comfortable on most days',
    type: 'choice',
    answers: [
      { id: 'quick',    text: 'Quick — about 5 minutes',   dimensionWeights: {},                                    interestTags: [] },
      { id: 'medium',   text: 'Medium — about 10 minutes', dimensionWeights: { logical: 5, memory: 5 },             interestTags: [] },
      { id: 'extended', text: 'Extended — 20+ minutes',    dimensionWeights: { logical: 10, memory: 10, verbal: 5 }, interestTags: [] },
    ],
  },
  {
    id: 'difficulty',
    text: 'How would you like to start?',
    subtitle: 'We adapt as you play — this is just the starting point',
    type: 'choice',
    answers: [
      { id: 'gentle',    text: 'Gentle start — ease me in', dimensionWeights: {}, interestTags: [] },
      { id: 'normal',    text: 'Jump right in',              dimensionWeights: {}, interestTags: [] },
      { id: 'challenge', text: 'Challenge me',               dimensionWeights: {}, interestTags: [] },
    ],
  },
];

// ===== Profile Calculator =====

export function calculateProfile(responses: SurveyResponse[]): {
  dimensions: CognitiveProfile;
  interests: InterestArea[];
  difficultyLevel: number;
} {
  const dimensions: CognitiveProfile = { verbal: 30, logical: 30, spatial: 30, memory: 30 };
  const interestCounts: Record<string, number> = {};
  let difficultyLevel = 2;

  for (const response of responses) {
    const question = SURVEY_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) continue;

    if (question.type === 'ranking') {
      // answerId is "id1|id2|id3" — rank 1 gets most weight
      const rankedIds = response.answerId.split('|').filter(Boolean);
      const rankWeights = [3, 2, 1, 0.5];

      rankedIds.forEach((itemId, index) => {
        const answer = question.answers.find(a => a.id === itemId);
        if (!answer) return;
        const mult = rankWeights[index] ?? 0.5;
        for (const [dim, weight] of Object.entries(answer.dimensionWeights)) {
          dimensions[dim as keyof CognitiveProfile] += (weight as number) * mult;
        }
        for (const tag of answer.interestTags) {
          interestCounts[tag] = (interestCounts[tag] || 0) + (rankWeights[index] ?? 0.5);
        }
      });
    } else {
      // Regular single-choice question
      const answer = question.answers.find(a => a.id === response.answerId);
      if (!answer) continue;

      for (const [dim, weight] of Object.entries(answer.dimensionWeights)) {
        dimensions[dim as keyof CognitiveProfile] += weight as number;
      }
      for (const tag of answer.interestTags) {
        interestCounts[tag] = (interestCounts[tag] || 0) + 1;
      }
    }

    // Difficulty from the dedicated question
    if (response.questionId === 'difficulty') {
      if (response.answerId === 'gentle')         difficultyLevel = 1;
      else if (response.answerId === 'normal')    difficultyLevel = 2;
      else if (response.answerId === 'challenge') difficultyLevel = 3;
    }
  }

  // Normalize dimensions to 0–100
  const maxPossible = 130;
  for (const dim of Object.keys(dimensions) as (keyof CognitiveProfile)[]) {
    dimensions[dim] = Math.min(100, Math.round((dimensions[dim] / maxPossible) * 100));
  }

  // Pick top interests (at least mentioned once)
  const interests = Object.entries(interestCounts)
    .filter(([, count]) => count >= 0.5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([interest]) => interest as InterestArea);

  if (interests.length === 0) {
    interests.push('history' as InterestArea);
  }

  return { dimensions, interests, difficultyLevel };
}
