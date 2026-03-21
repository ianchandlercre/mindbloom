import { CognitiveProfile, InterestArea, RankingSurveyQuestion } from '@/types';

// ===== Ranking Survey Questions =====

export const RANKING_SURVEY_QUESTIONS: RankingSurveyQuestion[] = [
  {
    id: 'topics',
    type: 'ranking',
    text: 'What topics fascinate you most?',
    subtitle: 'Tap to rank from your favorite to least favorite. You can rank as many as you like.',
    minRank: 3,
    items: [
      { id: 'history', label: 'History' },
      { id: 'nature', label: 'Nature' },
      { id: 'music', label: 'Music' },
      { id: 'sports', label: 'Sports' },
      { id: 'science', label: 'Science' },
      { id: 'travel', label: 'Travel' },
      { id: 'art', label: 'Art' },
      { id: 'cooking', label: 'Cooking' },
      { id: 'animals', label: 'Animals' },
      { id: 'current_events', label: 'Current Events' },
    ],
  },
  {
    id: 'challenges',
    type: 'ranking',
    text: 'What kind of challenge do you enjoy?',
    subtitle: 'Tap to rank — your top choice first.',
    minRank: 2,
    items: [
      { id: 'word_puzzles', label: 'Word Puzzles' },
      { id: 'number_games', label: 'Number Games' },
      { id: 'memory_tests', label: 'Memory Tests' },
      { id: 'visual_patterns', label: 'Visual Patterns' },
      { id: 'trivia', label: 'Trivia' },
      { id: 'logic_problems', label: 'Logic Problems' },
    ],
  },
  {
    id: 'learning',
    type: 'ranking',
    text: 'How do you like to learn?',
    subtitle: 'Tap to rank your preferred learning styles.',
    minRank: 2,
    items: [
      { id: 'reading', label: 'Reading' },
      { id: 'watching', label: 'Watching' },
      { id: 'doing', label: 'Doing / Hands-on' },
      { id: 'discussing', label: 'Discussing' },
    ],
  },
  {
    id: 'era',
    type: 'ranking',
    text: 'What era speaks to you?',
    subtitle: 'Tap to rank the decades that feel most meaningful to you.',
    minRank: 1,
    items: [
      { id: '1940s_50s', label: '1940s – 1950s' },
      { id: '1960s_70s', label: '1960s – 1970s' },
      { id: '1980s_90s', label: '1980s – 1990s' },
      { id: 'modern', label: 'Modern Day' },
    ],
  },
  {
    id: 'session_length',
    type: 'single-choice',
    text: 'How long do you like to practice?',
    subtitle: 'We will pace your sessions accordingly.',
    items: [
      { id: 'quick', label: 'Quick — about 5 minutes' },
      { id: 'medium', label: 'Medium — about 10 minutes' },
      { id: 'extended', label: 'Extended — about 20 minutes' },
    ],
  },
  {
    id: 'difficulty',
    type: 'single-choice',
    text: 'How would you like to start?',
    subtitle: 'You can always adjust this later.',
    items: [
      { id: 'gentle', label: 'Gentle start — ease me in' },
      { id: 'jump_right_in', label: 'Jump right in — comfortable challenge' },
      { id: 'challenge_me', label: 'Challenge me — I want a workout' },
    ],
  },
];

// ===== Interest Mapping =====

const TOPIC_TO_INTEREST: Record<string, InterestArea> = {
  history: 'history',
  nature: 'nature',
  music: 'music',
  sports: 'sports',
  science: 'science',
  travel: 'travel',
  art: 'literature',
  cooking: 'cooking',
  animals: 'nature',
  current_events: 'current_events',
};

// ===== Challenge to Dimension Weights =====

const CHALLENGE_TO_WEIGHTS: Record<string, Partial<CognitiveProfile>> = {
  word_puzzles: { verbal: 30 },
  number_games: { logical: 30 },
  memory_tests: { memory: 30 },
  visual_patterns: { spatial: 30 },
  trivia: { memory: 20, verbal: 10 },
  logic_problems: { logical: 20, spatial: 10 },
};

// ===== Era Mapping =====

const ERA_LABELS: Record<string, string> = {
  '1940s_50s': '1940s–1950s',
  '1960s_70s': '1960s–1970s',
  '1980s_90s': '1980s–1990s',
  'modern': 'Modern Day',
};

