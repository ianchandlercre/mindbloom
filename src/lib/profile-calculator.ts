import { CognitiveProfile, InterestArea, SurveyQuestion, SurveyResponse } from '@/types';

// ===== Survey Questions (Ranking-Based) =====

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q_activities',
    text: 'What do you most enjoy doing with free time?',
    subtitle: 'Tap each activity in order — your favorite first, then second favorite, and so on.',
    type: 'ranking',
    minRanks: 3,
    answers: [
      {
        id: 'act_reading',
        text: 'Reading books, magazines, or the news',
        dimensionWeights: { verbal: 20, memory: 8 },
        interestTags: ['literature', 'current_events'],
      },
      {
        id: 'act_puzzles',
        text: 'Working on puzzles, crosswords, or brain teasers',
        dimensionWeights: { logical: 18, spatial: 8 },
        interestTags: ['puzzles'],
      },
      {
        id: 'act_nature',
        text: 'Walking outdoors or spending time in nature',
        dimensionWeights: { spatial: 15, memory: 8 },
        interestTags: ['nature'],
      },
      {
        id: 'act_music',
        text: 'Listening to or playing music',
        dimensionWeights: { memory: 15, spatial: 8 },
        interestTags: ['music'],
      },
      {
        id: 'act_cooking',
        text: 'Cooking, baking, or trying new recipes',
        dimensionWeights: { logical: 12, memory: 10 },
        interestTags: ['cooking'],
      },
      {
        id: 'act_history',
        text: 'Watching documentaries or learning about history',
        dimensionWeights: { verbal: 12, memory: 12 },
        interestTags: ['history', 'science'],
      },
    ],
  },
  {
    id: 'q_learning',
    text: 'How do you learn and think best?',
    subtitle: 'Rank these from most like you to least like you.',
    type: 'ranking',
    minRanks: 3,
    answers: [
      {
        id: 'learn_steps',
        text: 'Breaking things into clear, logical steps',
        dimensionWeights: { logical: 22, verbal: 5 },
        interestTags: [],
      },
      {
        id: 'learn_stories',
        text: 'Through stories, examples, and real-life connections',
        dimensionWeights: { verbal: 20, memory: 8 },
        interestTags: ['literature'],
      },
      {
        id: 'learn_visual',
        text: 'Visualizing pictures, maps, or diagrams in my mind',
        dimensionWeights: { spatial: 22, logical: 5 },
        interestTags: [],
      },
      {
        id: 'learn_memory',
        text: 'Connecting new things to things I already remember',
        dimensionWeights: { memory: 22, verbal: 5 },
        interestTags: [],
      },
      {
        id: 'learn_talking',
        text: 'Talking it through or discussing with others',
        dimensionWeights: { verbal: 18, memory: 8 },
        interestTags: ['current_events'],
      },
    ],
  },
  {
    id: 'q_topics',
    text: 'Which topics interest you most?',
    subtitle: 'Tap your most interesting topic first, then work your way down.',
    type: 'ranking',
    minRanks: 3,
    answers: [
      {
        id: 'topic_history',
        text: 'History, world events, and famous people',
        dimensionWeights: { verbal: 12, memory: 14 },
        interestTags: ['history', 'current_events'],
      },
      {
        id: 'topic_science',
        text: 'Science, nature, and how things work',
        dimensionWeights: { logical: 14, spatial: 8 },
        interestTags: ['science', 'nature'],
      },
      {
        id: 'topic_words',
        text: 'Words, language, literature, and stories',
        dimensionWeights: { verbal: 20 },
        interestTags: ['literature'],
      },
      {
        id: 'topic_numbers',
        text: 'Numbers, math, and patterns',
        dimensionWeights: { logical: 20 },
        interestTags: ['puzzles'],
      },
      {
        id: 'topic_arts',
        text: 'Arts, music, and cultural traditions',
        dimensionWeights: { spatial: 12, memory: 10 },
        interestTags: ['music'],
      },
      {
        id: 'topic_food',
        text: 'Food, cooking, and travel',
        dimensionWeights: { memory: 12, verbal: 8 },
        interestTags: ['cooking', 'travel'],
      },
    ],
  },
  {
    id: 'q_satisfaction',
    text: 'What makes a game feel satisfying to you?',
    subtitle: 'Rank what matters most to you when playing.',
    type: 'ranking',
    minRanks: 2,
    answers: [
      {
        id: 'sat_learning',
        text: 'Learning something new or interesting',
        dimensionWeights: { verbal: 12, memory: 10 },
        interestTags: [],
      },
      {
        id: 'sat_improving',
        text: 'Beating my previous score or improving',
        dimensionWeights: { logical: 14, memory: 8 },
        interestTags: [],
      },
      {
        id: 'sat_pattern',
        text: 'Figuring out a pattern or solving a tricky problem',
        dimensionWeights: { logical: 16, spatial: 8 },
        interestTags: ['puzzles'],
      },
      {
        id: 'sat_memory',
        text: 'Remembering details and getting them right',
        dimensionWeights: { memory: 18 },
        interestTags: [],
      },
      {
        id: 'sat_speed',
        text: 'Answering quickly and staying sharp',
        dimensionWeights: { logical: 10, verbal: 10 },
        interestTags: [],
      },
    ],
  },
  {
    id: 'q_challenge',
    text: 'How do you like to be challenged?',
    subtitle: 'Pick the option that sounds most like you.',
    type: 'scale',
    answers: [
      {
        id: 'ch_gentle',
        text: 'Gentle and comfortable — I like to feel confident',
        dimensionWeights: { memory: 8, verbal: 5 },
        interestTags: [],
      },
      {
        id: 'ch_moderate',
        text: 'A steady challenge — a little stretch is good',
        dimensionWeights: { verbal: 8, logical: 8, spatial: 8, memory: 8 },
        interestTags: [],
      },
      {
        id: 'ch_stimulating',
        text: 'Really stimulating — I want to work for it',
        dimensionWeights: { logical: 14, spatial: 10, verbal: 10, memory: 10 },
        interestTags: [],
      },
      {
        id: 'ch_surprise',
        text: 'Mix it up — keep me guessing',
        dimensionWeights: { logical: 10, spatial: 10 },
        interestTags: [],
      },
    ],
  },
];

