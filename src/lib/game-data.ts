import {
  GameConfig, GameType, WordScrambleRound, WordConnectionRound,
  PatternFinderRound, NumberCrunchRound, KnowledgeQuizRound,
  InterestArea
} from '@/types';

// ===== Game Configurations =====

export const GAME_CONFIGS: GameConfig[] = [
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    emoji: '',
    icon: 'BookOpen',
    description: 'Unscramble letters to form words. Each puzzle is themed around your interests — history, nature, cooking, and more.',
    shortDesc: 'Unscramble letters into words',
    primaryDimension: 'verbal',
    secondaryDimension: 'memory',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'word-connection',
    name: 'Word Connection',
    emoji: '',
    icon: 'Link2',
    description: 'Find the word that connects to the given clue. Strengthen your vocabulary and word associations.',
    shortDesc: 'Find the related word',
    primaryDimension: 'verbal',
    secondaryDimension: 'logical',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    emoji: '',
    icon: 'Grid3x3',
    description: 'Flip cards to find matching pairs. Themed card sets keep things fresh and fun.',
    shortDesc: 'Match pairs of cards',
    primaryDimension: 'memory',
    secondaryDimension: 'spatial',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'sequence-recall',
    name: 'Sequence Recall',
    emoji: '',
    icon: 'ListOrdered',
    description: 'Watch a sequence of colors light up, then repeat it from memory. The sequences grow longer as you improve.',
    shortDesc: 'Remember and repeat sequences',
    primaryDimension: 'memory',
    secondaryDimension: 'spatial',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'pattern-finder',
    name: 'Pattern Finder',
    emoji: '',
    icon: 'Puzzle',
    description: 'Spot the pattern in a sequence and choose what comes next. Great for logical thinking.',
    shortDesc: 'Complete the pattern',
    primaryDimension: 'logical',
    secondaryDimension: 'spatial',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'number-crunch',
    name: 'Number Crunch',
    emoji: '',
    icon: 'Calculator',
    description: 'Quick mental math challenges that adapt to your comfort level. No calculator needed!',
    shortDesc: 'Solve mental math puzzles',
    primaryDimension: 'logical',
    secondaryDimension: 'memory',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'knowledge-quiz',
    name: 'Knowledge Quiz',
    emoji: '',
    icon: 'HelpCircle',
    description: 'Trivia questions drawn from your favorite topics. Learn fun facts while exercising your memory.',
    shortDesc: 'Answer trivia questions',
    primaryDimension: 'memory',
    secondaryDimension: 'verbal',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
];

export function getGameConfig(gameType: GameType): GameConfig | undefined {
  return GAME_CONFIGS.find(g => g.id === gameType);
}

// ===== Word Scramble Data =====