// ===== Profile Calculator =====

export function calculateProfile(responses: { questionId: string; answerId: string }[]): {
  dimensions: CognitiveProfile;
  interests: InterestArea[];
  difficultyLevel: number;
  preferredEra?: string;
  sessionLength?: string;
} {
  const dimensions: CognitiveProfile = { verbal: 30, logical: 30, spatial: 30, memory: 30 };
  const interestMap: Map<InterestArea, number> = new Map();

  let difficultyLevel = 2;
  let preferredEra: string | undefined;
  let sessionLength = 'medium';

  // Handle both old-format (q1, q2...) and new ranking-format
  const hasNewFormat = responses.some(r =>
    ['topics', 'challenges', 'learning', 'era', 'session_length', 'difficulty'].includes(r.questionId)
  );

  if (hasNewFormat) {
    // New ranking-based survey
    for (const response of responses) {
      const { questionId, answerId } = response;

      if (questionId === 'topics') {
        // answerId is a JSON array of ranked topic IDs
        let ranked: string[] = [];
        try { ranked = JSON.parse(answerId); } catch { continue; }
        ranked.forEach((topicId, idx) => {
          const interest = TOPIC_TO_INTEREST[topicId];
          if (interest) {
            // Higher weight for higher ranks (top = most weight)
            const weight = Math.max(5, 30 - idx * 5);
            interestMap.set(interest, (interestMap.get(interest) || 0) + weight);
          }
        });

      } else if (questionId === 'challenges') {
        let ranked: string[] = [];
        try { ranked = JSON.parse(answerId); } catch { continue; }
        ranked.forEach((challengeId, idx) => {
          const weights = CHALLENGE_TO_WEIGHTS[challengeId];
          if (weights) {
            const scale = Math.max(0.3, 1 - idx * 0.15);
            for (const [dim, w] of Object.entries(weights)) {
              dimensions[dim as keyof CognitiveProfile] += Math.round((w as number) * scale);
            }
          }
        });

      } else if (questionId === 'learning') {
        // Learning style — adds small dimension boosts
        let ranked: string[] = [];
        try { ranked = JSON.parse(answerId); } catch { continue; }
        if (ranked[0] === 'reading') dimensions.verbal += 15;
        else if (ranked[0] === 'doing') dimensions.logical += 15;
        else if (ranked[0] === 'watching') dimensions.spatial += 10;
        else if (ranked[0] === 'discussing') dimensions.verbal += 10;

      } else if (questionId === 'era') {
        let ranked: string[] = [];
        try { ranked = JSON.parse(answerId); } catch { continue; }
        if (ranked[0]) {
          preferredEra = ERA_LABELS[ranked[0]] || ranked[0];
        }

      } else if (questionId === 'session_length') {
        sessionLength = answerId;

      } else if (questionId === 'difficulty') {
        if (answerId === 'gentle') difficultyLevel = 1;
        else if (answerId === 'jump_right_in') difficultyLevel = 2;
        else if (answerId === 'challenge_me') difficultyLevel = 3;
      }
    }
  } else {
    // Legacy survey format (old multiple-choice questions q1-q12)
    calculateLegacyProfile(responses, dimensions, interestMap);
  }

  // Normalize dimensions to 0-100
  for (const dim of Object.keys(dimensions) as (keyof CognitiveProfile)[]) {
    dimensions[dim] = Math.min(100, Math.round(dimensions[dim]));
  }

  // Extract top interests (sorted by accumulated weight)
  const interests: InterestArea[] = Array.from(interestMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([interest]) => interest);

  if (interests.length === 0) {
    interests.push('history', 'nature');
  }

  return { dimensions, interests, difficultyLevel, preferredEra, sessionLength };
}

// ===== Legacy Survey Support =====

