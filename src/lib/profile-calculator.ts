import { CognitiveProfile, InterestArea, SurveyQuestion, SurveyResponse, RankingOption } from '@/types';

// ===== Ranking-Based Survey Questions =====

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q1',
    type: 'ranking',
    text: 'What draws your attention most?',
    subtitle: 'Rank these from most to least appealing to you',
    options: [
      { id: 'q1_nature', text: 'The natural world — forests, wildlife, starry skies', dimensionWeights: { spatial: 15, memory: 10 }, interestTags: ['nature'] },
      { id: 'q1_history', text: 'Stories from the past — how people and places shaped the world', dimensionWeights: { memory: 20, verbal: 10 }, interestTags: ['history'] },
      { id: 'q1_music', text: 'Music and rhythm — whether listening, playing, or remembering songs', dimensionWeights: { spatial: 15, memory: 10 }, interestTags: ['music'] },
      { id: 'q1_puzzles', text: 'Puzzles and problem-solving — figuring things out', dimensionWeights: { logical: 20, spatial: 10 }, interestTags: ['puzzles'] },
      { id: 'q1_stories', text: 'Reading and storytelling — books, articles, conversations', dimensionWeights: { verbal: 20, memory: 10 }, interestTags: ['literature'] },
      { id: 'q1_science', text: 'How things work — science, technology, discovery', dimensionWeights: { logical: 15, spatial: 10 }, interestTags: ['science'] },
    ],
    answers: [],
  },
  {
    id: 'q2',
    type: 'ranking',
    text: 'How do you prefer to learn new things?',
    subtitle: 'Rank these approaches from your favorite to least favorite',
    options: [
      { id: 'q2_visual', text: 'Seeing it — pictures, diagrams, videos', dimensionWeights: { spatial: 25 }, interestTags: [] },
      { id: 'q2_reading', text: 'Reading about it — articles, books, instructions', dimensionWeights: { verbal: 25 }, interestTags: ['literature'] },
      { id: 'q2_handson', text: 'Doing it — hands-on practice and trial', dimensionWeights: { logical: 15, spatial: 10 }, interestTags: ['puzzles'] },
      { id: 'q2_social', text: 'Talking about it — discussion and conversation', dimensionWeights: { verbal: 15, memory: 10 }, interestTags: ['current_events'] },
    ],
    answers: [],
  },
  {
    id: 'q3',
    type: 'ranking',
    text: 'Which activities bring you the most joy?',
    subtitle: 'Rank from most to least enjoyable',
    options: [
      { id: 'q3_cooking', text: 'Cooking or trying new recipes', dimensionWeights: { logical: 10, memory: 15 }, interestTags: ['cooking'] },
      { id: 'q3_travel', text: 'Exploring new places or remembering trips', dimensionWeights: { spatial: 15, memory: 10 }, interestTags: ['travel'] },
      { id: 'q3_games', text: 'Playing games — cards, board games, trivia', dimensionWeights: { logical: 15, memory: 10 }, interestTags: ['puzzles'] },
      { id: 'q3_sports', text: 'Watching or following sports', dimensionWeights: { spatial: 10, memory: 15 }, interestTags: ['sports'] },
      { id: 'q3_garden', text: 'Gardening or spending time outdoors', dimensionWeights: { spatial: 15, memory: 5 }, interestTags: ['nature'] },
    ],
    answers: [],
  },
  {
    id: 'q4',
    type: 'ranking',
    text: 'When it comes to brain challenges, what appeals to you?',
    subtitle: 'Rank these from most to least interesting',
    options: [
      { id: 'q4_words', text: 'Word games — crosswords, anagrams, vocabulary', dimensionWeights: { verbal: 25, memory: 5 }, interestTags: ['puzzles', 'literature'] },
      { id: 'q4_numbers', text: 'Number puzzles — math, Sudoku, patterns', dimensionWeights: { logical: 25, spatial: 5 }, interestTags: ['puzzles', 'science'] },
      { id: 'q4_memory', text: 'Memory challenges — recall, matching, sequences', dimensionWeights: { memory: 25, spatial: 5 }, interestTags: ['puzzles'] },
      { id: 'q4_trivia', text: 'Trivia and knowledge — facts, history, culture', dimensionWeights: { memory: 20, verbal: 10 }, interestTags: ['puzzles', 'current_events'] },
    ],
    answers: [],
  },
  {
    id: 'q5',
    type: 'scale',
    text: 'How much of a challenge do you enjoy?',
    subtitle: 'We will tailor the difficulty to match your preference',
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'Keep it gentle and relaxing',
    scaleMaxLabel: 'I like a real challenge',
    options: [],
    answers: [],
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

    if (question.type === 'ranking' && response.rankings && question.options) {
      // Ranking-based scoring: higher rank = more weight
      const totalOptions = question.options.length;
      for (let i = 0; i < response.rankings.length; i++) {
        const optionId = response.rankings[i];
        const option = question.options.find(o => o.id === optionId);
        if (!option) continue;

        // Weight: top rank gets full weight, bottom gets minimal
        const rankMultiplier = (totalOptions - i) / totalOptions;

        for (const [dim, weight] of Object.entries(option.dimensionWeights)) {
          dimensions[dim as keyof CognitiveProfile] += Math.round((weight as number) * rankMultiplier);
        }

        for (const tag of option.interestTags) {
          const interestWeight = Math.round((totalOptions - i) * 2);
          interestCounts[tag] = (interestCounts[tag] || 0) + interestWeight;
        }
      }
    } else if (question.type === 'scale' && response.scaleValue !== undefined) {
      difficultyLevel = Math.max(1, Math.min(5, response.scaleValue));
    } else if (response.answerId) {
      // Legacy single-choice fallback
      const answer = question.answers.find(a => a.id === response.answerId);
      if (!answer) continue;
      for (const [dim, weight] of Object.entries(answer.dimensionWeights)) {
        dimensions[dim as keyof CognitiveProfile] += weight as number;
      }
      for (const tag of answer.interestTags) {
        interestCounts[tag] = (interestCounts[tag] || 0) + 1;
      }
    }
  }

  // Normalize dimensions to 0-100
  const maxPossible = 120;
  for (const dim of Object.keys(dimensions) as (keyof CognitiveProfile)[]) {
    dimensions[dim] = Math.min(100, Math.round((dimensions[dim] / maxPossible) * 100));
  }

  // Top interests (at least some mentions, max 5)
  const interests = Object.entries(interestCounts)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([interest]) => interest as InterestArea);

  if (interests.length === 0) {
    interests.push('nature' as InterestArea);
  }

  return { dimensions, interests, difficultyLevel };
}