const WORD_SCRAMBLE_POOLS: Record<string, { word: string; hint: string; category: string }[]> = {
  easy: [
    { word: 'GARDEN', hint: 'Where flowers grow', category: 'nature' },
    { word: 'BREAD', hint: 'Baked in an oven', category: 'cooking' },
    { word: 'RIVER', hint: 'Flowing water', category: 'nature' },
    { word: 'HOUSE', hint: 'Where you live', category: 'general' },
    { word: 'CHAIR', hint: 'You sit on it', category: 'general' },
    { word: 'OCEAN', hint: 'Very large body of water', category: 'nature' },
    { word: 'MUSIC', hint: 'What you hear at a concert', category: 'music' },
    { word: 'PIANO', hint: 'Musical instrument with keys', category: 'music' },
    { word: 'MAPLE', hint: 'Type of tree with sweet sap', category: 'nature' },
    { word: 'LUNCH', hint: 'Midday meal', category: 'cooking' },
    { word: 'TRAIN', hint: 'Rides on tracks', category: 'travel' },
    { word: 'STARS', hint: 'Twinkle in the night sky', category: 'science' },
    { word: 'BOOKS', hint: 'You read them', category: 'literature' },
    { word: 'SPORT', hint: 'Athletic competition', category: 'sports' },
    { word: 'EARTH', hint: 'Our planet', category: 'science' },
  ],
  medium: [
    { word: 'LIBRARY', hint: 'Building full of books', category: 'literature' },
    { word: 'COMPASS', hint: 'Shows direction', category: 'travel' },
    { word: 'ORCHARD', hint: 'Where fruit trees grow', category: 'nature' },
    { word: 'TRUMPET', hint: 'Brass instrument', category: 'music' },
    { word: 'HARVEST', hint: 'Gathering crops', category: 'nature' },
    { word: 'KITCHEN', hint: 'Room for cooking', category: 'cooking' },
    { word: 'STADIUM', hint: 'Where sports events happen', category: 'sports' },
    { word: 'PYRAMID', hint: 'Ancient Egyptian structure', category: 'history' },
    { word: 'VOLCANO', hint: 'Mountain that erupts', category: 'science' },
    { word: 'JOURNAL', hint: 'Daily written record', category: 'literature' },
    { word: 'CAPTAIN', hint: 'Leader of a ship or team', category: 'sports' },
    { word: 'MONARCH', hint: 'King or queen', category: 'history' },
    { word: 'GLACIER', hint: 'Slow-moving ice mass', category: 'nature' },
    { word: 'DESSERT', hint: 'Sweet course after dinner', category: 'cooking' },
    { word: 'POTTERY', hint: 'Clay craft', category: 'history' },
  ],
  hard: [
    { word: 'ASTRONOMY', hint: 'Study of celestial objects', category: 'science' },
    { word: 'ORCHESTRA', hint: 'Large musical ensemble', category: 'music' },
    { word: 'CONTINENT', hint: 'Large landmass', category: 'travel' },
    { word: 'CHOCOLATE', hint: 'Sweet treat from cacao', category: 'cooking' },
    { word: 'BIOGRAPHY', hint: 'Story of someone\'s life', category: 'literature' },
    { word: 'ALGORITHM', hint: 'Step-by-step procedure', category: 'science' },
    { word: 'DEMOCRACY', hint: 'Government by the people', category: 'history' },
    { word: 'MIGRATION', hint: 'Seasonal animal movement', category: 'nature' },
    { word: 'NARRATIVE', hint: 'A story or account', category: 'literature' },
    { word: 'PENINSULA', hint: 'Land surrounded by water on three sides', category: 'travel' },
  ],
};

function scrambleWord(word: string): string {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  const scrambled = letters.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
}

export function getWordScrambleRounds(difficulty: number, interests: InterestArea[], count = 8): WordScrambleRound[] {
  const pool = difficulty <= 2 ? WORD_SCRAMBLE_POOLS.easy :
               difficulty <= 4 ? WORD_SCRAMBLE_POOLS.medium :
               WORD_SCRAMBLE_POOLS.hard;

  // Prioritize words matching user interests
  const sorted = [...pool].sort((a, b) => {
    const aMatch = interests.includes(a.category as InterestArea) ? 1 : 0;
    const bMatch = interests.includes(b.category as InterestArea) ? 1 : 0;
    return bMatch - aMatch || Math.random() - 0.5;
  });

  return sorted.slice(0, count).map(item => ({
    word: item.word,
    scrambled: scrambleWord(item.word),
    hint: item.hint,
    category: item.category,
  }));
}

// ===== Word Connection Data =====