function calculateLegacyProfile(
  responses: { questionId: string; answerId: string }[],
  dimensions: CognitiveProfile,
  interestMap: Map<InterestArea, number>
) {
  const legacyWeights: Record<string, { dims: Partial<CognitiveProfile>; interests: InterestArea[] }> = {
    q1a: { dims: { verbal: 20, memory: 10 }, interests: ['literature'] },
    q1b: { dims: { logical: 20, spatial: 10 }, interests: ['puzzles'] },
    q1c: { dims: { spatial: 15, memory: 10 }, interests: ['nature'] },
    q1d: { dims: { logical: 10, memory: 15 }, interests: ['cooking'] },
    q2a: { dims: { verbal: 25 }, interests: ['literature'] },
    q2b: { dims: { logical: 25 }, interests: ['science'] },
    q2c: { dims: { memory: 20, verbal: 10 }, interests: ['history'] },
    q2d: { dims: { spatial: 20, memory: 10 }, interests: ['music', 'sports'] },
    q3a: { dims: { verbal: 20, spatial: 10 }, interests: [] },
    q3b: { dims: { spatial: 25 }, interests: ['travel'] },
    q3c: { dims: { logical: 20, verbal: 10 }, interests: [] },
    q3d: { dims: { memory: 25 }, interests: [] },
    q4a: { dims: { logical: 15, memory: 10 }, interests: ['science', 'history'] },
    q4b: { dims: { memory: 20, verbal: 10 }, interests: ['puzzles', 'current_events'] },
    q4c: { dims: { spatial: 15, logical: 10 }, interests: ['sports'] },
    q4d: { dims: { verbal: 15, memory: 10 }, interests: ['literature'] },
    q5a: { dims: { verbal: 15, logical: 10 }, interests: [] },
    q5b: { dims: { memory: 25 }, interests: [] },
    q5c: { dims: { spatial: 20, memory: 10 }, interests: [] },
    q5d: { dims: { logical: 10, memory: 5 }, interests: [] },
    q6a: { dims: { verbal: 25 }, interests: ['current_events'] },
    q6b: { dims: { logical: 15, memory: 15 }, interests: ['puzzles'] },
    q6c: { dims: { memory: 10, spatial: 10 }, interests: ['cooking'] },
    q6d: { dims: { spatial: 15, memory: 10 }, interests: ['music'] },
    q7a: { dims: { verbal: 10, memory: 15 }, interests: ['history', 'travel'] },
    q7b: { dims: { spatial: 20 }, interests: ['nature', 'travel'] },
    q7c: { dims: { spatial: 15, verbal: 10 }, interests: ['history', 'travel'] },
    q7d: { dims: { memory: 15, verbal: 10 }, interests: ['cooking', 'travel'] },
    q8a: { dims: { logical: 30 }, interests: ['science'] },
    q8b: { dims: { logical: 20 }, interests: [] },
    q8c: { dims: { logical: 10, verbal: 10 }, interests: [] },
    q8d: { dims: { verbal: 20, logical: 5 }, interests: ['literature'] },
    q9a: { dims: { logical: 25 }, interests: [] },
    q9b: { dims: { verbal: 20, memory: 5 }, interests: [] },
    q9c: { dims: { spatial: 25 }, interests: [] },
    q9d: { dims: { memory: 25 }, interests: [] },
    q10a: { dims: { verbal: 15, memory: 10 }, interests: ['current_events'] },
    q10b: { dims: { logical: 15, spatial: 10 }, interests: ['science', 'nature'] },
    q10c: { dims: { verbal: 20, memory: 10 }, interests: ['literature'] },
    q10d: { dims: { logical: 15, spatial: 10 }, interests: ['cooking', 'puzzles'] },
    q11a: { dims: { verbal: 25, memory: 5 }, interests: ['puzzles'] },
    q11b: { dims: { logical: 25, spatial: 5 }, interests: ['puzzles'] },
    q11c: { dims: { memory: 25, spatial: 5 }, interests: ['puzzles'] },
    q11d: { dims: { memory: 20, verbal: 10 }, interests: ['puzzles', 'current_events'] },
    q12a: { dims: { verbal: 10, logical: 10, spatial: 10, memory: 10 }, interests: [] },
    q12b: { dims: { verbal: 8, logical: 8, spatial: 8, memory: 8 }, interests: [] },
    q12c: { dims: { memory: 15, verbal: 5 }, interests: [] },
    q12d: { dims: { verbal: 5, logical: 5, spatial: 5, memory: 10 }, interests: [] },
  };

  for (const response of responses) {
    const entry = legacyWeights[response.answerId];
    if (!entry) continue;
    for (const [dim, weight] of Object.entries(entry.dims)) {
      dimensions[dim as keyof CognitiveProfile] += weight as number;
    }
    for (const tag of entry.interests) {
      interestMap.set(tag, (interestMap.get(tag) || 0) + 20);
    }
  }
}
