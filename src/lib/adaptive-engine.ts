import {
  CognitiveProfile, GameConfig, GameType, InterestArea,
  RecommendedGame, DifficultyAdjustment, GameFeedback, GameSession
} from '@/types';
import { GAME_CONFIGS, ACTIVE_GAME_IDS } from './game-data';

const ACTIVE_GAME_CONFIGS = GAME_CONFIGS.filter(g => ACTIVE_GAME_IDS.includes(g.id as GameType));

// ===== Game Recommendation Engine =====

export function getRecommendedGames(
  dimensions: CognitiveProfile,
  interests: InterestArea[],
  recentSessions: GameSession[],
  currentDifficulty: number
): RecommendedGame[] {
  const recommendations: RecommendedGame[] = [];

  for (const config of ACTIVE_GAME_CONFIGS) {
    let matchScore = 0;

    // 1. Dimension match (40% weight)
    const primaryScore = dimensions[config.primaryDimension] || 50;
    const secondaryScore = config.secondaryDimension ? (dimensions[config.secondaryDimension] || 50) : 50;
    const dimensionMatch = (primaryScore * 0.7 + secondaryScore * 0.3);
    matchScore += dimensionMatch * 0.4;

    // 2. Enjoyment history (30% weight)
    const gameSessions = recentSessions.filter(s => s.gameType === config.id);
    if (gameSessions.length > 0) {
      const avgEnjoyment = gameSessions
        .filter(s => s.feedback?.enjoyment)
        .reduce((sum, s) => sum + (s.feedback!.enjoyment * 20), 0) /
        Math.max(1, gameSessions.filter(s => s.feedback?.enjoyment).length);
      matchScore += (avgEnjoyment || 50) * 0.3;

      // Bonus for "play again: yes"
      const playAgainYes = gameSessions.filter(s => s.feedback?.playAgain === 'yes').length;
      matchScore += (playAgainYes / gameSessions.length) * 10;
    } else {
      // New game bonus — encourage exploration
      matchScore += 55 * 0.3;
    }

    // 3. Variety bonus (15% weight) — boost games not played recently
    const lastPlayed = gameSessions[0];
    if (!lastPlayed) {
      matchScore += 80 * 0.15; // Never played = big variety bonus
    } else {
      const hoursSince = (Date.now() - new Date(lastPlayed.createdAt || '').getTime()) / (1000 * 60 * 60);
      const varietyScore = Math.min(100, hoursSince * 5);
      matchScore += varietyScore * 0.15;
    }

    // 4. Performance confidence (15% weight) — boost games where user does well
    if (gameSessions.length > 0) {
      const avgAccuracy = gameSessions.reduce((sum, s) => sum + s.accuracy, 0) / gameSessions.length;
      // Sweet spot around 70-80% accuracy
      const performanceScore = 100 - Math.abs(75 - avgAccuracy) * 2;
      matchScore += Math.max(0, performanceScore) * 0.15;
    } else {
      matchScore += 50 * 0.15;
    }

    // Determine difficulty for this game
    let gameDifficulty = currentDifficulty;
    if (gameSessions.length >= 3) {
      const recentAccuracy = gameSessions.slice(0, 3).reduce((sum, s) => sum + s.accuracy, 0) / 3;
      const adjustment = calculateDifficultyAdjustment(recentAccuracy, gameSessions.slice(0, 3));
      gameDifficulty = adjustment.newDifficulty;
    }

    // Generate reason
    let reason = '';
    if (gameSessions.length === 0) {
      reason = 'New game to try!';
    } else if (gameSessions.some(s => s.feedback?.enjoyment && s.feedback.enjoyment >= 4)) {
      reason = 'One of your favorites!';
    } else if (primaryScore >= 60) {
      reason = `Great for your ${config.primaryDimension} skills`;
    } else {
      reason = `Good practice for ${config.primaryDimension} thinking`;
    }

    recommendations.push({
      config,
      matchScore: Math.round(Math.min(99, Math.max(40, matchScore))),
      difficulty: Math.max(config.minDifficulty, Math.min(config.maxDifficulty, gameDifficulty)),
      reason,
    });
  }

  // Sort by match score descending
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

// ===== Difficulty Adjustment =====

export function calculateDifficultyAdjustment(
  recentAccuracy: number,
  recentSessions: GameSession[]
): DifficultyAdjustment {
  const currentDifficulty = recentSessions[0]?.difficulty || 2;

  // Check feedback signals
  const recentFeedback = recentSessions
    .filter(s => s.feedback?.difficulty)
    .map(s => s.feedback!.difficulty);

  let adjustment = 0;
  let reason = '';

  // Accuracy-based adjustment
  if (recentAccuracy > 85) {
    adjustment += 1;
    reason = 'You\'re doing great — let\'s try something a bit more challenging!';
  } else if (recentAccuracy > 70) {
    reason = 'You\'re in the sweet spot — keep it up!';
  } else if (recentAccuracy < 45) {
    adjustment -= 1;
    reason = 'Let\'s make this a bit more comfortable for you.';
  } else if (recentAccuracy < 60) {
    reason = 'Good effort! Keep practicing and you\'ll improve.';
  }

  // Feedback override
  if (recentFeedback.length > 0) {
    const tooEasyCount = recentFeedback.filter(f => f === 'too_easy').length;
    const tooHardCount = recentFeedback.filter(f => f === 'too_hard').length;

    if (tooEasyCount >= 2) {
      adjustment = Math.max(adjustment, 1);
      reason = 'Stepping up the challenge since you found it too easy!';
    } else if (tooHardCount >= 2) {
      adjustment = Math.min(adjustment, -1);
      reason = 'Making it a bit easier since the last few were tough.';
    }
  }

  const newDifficulty = Math.max(1, Math.min(5, currentDifficulty + adjustment));

  return { newDifficulty, reason: reason || 'Keeping things at your current level.' };
}

// ===== Dimension Score Updates =====

export function updateDimensionScores(
  currentDimensions: CognitiveProfile,
  gameType: GameType,
  accuracy: number
): CognitiveProfile {
  const config = GAME_CONFIGS.find(g => g.id === gameType);
  if (!config) return currentDimensions;

  const updated = { ...currentDimensions };

  // Small adjustments based on performance
  const primaryAdjust = (accuracy - 50) * 0.1; // -5 to +5
  const secondaryAdjust = config.secondaryDimension ? (accuracy - 50) * 0.05 : 0;

  updated[config.primaryDimension] = Math.max(10, Math.min(100,
    Math.round(updated[config.primaryDimension] + primaryAdjust)
  ));

  if (config.secondaryDimension) {
    updated[config.secondaryDimension] = Math.max(10, Math.min(100,
      Math.round(updated[config.secondaryDimension] + secondaryAdjust)
    ));
  }

  return updated;
}

// ===== Encouragement Messages =====

export function getEncouragementMessage(accuracy: number, gameType: GameType): string {
  if (accuracy >= 90) {
    const messages = [
      "Outstanding — your mind is truly sharp today.",
      "Wonderful work! That was a brilliant performance.",
      "Exceptional! You should feel very proud of that score.",
      "Superb effort — you made that look easy.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  if (accuracy >= 70) {
    const messages = [
      'Great job! You\'re doing really well!',
      'Very nice! Keep up the wonderful work!',
      'Well done! That\'s a solid performance!',
      'Good going! You\'re getting better all the time!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  if (accuracy >= 50) {
    const messages = [
      'Good effort! Every game makes you stronger!',
      'Nice try! You\'re exercising your brain well!',
      'Keep it up! Practice makes progress!',
      'That\'s the spirit! Each round is a step forward!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  const messages = [
    'Don\'t worry — the important thing is that you tried!',
    'Everyone has tough rounds. You\'ll do better next time!',
    'Keep going! Your brain is getting a great workout!',
    'That\'s okay! Learning happens when things are challenging.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// ===== Greeting =====

export function getTimeGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}!`;
  if (hour < 17) return `Good afternoon, ${name}!`;
  return `Good evening, ${name}!`;
}