const WORD_CONNECTION_POOLS: Record<string, { prompt: string; options: string[]; correctIndex: number; category: string }[]> = {
  easy: [
    { prompt: 'Dog is to puppy as cat is to...', options: ['Kitten', 'Cub', 'Foal', 'Calf'], correctIndex: 0, category: 'nature' },
    { prompt: 'Hot is to cold as up is to...', options: ['Left', 'Down', 'Over', 'Away'], correctIndex: 1, category: 'general' },
    { prompt: 'Bread is to baker as book is to...', options: ['Teacher', 'Author', 'Reader', 'Student'], correctIndex: 1, category: 'literature' },
    { prompt: 'Sun is to day as moon is to...', options: ['Night', 'Star', 'Sky', 'Dark'], correctIndex: 0, category: 'science' },
    { prompt: 'Pen is to write as brush is to...', options: ['Clean', 'Draw', 'Paint', 'Sweep'], correctIndex: 2, category: 'general' },
    { prompt: 'Apple is to fruit as carrot is to...', options: ['Root', 'Vegetable', 'Orange', 'Food'], correctIndex: 1, category: 'cooking' },
    { prompt: 'Song is to singer as painting is to...', options: ['Canvas', 'Museum', 'Artist', 'Color'], correctIndex: 2, category: 'music' },
    { prompt: 'Fish is to swim as bird is to...', options: ['Nest', 'Fly', 'Sing', 'Perch'], correctIndex: 1, category: 'nature' },
    { prompt: 'Hammer is to nail as key is to...', options: ['Door', 'Lock', 'Open', 'Metal'], correctIndex: 1, category: 'general' },
    { prompt: 'Winter is to snow as spring is to...', options: ['Flowers', 'Heat', 'Leaves', 'Wind'], correctIndex: 0, category: 'nature' },
  ],
  medium: [
    { prompt: 'Telescope is to stars as microscope is to...', options: ['Cells', 'Labs', 'Glass', 'Light'], correctIndex: 0, category: 'science' },
    { prompt: 'Shakespeare is to playwright as Beethoven is to...', options: ['Pianist', 'Composer', 'Conductor', 'Musician'], correctIndex: 1, category: 'music' },
    { prompt: 'Egypt is to pyramid as France is to...', options: ['Croissant', 'Eiffel Tower', 'Beret', 'Wine'], correctIndex: 1, category: 'travel' },
    { prompt: 'Stethoscope is to doctor as gavel is to...', options: ['Lawyer', 'Judge', 'Police', 'Court'], correctIndex: 1, category: 'general' },
    { prompt: 'Marathon is to runner as regatta is to...', options: ['Horse', 'Sailor', 'Cyclist', 'Swimmer'], correctIndex: 1, category: 'sports' },
    { prompt: 'Peninsula is to land as archipelago is to...', options: ['Islands', 'Ocean', 'Mountains', 'River'], correctIndex: 0, category: 'travel' },
    { prompt: 'Broth is to soup as dough is to...', options: ['Flour', 'Bread', 'Oven', 'Yeast'], correctIndex: 1, category: 'cooking' },
    { prompt: 'Constitution is to law as atlas is to...', options: ['Maps', 'World', 'Globe', 'Travel'], correctIndex: 0, category: 'history' },
    { prompt: 'Flock is to birds as pack is to...', options: ['Dogs', 'Wolves', 'Cats', 'Bears'], correctIndex: 1, category: 'nature' },
    { prompt: 'Chapter is to book as act is to...', options: ['Stage', 'Play', 'Movie', 'Script'], correctIndex: 1, category: 'literature' },
  ],
  hard: [
    { prompt: 'Photosynthesis is to plants as respiration is to...', options: ['Oxygen', 'Animals', 'Lungs', 'Carbon'], correctIndex: 1, category: 'science' },
    { prompt: 'Renaissance is to Florence as Enlightenment is to...', options: ['London', 'Paris', 'Berlin', 'Vienna'], correctIndex: 1, category: 'history' },
    { prompt: 'Sonata is to classical as riff is to...', options: ['Jazz', 'Rock', 'Blues', 'Pop'], correctIndex: 1, category: 'music' },
    { prompt: 'Hypothesis is to experiment as thesis is to...', options: ['Paper', 'Dissertation', 'Theory', 'Proof'], correctIndex: 1, category: 'science' },
    { prompt: 'Odyssey is to Homer as Inferno is to...', options: ['Virgil', 'Dante', 'Ovid', 'Plato'], correctIndex: 1, category: 'literature' },
  ],
};

export function getWordConnectionRounds(difficulty: number, interests: InterestArea[], count = 8): WordConnectionRound[] {
  const pool = difficulty <= 2 ? WORD_CONNECTION_POOLS.easy :
               difficulty <= 4 ? WORD_CONNECTION_POOLS.medium :
               WORD_CONNECTION_POOLS.hard;

  const sorted = [...pool].sort((a, b) => {
    const aMatch = interests.includes(a.category as InterestArea) ? 1 : 0;
    const bMatch = interests.includes(b.category as InterestArea) ? 1 : 0;
    return bMatch - aMatch || Math.random() - 0.5;
  });

  return sorted.slice(0, count);
}