// ===== Ranking Weight Multipliers =====
// Position in ranking → multiplier applied to dimensionWeights
const RANK_MULTIPLIERS = [1.0, 0.65, 0.35, 0.15, 0.08, 0.04];

// ===== Profile Calculator =====

export function calculateProfile(responses: SurveyResponse[]): {
  dimensions: CognitiveProfile;
  interests: InterestArea[];
  difficultyLevel: number;
} {
  const dimensions: CognitiveProfile = { verbal: 25, logical: 25, spatial: 25, memory: 25 };
  const interestCounts: Record<string, number> = {};
  let difficultySignal = 0;

  for (const response of responses) {
    const question = SURVEY_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) continue;

    if (question.type === 'ranking' && response.ranking && response.ranking.length > 0) {
      // Apply weighted contributions for each ranked item
      response.ranking.forEach((answerId, rankIndex) => {
        const answer = question.answers.find(a => a.id === answerId);
        if (!answer) return;

        const multiplier = RANK_MULTIPLIERS[rankIndex] ?? 0.03;

        for (const [dim, weight] of Object.entries(answer.dimensionWeights)) {
          dimensions[dim as keyof CognitiveProfile] += Math.round((weight as number) * multiplier);
        }

        // Interest tags weighted by rank
        const interestMultiplier = Math.max(0, 1 - rankIndex * 0.15);
        for (const tag of answer.interestTags) {
          interestCounts[tag] = (interestCounts[tag] || 0) + interestMultiplier;
        }
      });
    } else if (question.type === 'scale') {
      // Scale questions: full weight for single selected answer
      const answer = question.answers.find(a => a.id === response.answerId);
      if (!answer) continue;

      for (const [dim, weight] of Object.entries(answer.dimensionWeights)) {
        dimensions[dim as keyof CognitiveProfile] += weight as number;
      }

      for (const tag of answer.interestTags) {
        interestCounts[tag] = (interestCounts[tag] || 0) + 1;
      }

      // Difficulty signal from challenge question
      if (response.questionId === 'q_challenge') {
        if (response.answerId === 'ch_gentle')      difficultySignal -= 1;
        if (response.answerId === 'ch_moderate')    difficultySignal += 0;
        if (response.answerId === 'ch_stimulating') difficultySignal += 2;
        if (response.answerId === 'ch_surprise')    difficultySignal += 1;
      }
    }
  }

  // Normalize dimensions to 0-100
  const total = Object.values(dimensions).reduce((a, b) => a + b, 0);
  const scale = total > 0 ? 400 / total : 1; // normalize so they average to 100
  for (const dim of Object.keys(dimensions) as (keyof CognitiveProfile)[]) {
    dimensions[dim] = Math.min(100, Math.max(10, Math.round(dimensions[dim] * scale)));
  }

  // Top interests (weighted count, max 5)
  const interests = Object.entries(interestCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([interest]) => interest as InterestArea);

  if (interests.length === 0) {
    interests.push('history' as InterestArea);
  }

  // Difficulty level: base 2, adjust from signal
  const difficultyLevel = Math.max(1, Math.min(4, 2 + difficultySignal));

  return { dimensions, interests, difficultyLevel };
}