// ===== Memory Match Data =====

export const MEMORY_MATCH_THEMES: Record<string, { emoji: string; label: string }[]> = {
  nature: [
    { emoji: '🌻', label: 'Sunflower' }, { emoji: '🌲', label: 'Pine Tree' },
    { emoji: '🦋', label: 'Butterfly' }, { emoji: '🐦', label: 'Bird' },
    { emoji: '🌊', label: 'Wave' }, { emoji: '🍄', label: 'Mushroom' },
    { emoji: '🌈', label: 'Rainbow' }, { emoji: '🐿️', label: 'Squirrel' },
  ],
  cooking: [
    { emoji: '🍎', label: 'Apple' }, { emoji: '🥐', label: 'Croissant' },
    { emoji: '🧁', label: 'Cupcake' }, { emoji: '🍕', label: 'Pizza' },
    { emoji: '🥗', label: 'Salad' }, { emoji: '🍰', label: 'Cake' },
    { emoji: '🧀', label: 'Cheese' }, { emoji: '🍓', label: 'Strawberry' },
  ],
  music: [
    { emoji: '🎹', label: 'Piano' }, { emoji: '🎸', label: 'Guitar' },
    { emoji: '🎺', label: 'Trumpet' }, { emoji: '🥁', label: 'Drums' },
    { emoji: '🎻', label: 'Violin' }, { emoji: '🎷', label: 'Saxophone' },
    { emoji: '🎵', label: 'Note' }, { emoji: '🎶', label: 'Music' },
  ],
  travel: [
    { emoji: '✈️', label: 'Plane' }, { emoji: '🗽', label: 'Liberty' },
    { emoji: '🏔️', label: 'Mountain' }, { emoji: '🏖️', label: 'Beach' },
    { emoji: '🗼', label: 'Tower' }, { emoji: '🚂', label: 'Train' },
    { emoji: '⛵', label: 'Sailboat' }, { emoji: '🏰', label: 'Castle' },
  ],
  general: [
    { emoji: '⭐', label: 'Star' }, { emoji: '🌙', label: 'Moon' },
    { emoji: '☀️', label: 'Sun' }, { emoji: '❤️', label: 'Heart' },
    { emoji: '🎁', label: 'Gift' }, { emoji: '🔔', label: 'Bell' },
    { emoji: '🏠', label: 'House' }, { emoji: '📚', label: 'Books' },
  ],
};

export function getMemoryMatchCards(difficulty: number, interests: InterestArea[]): { emoji: string; label: string }[] {
  const themeKey = interests.find(i => MEMORY_MATCH_THEMES[i]) || 'general';
  const theme = MEMORY_MATCH_THEMES[themeKey] || MEMORY_MATCH_THEMES.general;
  const pairCount = difficulty <= 2 ? 4 : difficulty <= 4 ? 6 : 8;
  return theme.slice(0, pairCount);
}

// ===== Pattern Finder Data =====

export function getPatternFinderRounds(difficulty: number, count = 8): PatternFinderRound[] {
  const generators: (() => PatternFinderRound)[] = [
    // Add 2
    () => {
      const start = Math.floor(Math.random() * 10) + 1;
      const step = difficulty <= 2 ? 2 : difficulty <= 4 ? 3 : 5;
      const seq = Array.from({ length: 4 }, (_, i) => start + step * i);
      const correct = start + step * 4;
      const opts = [correct, correct + 1, correct - 1, correct + step].filter((v, i, a) => a.indexOf(v) === i);
      while (opts.length < 4) opts.push(correct + opts.length + 2);
      const shuffled = opts.sort(() => Math.random() - 0.5);
      return { sequence: [...seq, '?'], options: shuffled, correctIndex: shuffled.indexOf(correct), rule: `Add ${step} each time` };
    },
    // Multiply
    () => {
      const start = difficulty <= 2 ? 2 : 3;
      const mult = 2;
      const seq = Array.from({ length: 4 }, (_, i) => start * Math.pow(mult, i));
      const correct = start * Math.pow(mult, 4);
      const opts = [correct, correct + 2, correct - 2, correct * 2].filter((v, i, a) => a.indexOf(v) === i);
      while (opts.length < 4) opts.push(correct + opts.length + 1);
      const shuffled = opts.sort(() => Math.random() - 0.5);
      return { sequence: [...seq, '?'], options: shuffled, correctIndex: shuffled.indexOf(correct), rule: `Multiply by ${mult} each time` };
    },
    // Alternating add
    () => {
      const start = Math.floor(Math.random() * 5) + 1;
      const a = 2, b = 3;
      const seq = [start];
      for (let i = 1; i < 5; i++) seq.push(seq[i-1] + (i % 2 === 1 ? a : b));
      const correct = seq[4] + (5 % 2 === 1 ? a : b);
      const opts = [correct, correct + 1, correct - 1, correct + 2].filter((v, i, a) => a.indexOf(v) === i);
      while (opts.length < 4) opts.push(correct + opts.length + 3);
      const shuffled = opts.sort(() => Math.random() - 0.5);
      return { sequence: [...seq.slice(0, 5), '?'], options: shuffled, correctIndex: shuffled.indexOf(correct), rule: `Alternate adding ${a} and ${b}` };
    },
    // Subtract
    () => {
      const step = difficulty <= 2 ? 3 : 5;
      const start = 50 + Math.floor(Math.random() * 20);
      const seq = Array.from({ length: 4 }, (_, i) => start - step * i);
      const correct = start - step * 4;
      const opts = [correct, correct + 1, correct - 1, correct + step].filter((v, i, a) => a.indexOf(v) === i);
      while (opts.length < 4) opts.push(correct + opts.length + 2);
      const shuffled = opts.sort(() => Math.random() - 0.5);
      return { sequence: [...seq, '?'], options: shuffled, correctIndex: shuffled.indexOf(correct), rule: `Subtract ${step} each time` };
    },
  ];

  const rounds: PatternFinderRound[] = [];
  for (let i = 0; i < count; i++) {
    const gen = generators[i % generators.length];
    rounds.push(gen());
  }
  return rounds;
}

// ===== Number Crunch Data =====

export function getNumberCrunchRounds(difficulty: number, count = 8): NumberCrunchRound[] {
  const rounds: NumberCrunchRound[] = [];
  for (let i = 0; i < count; i++) {
    let a: number, b: number, op: string, answer: number;

    if (difficulty <= 2) {
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      if (Math.random() > 0.5) { op = '+'; answer = a + b; }
      else { op = '-'; if (a < b) [a, b] = [b, a]; answer = a - b; }
    } else if (difficulty <= 4) {
      if (Math.random() > 0.5) {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 30) + 5;
        if (Math.random() > 0.5) { op = '+'; answer = a + b; }
        else { op = '-'; if (a < b) [a, b] = [b, a]; answer = a - b; }
      } else {
        a = Math.floor(Math.random() * 12) + 2;
        b = Math.floor(Math.random() * 9) + 2;
        op = '×'; answer = a * b;
      }
    } else {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        a = Math.floor(Math.random() * 100) + 25;
        b = Math.floor(Math.random() * 50) + 15;
        op = '+'; answer = a + b;
      } else if (type === 1) {
        a = Math.floor(Math.random() * 12) + 3;
        b = Math.floor(Math.random() * 12) + 3;
        op = '×'; answer = a * b;
      } else {
        b = Math.floor(Math.random() * 10) + 2;
        answer = Math.floor(Math.random() * 12) + 2;
        a = b * answer;
        op = '÷';
      }
    }

    const expression = `${a} ${op} ${b}`;
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrong = answer + (offset === 0 ? 1 : offset);
      if (wrong !== answer && wrong >= 0) wrongAnswers.add(wrong);
    }

    const options = [answer, ...Array.from(wrongAnswers)];
    const shuffled = options.sort(() => Math.random() - 0.5);

    rounds.push({
      expression,
      answer,
      options: shuffled,
      correctIndex: shuffled.indexOf(answer),
    });
  }
  return rounds;
}

// ===== Knowledge Quiz Data =====

const QUIZ_POOLS: Record<string, { question: string; options: string[]; correctIndex: number; funFact: string }[]> = {
  history: [
    { question: 'Which ancient wonder was located in Egypt?', options: ['Colossus of Rhodes', 'Great Pyramid of Giza', 'Hanging Gardens', 'Lighthouse of Alexandria'], correctIndex: 1, funFact: 'The Great Pyramid is the oldest of the Seven Wonders and the only one still standing!' },
    { question: 'Who was the first president of the United States?', options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'], correctIndex: 2, funFact: 'Washington was unanimously elected — the only president to receive every electoral vote.' },
    { question: 'The Renaissance began in which country?', options: ['France', 'England', 'Italy', 'Spain'], correctIndex: 2, funFact: 'Florence is often called the birthplace of the Renaissance, starting in the 14th century.' },
    { question: 'Which war ended in 1945?', options: ['World War I', 'World War II', 'Korean War', 'Vietnam War'], correctIndex: 1, funFact: 'WWII ended with ceremonies in both Europe (May) and the Pacific (September) in 1945.' },
    { question: 'Who wrote the Declaration of Independence?', options: ['George Washington', 'Benjamin Franklin', 'Thomas Jefferson', 'John Adams'], correctIndex: 2, funFact: 'Jefferson drafted it in just 17 days at age 33.' },
  ],
  science: [
    { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, funFact: 'Mars appears red because of iron oxide (rust) on its surface.' },
    { question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], correctIndex: 2, funFact: 'Diamonds are formed under extreme pressure deep within the Earth.' },
    { question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '256'], correctIndex: 1, funFact: 'Babies are born with about 270 bones, but many fuse together as they grow!' },
    { question: 'What is the speed of light?', options: ['186,000 mi/s', '200,000 mi/s', '150,000 mi/s', '175,000 mi/s'], correctIndex: 0, funFact: 'Light from the Sun takes about 8 minutes to reach Earth.' },
    { question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2, funFact: 'Plants convert CO2 into oxygen through photosynthesis — they are our planet\'s air purifiers!' },
  ],
  nature: [
    { question: 'What is the tallest type of tree?', options: ['Oak', 'Redwood', 'Pine', 'Maple'], correctIndex: 1, funFact: 'The tallest known redwood, Hyperion, stands over 380 feet tall!' },
    { question: 'Which animal can sleep for up to 3 years?', options: ['Bear', 'Snail', 'Bat', 'Sloth'], correctIndex: 1, funFact: 'Snails can enter a deep sleep during unfavorable weather conditions.' },
    { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctIndex: 2, funFact: 'The Pacific Ocean is larger than all of Earth\'s land area combined!' },
    { question: 'How many hearts does an octopus have?', options: ['One', 'Two', 'Three', 'Four'], correctIndex: 2, funFact: 'Two hearts pump blood to the gills, and one pumps it to the rest of the body.' },
    { question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Horse', 'Antelope'], correctIndex: 1, funFact: 'Cheetahs can reach speeds of 70 mph, but only for short bursts.' },
  ],
  music: [
    { question: 'How many keys does a standard piano have?', options: ['76', '82', '88', '92'], correctIndex: 2, funFact: 'The piano has 52 white keys and 36 black keys.' },
    { question: 'Who composed "The Four Seasons"?', options: ['Mozart', 'Vivaldi', 'Bach', 'Handel'], correctIndex: 1, funFact: 'Vivaldi composed it around 1723 — it\'s one of the most popular pieces of classical music ever.' },
    { question: 'What instrument has the most strings in an orchestra?', options: ['Violin', 'Cello', 'Harp', 'Guitar'], correctIndex: 2, funFact: 'A concert harp typically has 47 strings!' },
    { question: 'What musical term means "gradually getting louder"?', options: ['Diminuendo', 'Crescendo', 'Staccato', 'Legato'], correctIndex: 1, funFact: 'Crescendo comes from the Italian word "crescere" meaning "to grow."' },
    { question: 'Which decade saw the birth of rock and roll?', options: ['1940s', '1950s', '1960s', '1970s'], correctIndex: 1, funFact: 'Artists like Elvis Presley and Chuck Berry helped define the genre in the 1950s.' },
  ],
  sports: [
    { question: 'How many players are on a baseball team?', options: ['7', '9', '11', '13'], correctIndex: 1, funFact: 'Baseball has been played professionally in America since 1869.' },
    { question: 'In which sport is a "birdie" a term?', options: ['Tennis', 'Golf', 'Badminton', 'Both B and C'], correctIndex: 3, funFact: 'In golf a birdie means one under par, while in badminton it\'s another name for the shuttlecock.' },
    { question: 'How long is a marathon race?', options: ['20 miles', '24 miles', '26.2 miles', '30 miles'], correctIndex: 2, funFact: 'The distance was standardized at the 1908 London Olympics.' },
    { question: 'Which country invented the game of cricket?', options: ['Australia', 'India', 'England', 'South Africa'], correctIndex: 2, funFact: 'Cricket dates back to the 16th century in England.' },
    { question: 'What sport uses the term "love" for zero?', options: ['Badminton', 'Tennis', 'Squash', 'Table Tennis'], correctIndex: 1, funFact: 'The term may come from the French "l\'oeuf" meaning egg, shaped like a zero.' },
  ],
  cooking: [
    { question: 'What is the main ingredient in guacamole?', options: ['Tomato', 'Avocado', 'Onion', 'Lime'], correctIndex: 1, funFact: 'The Aztecs first made guacamole in the 16th century.' },
    { question: 'What temperature does water boil at sea level?', options: ['180°F', '200°F', '212°F', '220°F'], correctIndex: 2, funFact: 'At higher altitudes, water boils at a lower temperature!' },
    { question: 'Which spice is the most expensive by weight?', options: ['Vanilla', 'Saffron', 'Cinnamon', 'Cardamom'], correctIndex: 1, funFact: 'Saffron is made from crocus flower stigmas — each flower produces only three strands.' },
    { question: 'What is the Italian word for "to the tooth" in cooking?', options: ['Alfredo', 'Al dente', 'Antipasto', 'Aglio'], correctIndex: 1, funFact: 'Al dente pasta should be firm when bitten — not soft or crunchy.' },
    { question: 'Which fruit is used to make traditional marmalade?', options: ['Strawberry', 'Apple', 'Orange', 'Grape'], correctIndex: 2, funFact: 'Seville oranges are the classic choice for marmalade.' },
  ],
  general: [
    { question: 'What color do you get mixing blue and yellow?', options: ['Orange', 'Green', 'Purple', 'Brown'], correctIndex: 1, funFact: 'This is because blue and yellow are complementary primary colors.' },
    { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2, funFact: 'The seven continents together make up about 29% of Earth\'s surface.' },
    { question: 'What is the largest mammal on Earth?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], correctIndex: 1, funFact: 'Blue whales can grow up to 100 feet long and weigh as much as 200 tons.' },
    { question: 'Which language has the most native speakers?', options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'], correctIndex: 2, funFact: 'Over 900 million people speak Mandarin as their first language.' },
    { question: 'What year did humans first walk on the Moon?', options: ['1965', '1967', '1969', '1971'], correctIndex: 2, funFact: 'Neil Armstrong took the famous first step on July 20, 1969.' },
  ],
};

export function getKnowledgeQuizRounds(difficulty: number, interests: InterestArea[], count = 8): KnowledgeQuizRound[] {
  // Gather questions from interest areas and general
  let allQuestions: (KnowledgeQuizRound & { pool: string })[] = [];

  for (const interest of [...interests, 'general']) {
    const pool = QUIZ_POOLS[interest] || QUIZ_POOLS.general;
    allQuestions.push(...pool.map(q => ({ ...q, category: interest, pool: interest })));
  }

  // Shuffle and pick
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  const unique = shuffled.filter((q, i, arr) => arr.findIndex(x => x.question === q.question) === i);

  return unique.slice(0, count).map(q => ({
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    category: q.category,
    funFact: q.funFact,
  }));
}

// ===== Sequence Recall Data =====

export const SEQUENCE_COLORS = [
  { color: '#E74C3C', name: 'Red' },
  { color: '#4A90D9', name: 'Blue' },
  { color: '#7CB97D', name: 'Green' },
  { color: '#E8A849', name: 'Yellow' },
];

export function getSequenceLength(difficulty: number, round: number): number {
  const base = difficulty <= 2 ? 3 : difficulty <= 4 ? 4 : 5;
  return base + Math.floor(round / 3);
}
