import {
  GameConfig, GameType, WordScrambleRound, WordConnectionRound,
  PatternFinderRound, NumberCrunchRound, KnowledgeQuizRound,
  NumberFlowRound, EraQuizRound, PatternGardenRound,
  InterestArea
} from '@/types';

// ===== Game Configurations (new games, no emojis) =====

export const GAME_CONFIGS: GameConfig[] = [
  {
    id: 'story-detective',
    name: 'Story Detective',
    icon: 'Search',
    description: 'Read a short story and find the sentences that contain errors or inconsistencies. Stories are themed around your interests.',
    shortDesc: 'Find the errors hidden in a story',
    primaryDimension: 'verbal',
    secondaryDimension: 'memory',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'memory-journey',
    name: 'Memory Journey',
    icon: 'Map',
    description: 'Flip cards to find matching pairs. Themed around topics you love, with larger cards and fewer pairs to start.',
    shortDesc: 'Match pairs of interest-themed cards',
    primaryDimension: 'memory',
    secondaryDimension: 'spatial',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'word-weaver',
    name: 'Word Weaver',
    icon: 'Layers',
    description: 'Discover the hidden theme connecting groups of words. Like a puzzle where the connections reveal themselves.',
    shortDesc: 'Group words by their hidden connection',
    primaryDimension: 'verbal',
    secondaryDimension: 'logical',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'number-flow',
    name: 'Number Flow',
    icon: 'ShoppingBag',
    description: 'Solve real-world math scenarios drawn from everyday life — markets, recipes, travel, and more.',
    shortDesc: 'Real-world math scenarios',
    primaryDimension: 'logical',
    secondaryDimension: 'memory',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'era-quiz',
    name: 'Era Quiz',
    icon: 'Clock',
    description: 'Trivia tuned to the decades you know best. Deep, interesting questions about the eras you lived through.',
    shortDesc: 'Trivia from your favourite decades',
    primaryDimension: 'memory',
    secondaryDimension: 'verbal',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'pattern-garden',
    name: 'Pattern Garden',
    icon: 'Flower2',
    description: 'Complete number and letter sequences by finding the hidden rule. Each pattern is a small puzzle to solve.',
    shortDesc: 'Spot the pattern and complete the sequence',
    primaryDimension: 'logical',
    secondaryDimension: 'spatial',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'knowledge-quiz',
    name: 'Knowledge Quiz',
    icon: 'BookOpen',
    description: 'Trivia questions drawn from your favourite topics — history, nature, music, and more. Every question comes with a fun fact.',
    shortDesc: 'Trivia across your favourite topics',
    primaryDimension: 'memory',
    secondaryDimension: 'verbal',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    icon: 'Shuffle',
    description: 'Unscramble letters to form words. Themed around your interests.',
    shortDesc: 'Unscramble letters into words',
    primaryDimension: 'verbal',
    secondaryDimension: 'memory',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'word-connection',
    name: 'Word Connection',
    icon: 'Link2',
    description: 'Find the word that connects to the given clue. Strengthen your vocabulary and word associations.',
    shortDesc: 'Find the related word',
    primaryDimension: 'verbal',
    secondaryDimension: 'logical',
    minDifficulty: 1,
    maxDifficulty: 5,
  },
];

// Only show these on the dashboard (new games)
export const ACTIVE_GAME_IDS: GameType[] = [
  'story-detective',
  'memory-journey',
  'word-weaver',
  'number-flow',
  'era-quiz',
  'pattern-garden',
  'knowledge-quiz',
];

export function getGameConfig(gameType: GameType): GameConfig | undefined {
  return GAME_CONFIGS.find(g => g.id === gameType);
}

export function getActiveGameConfigs(): GameConfig[] {
  return ACTIVE_GAME_IDS.map(id => GAME_CONFIGS.find(g => g.id === id)!).filter(Boolean);
}

// ===== Story Detective Static Passages =====

export interface StoryPassage {
  passage: string;
  sentences: string[];
  errorIndices: number[];
  errors: Array<{ sentenceIndex: number; issue: string }>;
  theme: string;
}

export const STORY_PASSAGES: Record<string, StoryPassage[]> = {
  history: [
    {
      theme: 'history',
      passage: 'George Washington was the first president of the United States, taking office in 1789. He was born in Virginia in 1732 and served two terms as president. Washington was known for his leadership during the Revolutionary War, where he commanded the British forces to victory. After his presidency he returned to his estate at Monticello, where he lived until his death in 1799.',
      sentences: [
        'George Washington was the first president of the United States, taking office in 1789.',
        'He was born in Virginia in 1732 and served two terms as president.',
        'Washington was known for his leadership during the Revolutionary War, where he commanded the British forces to victory.',
        'After his presidency he returned to his estate at Monticello, where he lived until his death in 1799.',
      ],
      errorIndices: [2, 3],
      errors: [
        { sentenceIndex: 2, issue: 'Washington commanded the American (Continental) forces, not British forces.' },
        { sentenceIndex: 3, issue: "Washington's estate was Mount Vernon, not Monticello (which belonged to Jefferson)." },
      ],
    },
    {
      theme: 'history',
      passage: 'The ancient Egyptians built the pyramids as tombs for their pharaohs. The Great Pyramid of Giza was built around 2560 BC for Pharaoh Khufu. It stands about 481 feet tall and was the tallest man-made structure in the world for over 3,000 years. The pyramids were constructed using wooden tools and iron chisels by a workforce of thousands.',
      sentences: [
        'The ancient Egyptians built the pyramids as tombs for their pharaohs.',
        'The Great Pyramid of Giza was built around 2560 BC for Pharaoh Khufu.',
        'It stands about 481 feet tall and was the tallest man-made structure in the world for over 3,000 years.',
        'The pyramids were constructed using wooden tools and iron chisels by a workforce of thousands.',
      ],
      errorIndices: [3],
      errors: [
        { sentenceIndex: 3, issue: 'Iron was not widely used in ancient Egypt during pyramid construction — copper and stone tools were used instead.' },
      ],
    },
  ],
  nature: [
    {
      theme: 'nature',
      passage: 'The monarch butterfly undertakes one of the most remarkable migrations in the animal kingdom. Each autumn, millions of monarchs travel from Canada and the United States all the way to the forests of central Mexico. They navigate using the position of the sun and Earth\'s magnetic field. A single butterfly makes the full round trip each year, returning to the exact same tree its ancestors used.',
      sentences: [
        'The monarch butterfly undertakes one of the most remarkable migrations in the animal kingdom.',
        'Each autumn, millions of monarchs travel from Canada and the United States all the way to the forests of central Mexico.',
        "They navigate using the position of the sun and Earth's magnetic field.",
        'A single butterfly makes the full round trip each year, returning to the exact same tree its ancestors used.',
      ],
      errorIndices: [3],
      errors: [
        { sentenceIndex: 3, issue: 'No single monarch makes the full round trip — it takes multiple generations. The butterflies that return south are the great-grandchildren of those who flew north.' },
      ],
    },
  ],
  music: [
    {
      theme: 'music',
      passage: 'Ludwig van Beethoven composed some of the greatest music ever written, despite losing his hearing as he aged. He was born in Bonn, Germany in 1770 and moved to Vienna at age 21. His Ninth Symphony, one of his most celebrated works, was completed while he was completely deaf. He conducted its premiere in 1824 and reportedly turned around to see the audience applauding when he could not hear them.',
      sentences: [
        'Ludwig van Beethoven composed some of the greatest music ever written, despite losing his hearing as he aged.',
        'He was born in Bonn, Germany in 1770 and moved to Vienna at age 21.',
        'His Ninth Symphony, one of his most celebrated works, was completed while he was completely deaf.',
        'He conducted its premiere in 1824 and reportedly turned around to see the audience applauding when he could not hear them.',
      ],
      errorIndices: [1],
      errors: [
        { sentenceIndex: 1, issue: "Beethoven moved to Vienna at age 21 is slightly off — he moved there at age 21–22, which is close, but he was first sent to Vienna at age 16 to study with Mozart." },
      ],
    },
  ],
  general: [
    {
      theme: 'general',
      passage: 'The Eiffel Tower in Paris was completed in 1889 as the entrance arch for the World\'s Fair. It was designed by Gustave Eiffel and stands 330 meters tall. When it was first built, many Parisians thought it was ugly and called it an "iron monstrosity." The tower was originally intended to be permanent and has stood in Paris ever since.',
      sentences: [
        "The Eiffel Tower in Paris was completed in 1889 as the entrance arch for the World's Fair.",
        'It was designed by Gustave Eiffel and stands 330 meters tall.',
        'When it was first built, many Parisians thought it was ugly and called it an "iron monstrosity."',
        'The tower was originally intended to be permanent and has stood in Paris ever since.',
      ],
      errorIndices: [3],
      errors: [
        { sentenceIndex: 3, issue: 'The Eiffel Tower was originally intended to be temporary and demolished after 20 years — it was saved because it served as a useful radio transmission tower.' },
      ],
    },
  ],
};

// ===== Memory Journey Word Pairs =====

export const MEMORY_JOURNEY_THEMES: Record<string, { word: string; pair: string; category: string }[]> = {
  history: [
    { word: 'Pharaoh', pair: 'Egypt', category: 'history' },
    { word: 'Caesar', pair: 'Rome', category: 'history' },
    { word: 'Pyramid', pair: 'Giza', category: 'history' },
    { word: 'Colosseum', pair: 'Gladiator', category: 'history' },
    { word: 'Renaissance', pair: 'Florence', category: 'history' },
    { word: 'Columbus', pair: '1492', category: 'history' },
    { word: 'Liberty', pair: 'Independence', category: 'history' },
    { word: 'Churchill', pair: 'Britain', category: 'history' },
  ],
  nature: [
    { word: 'Redwood', pair: 'Tallest', category: 'nature' },
    { word: 'Pacific', pair: 'Ocean', category: 'nature' },
    { word: 'Monarch', pair: 'Butterfly', category: 'nature' },
    { word: 'Amazon', pair: 'Rainforest', category: 'nature' },
    { word: 'Sahara', pair: 'Desert', category: 'nature' },
    { word: 'Eagle', pair: 'Soaring', category: 'nature' },
    { word: 'Glacier', pair: 'Ice', category: 'nature' },
    { word: 'Coral', pair: 'Reef', category: 'nature' },
  ],
  music: [
    { word: 'Mozart', pair: 'Symphony', category: 'music' },
    { word: 'Piano', pair: '88 Keys', category: 'music' },
    { word: 'Jazz', pair: 'Improvise', category: 'music' },
    { word: 'Violin', pair: 'Strings', category: 'music' },
    { word: 'Opera', pair: 'Soprano', category: 'music' },
    { word: 'Beatles', pair: 'Liverpool', category: 'music' },
    { word: 'Trumpet', pair: 'Brass', category: 'music' },
    { word: 'Waltz', pair: 'Dance', category: 'music' },
  ],
  cooking: [
    { word: 'Saffron', pair: 'Spice', category: 'cooking' },
    { word: 'Sourdough', pair: 'Ferment', category: 'cooking' },
    { word: 'Truffle', pair: 'Luxury', category: 'cooking' },
    { word: 'Simmer', pair: 'Low Heat', category: 'cooking' },
    { word: 'Marinate', pair: 'Tenderize', category: 'cooking' },
    { word: 'Whisk', pair: 'Batter', category: 'cooking' },
    { word: 'Herbs', pair: 'Basil', category: 'cooking' },
    { word: 'Caramel', pair: 'Sugar', category: 'cooking' },
  ],
  travel: [
    { word: 'Eiffel', pair: 'Paris', category: 'travel' },
    { word: 'Colosseum', pair: 'Rome', category: 'travel' },
    { word: 'Fuji', pair: 'Japan', category: 'travel' },
    { word: 'Nile', pair: 'Egypt', category: 'travel' },
    { word: 'Fjord', pair: 'Norway', category: 'travel' },
    { word: 'Acropolis', pair: 'Athens', category: 'travel' },
    { word: 'Sahara', pair: 'Africa', category: 'travel' },
    { word: 'Canyon', pair: 'Arizona', category: 'travel' },
  ],
  general: [
    { word: 'Sun', pair: 'Star', category: 'general' },
    { word: 'Moon', pair: 'Orbit', category: 'general' },
    { word: 'Library', pair: 'Books', category: 'general' },
    { word: 'Clock', pair: 'Time', category: 'general' },
    { word: 'Garden', pair: 'Flowers', category: 'general' },
    { word: 'Letter', pair: 'Post', category: 'general' },
    { word: 'Bridge', pair: 'River', category: 'general' },
    { word: 'Compass', pair: 'North', category: 'general' },
  ],
};

export function getMemoryJourneyCards(difficulty: number, interests: InterestArea[]) {
  const themeKey = interests.find(i => MEMORY_JOURNEY_THEMES[i]) || 'general';
  const theme = MEMORY_JOURNEY_THEMES[themeKey as string] || MEMORY_JOURNEY_THEMES.general;
  const pairCount = difficulty <= 2 ? 4 : difficulty <= 4 ? 6 : 8;
  return theme.slice(0, pairCount);
}

// ===== Word Weaver Puzzles =====

export interface WordWeaverPuzzleData {
  words: string[];
  groups: Array<{ label: string; words: string[]; color: 'blue' | 'green' | 'amber' | 'rose' }>;
}

export const WORD_WEAVER_PUZZLES: WordWeaverPuzzleData[] = [
  {
    words: ['Oak', 'Pine', 'Maple', 'Elm', 'Hammer', 'Drill', 'Saw', 'Wrench', 'Red', 'Blue', 'Green', 'Yellow'],
    groups: [
      { label: 'Types of Tree', words: ['Oak', 'Pine', 'Maple', 'Elm'], color: 'green' },
      { label: 'Workshop Tools', words: ['Hammer', 'Drill', 'Saw', 'Wrench'], color: 'amber' },
      { label: 'Primary Colours', words: ['Red', 'Blue', 'Green', 'Yellow'], color: 'blue' },
    ],
  },
  {
    words: ['Sonata', 'Waltz', 'Concerto', 'Fugue', 'Nile', 'Amazon', 'Thames', 'Seine', 'Hawk', 'Robin', 'Wren', 'Swift'],
    groups: [
      { label: 'Musical Forms', words: ['Sonata', 'Waltz', 'Concerto', 'Fugue'], color: 'blue' },
      { label: 'Famous Rivers', words: ['Nile', 'Amazon', 'Thames', 'Seine'], color: 'amber' },
      { label: 'British Birds', words: ['Hawk', 'Robin', 'Wren', 'Swift'], color: 'green' },
    ],
  },
  {
    words: ['Simmer', 'Braise', 'Roast', 'Poach', 'Rome', 'Athens', 'Cairo', 'Delhi', 'Jazz', 'Blues', 'Swing', 'Bebop'],
    groups: [
      { label: 'Cooking Methods', words: ['Simmer', 'Braise', 'Roast', 'Poach'], color: 'amber' },
      { label: 'Ancient Capitals', words: ['Rome', 'Athens', 'Cairo', 'Delhi'], color: 'blue' },
      { label: 'Music Styles', words: ['Jazz', 'Blues', 'Swing', 'Bebop'], color: 'rose' },
    ],
  },
  {
    words: ['Darwin', 'Newton', 'Curie', 'Einstein', 'Everest', 'McKinley', 'Kilimanjaro', 'Fuji', 'Lemon', 'Orange', 'Lime', 'Grapefruit'],
    groups: [
      { label: 'Famous Scientists', words: ['Darwin', 'Newton', 'Curie', 'Einstein'], color: 'blue' },
      { label: 'Mountain Peaks', words: ['Everest', 'McKinley', 'Kilimanjaro', 'Fuji'], color: 'green' },
      { label: 'Citrus Fruits', words: ['Lemon', 'Orange', 'Lime', 'Grapefruit'], color: 'amber' },
    ],
  },
  {
    words: ['Sphinx', 'Colosseum', 'Parthenon', 'Stonehenge', 'Salmon', 'Trout', 'Perch', 'Bass', 'March', 'Trot', 'Canter', 'Gallop'],
    groups: [
      { label: 'Ancient Wonders', words: ['Sphinx', 'Colosseum', 'Parthenon', 'Stonehenge'], color: 'amber' },
      { label: 'Freshwater Fish', words: ['Salmon', 'Trout', 'Perch', 'Bass'], color: 'blue' },
      { label: 'Horse Gaits', words: ['March', 'Trot', 'Canter', 'Gallop'], color: 'rose' },
    ],
  },
];

// ===== Number Flow Scenarios =====

export const NUMBER_FLOW_SCENARIOS: Record<number, NumberFlowRound[]> = {
  1: [ // Easy — single step
    { scenario: "You're at the bakery. A loaf of bread costs $4.", question: 'You buy 3 loaves. What is the total?', answer: 12, options: [10, 12, 14, 16], correctIndex: 1, unit: '$' },
    { scenario: 'You walk 2 miles to the park each day.', question: 'How far do you walk in 5 days?', answer: 10, options: [8, 9, 10, 12], correctIndex: 2, unit: 'miles' },
    { scenario: 'There are 24 flowers in the garden.', question: 'You give 8 to a friend. How many remain?', answer: 16, options: [14, 15, 16, 18], correctIndex: 2, unit: 'flowers' },
    { scenario: 'A recipe calls for 3 eggs per batch.', question: 'You make 4 batches. How many eggs do you need?', answer: 12, options: [10, 11, 12, 15], correctIndex: 2, unit: 'eggs' },
    { scenario: 'A book has 200 pages.', question: 'You read 45 pages. How many pages remain?', answer: 155, options: [145, 150, 155, 160], correctIndex: 2, unit: 'pages' },
  ],
  2: [ // Medium — two steps or decimals
    { scenario: "You're at the farmer's market. Apples cost $2.50 per pound.", question: 'You buy 4 pounds. What is the total?', answer: 10, options: [8, 9, 10, 12], correctIndex: 2, unit: '$' },
    { scenario: 'A garden bed is 6 feet long and 3 feet wide.', question: 'What is the area?', answer: 18, options: [16, 17, 18, 20], correctIndex: 2, unit: 'sq ft' },
    { scenario: "You're splitting a $45 restaurant bill between 3 people.", question: 'How much does each person owe?', answer: 15, options: [12, 13, 15, 18], correctIndex: 2, unit: '$' },
    { scenario: 'A train travels at 60 miles per hour.', question: 'How far does it travel in 2.5 hours?', answer: 150, options: [120, 130, 150, 160], correctIndex: 2, unit: 'miles' },
    { scenario: 'You have $80. You spend $23 on groceries and $15 on a book.', question: 'How much money do you have left?', answer: 42, options: [38, 40, 42, 45], correctIndex: 2, unit: '$' },
  ],
  3: [ // Harder
    { scenario: "At the farmer's market: apples are $3.50/lb, you buy 2.5 lbs. Honey is $8 a jar, you get 2 jars.", question: 'What is your total?', answer: 25, options: [22, 24, 25, 27], correctIndex: 2, unit: '$' },
    { scenario: 'A recipe serves 4 people and calls for 1.5 cups of flour.', question: 'How much flour do you need for 10 people?', answer: 4, options: [3, 3.5, 4, 4.5], correctIndex: 2, unit: 'cups' },
    { scenario: "You drove 180 miles and used 6 gallons of fuel.", question: 'How many miles per gallon did your car get?', answer: 30, options: [25, 28, 30, 35], correctIndex: 2, unit: 'mpg' },
    { scenario: 'A sweater was $75 and is now 20% off.', question: 'What is the sale price?', answer: 60, options: [55, 58, 60, 65], correctIndex: 2, unit: '$' },
    { scenario: 'You invest $1,000 at 5% interest per year.', question: 'How much interest do you earn in one year?', answer: 50, options: [40, 45, 50, 55], correctIndex: 2, unit: '$' },
  ],
};

export function getNumberFlowRounds(difficulty: number, _interests: InterestArea[], count = 6): NumberFlowRound[] {
  const level = difficulty <= 2 ? 1 : difficulty <= 4 ? 2 : 3;
  const pool = NUMBER_FLOW_SCENARIOS[level] || NUMBER_FLOW_SCENARIOS[1];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ===== Era Quiz Questions =====

const ERA_QUIZ_POOLS: Record<string, EraQuizRound[]> = {
  '1940s_1950s': [
    { question: 'Which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctIndex: 2, era: '1940s', funFact: 'WWII ended in Europe on May 8, 1945 (V-E Day) and in the Pacific on September 2, 1945 (V-J Day).', category: 'history' },
    { question: 'What was the name of the first transatlantic commercial jet service launched in 1958?', options: ['Pan Am', 'TWA', 'BOAC', 'American Airlines'], correctIndex: 2, era: '1950s', funFact: 'BOAC (British Overseas Airways Corporation) operated the first jet service across the Atlantic in October 1958.', category: 'travel' },
    { question: 'Which television show hosted by Ed Sullivan became famous in the 1950s?', options: ['The Tonight Show', 'Toast of the Town', 'What\'s My Line', 'I Love Lucy'], correctIndex: 1, era: '1950s', funFact: 'Toast of the Town (later renamed The Ed Sullivan Show) ran from 1948 to 1971 and featured Elvis Presley and the Beatles.', category: 'music' },
    { question: 'What major scientific discovery was made in 1953 by Watson and Crick?', options: ['Penicillin', 'The atom', 'DNA structure', 'The polio vaccine'], correctIndex: 2, era: '1950s', funFact: 'Watson and Crick built on Rosalind Franklin\'s X-ray crystallography work to discover the double helix structure of DNA.', category: 'science' },
    { question: 'What was the name of the first nuclear-powered submarine, launched in 1954?', options: ['USS Enterprise', 'USS Nautilus', 'USS Independence', 'USS Liberty'], correctIndex: 1, era: '1950s', funFact: 'The USS Nautilus was the world\'s first nuclear-powered vessel and crossed the North Pole under Arctic ice in 1958.', category: 'science' },
  ],
  '1960s_1970s': [
    { question: 'In what year did astronauts first walk on the Moon?', options: ['1967', '1968', '1969', '1970'], correctIndex: 2, era: '1960s', funFact: 'Neil Armstrong and Buzz Aldrin landed on July 20, 1969, while Michael Collins orbited above.', category: 'science' },
    { question: 'Which British band appeared on The Ed Sullivan Show in February 1964?', options: ['The Rolling Stones', 'The Who', 'The Beatles', 'The Kinks'], correctIndex: 2, era: '1960s', funFact: 'The Beatles\' February 9, 1964 appearance drew 73 million viewers — one of the largest TV audiences in US history.', category: 'music' },
    { question: 'What was the name of the music festival held in New York state in August 1969?', options: ['Monterey Pop', 'Woodstock', 'Isle of Wight', 'Altamont'], correctIndex: 1, era: '1960s', funFact: 'Woodstock attracted over 400,000 people over three days, becoming a defining moment of the 1960s counterculture.', category: 'music' },
    { question: 'Which US president resigned in 1974 due to the Watergate scandal?', options: ['Lyndon Johnson', 'Gerald Ford', 'Richard Nixon', 'Jimmy Carter'], correctIndex: 2, era: '1970s', funFact: 'Nixon resigned on August 9, 1974, becoming the only US president to resign from office.', category: 'history' },
    { question: 'What major television event was the first "mini-series," aired in 1977?', options: ['Roots', 'Holocaust', 'Rich Man Poor Man', 'The Thorn Birds'], correctIndex: 0, era: '1970s', funFact: 'Roots, based on Alex Haley\'s novel about African American history, was watched by over 100 million people.', category: 'history' },
  ],
  '1980s_1990s': [
    { question: 'What game console was released by Nintendo in North America in 1985?', options: ['Atari 2600', 'Sega Genesis', 'Nintendo Entertainment System', 'Intellivision'], correctIndex: 2, era: '1980s', funFact: 'The NES revived the video game industry after the 1983 crash and featured classics like Super Mario Bros. and The Legend of Zelda.', category: 'science' },
    { question: 'In what year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correctIndex: 2, era: '1980s', funFact: 'The Berlin Wall fell on November 9, 1989, leading to German reunification on October 3, 1990.', category: 'history' },
    { question: 'Which movie won the Academy Award for Best Picture in 1994?', options: ['Schindler\'s List', 'Forrest Gump', 'The Shawshank Redemption', 'Pulp Fiction'], correctIndex: 1, era: '1990s', funFact: 'Forrest Gump won 6 Oscars in 1994, though Shawshank Redemption and Pulp Fiction are now considered classics of that era.', category: 'history' },
    { question: 'What technological invention became publicly available via the World Wide Web in 1991?', options: ['Email', 'The internet browser', 'The fax machine', 'Satellite TV'], correctIndex: 1, era: '1990s', funFact: 'Tim Berners-Lee invented the World Wide Web and the first web browser, changing communication forever.', category: 'science' },
    { question: 'Which space telescope was launched in 1990?', options: ['Voyager', 'Hubble', 'Chandra', 'Spitzer'], correctIndex: 1, era: '1990s', funFact: 'The Hubble Space Telescope has taken over 1.5 million observations and helped determine the age of the universe as 13.8 billion years.', category: 'science' },
  ],
  modern: [
    { question: 'In what year did the iPhone first go on sale?', options: ['2005', '2006', '2007', '2008'], correctIndex: 2, era: 'Modern', funFact: 'Steve Jobs introduced the first iPhone on January 9, 2007, calling it "an iPod, a phone, and an internet communicator."', category: 'science' },
    { question: 'What is the name of the world\'s tallest building, completed in 2010?', options: ['Shanghai Tower', 'One World Trade', 'Burj Khalifa', 'Taipei 101'], correctIndex: 2, era: 'Modern', funFact: 'The Burj Khalifa in Dubai stands 828 meters tall and has 163 floors.', category: 'travel' },
    { question: 'Which streaming service launched its original programming strategy with "House of Cards" in 2013?', options: ['Amazon Prime', 'Hulu', 'HBO', 'Netflix'], correctIndex: 3, era: 'Modern', funFact: 'Netflix\'s bet on original content changed television forever, and the company now spends billions on programming each year.', category: 'history' },
    { question: 'What planet did NASA\'s Perseverance rover land on in February 2021?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, era: 'Modern', funFact: 'Perseverance landed in Jezero Crater and has been searching for signs of ancient microbial life ever since.', category: 'science' },
    { question: 'Which artist became the first to stream over 1 billion songs on Spotify?', options: ['Taylor Swift', 'Ed Sheeran', 'Drake', 'Adele'], correctIndex: 2, era: 'Modern', funFact: 'Drake reached the milestone in 2015, underscoring the rise of streaming as the dominant way people listen to music.', category: 'music' },
  ],
  general: [
    { question: 'How many bones does the adult human body have?', options: ['186', '196', '206', '216'], correctIndex: 2, era: 'General', funFact: 'Babies are born with about 270 bones, but many fuse together during childhood and adolescence.', category: 'science' },
    { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctIndex: 2, era: 'General', funFact: 'The Pacific Ocean is larger than all the world\'s land area combined.', category: 'nature' },
    { question: 'Who painted the Mona Lisa?', options: ['Raphael', 'Michelangelo', 'Leonardo da Vinci', 'Botticelli'], correctIndex: 2, era: 'General', funFact: 'Leonardo is believed to have worked on the Mona Lisa from 1503 to 1519 and never parted with it during his lifetime.', category: 'history' },
    { question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctIndex: 1, era: 'General', funFact: 'Hexagons appear throughout nature — honeycombs use this shape because it is the most efficient way to divide space.', category: 'science' },
    { question: 'What is the capital city of Australia?', options: ['Sydney', 'Melbourne', 'Brisbane', 'Canberra'], correctIndex: 3, era: 'General', funFact: 'Canberra was chosen as a compromise between rivals Sydney and Melbourne and became the capital in 1913.', category: 'travel' },
  ],
};

export function getEraQuizRounds(
  difficulty: number,
  interests: InterestArea[],
  preferredEra?: string,
  count = 8
): EraQuizRound[] {
  // Map preferredEra to pool key
  let eraKey = 'general';
  if (preferredEra) {
    if (preferredEra.includes('1940') || preferredEra.includes('1950')) eraKey = '1940s_1950s';
    else if (preferredEra.includes('1960') || preferredEra.includes('1970')) eraKey = '1960s_1970s';
    else if (preferredEra.includes('1980') || preferredEra.includes('1990')) eraKey = '1980s_1990s';
    else if (preferredEra.includes('Modern') || preferredEra.includes('modern')) eraKey = 'modern';
  }

  const eraPool = ERA_QUIZ_POOLS[eraKey] || ERA_QUIZ_POOLS.general;
  const generalPool = ERA_QUIZ_POOLS.general;

  // Mix era-specific and general questions
  const combined = [...eraPool, ...generalPool].sort(() => Math.random() - 0.5);
  const unique = combined.filter((q, i, arr) => arr.findIndex(x => x.question === q.question) === i);
  return unique.slice(0, count);
}

// ===== Pattern Garden Data =====

export function getPatternGardenRounds(difficulty: number, count = 8): PatternGardenRound[] {
  const generators: (() => PatternGardenRound)[] = [
    () => {
      const step = difficulty <= 2 ? 2 : difficulty <= 4 ? 3 : 5;
      const start = Math.floor(Math.random() * 10) + 1;
      const seq = Array.from({ length: 4 }, (_, i) => start + step * i);
      const correct = start + step * 4;
      const opts = shuffle([correct, correct + 1, correct - 1, correct + step].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4));
      return { sequence: [...seq, '?'], options: opts, correctIndex: opts.indexOf(correct), rule: `Add ${step} each time`, theme: 'numbers' };
    },
    () => {
      const start = difficulty <= 2 ? 2 : 3;
      const seq = Array.from({ length: 4 }, (_, i) => start * Math.pow(2, i));
      const correct = start * Math.pow(2, 4);
      const opts = shuffle([correct, correct + 4, correct - 4, correct * 2].slice(0, 4));
      return { sequence: [...seq, '?'], options: opts, correctIndex: opts.indexOf(correct), rule: 'Double each time', theme: 'numbers' };
    },
    () => {
      const step = difficulty <= 2 ? 3 : 5;
      const start = 50 + Math.floor(Math.random() * 20);
      const seq = Array.from({ length: 4 }, (_, i) => start - step * i);
      const correct = start - step * 4;
      const opts = shuffle([correct, correct + 1, correct - 1, correct + step].slice(0, 4));
      return { sequence: [...seq, '?'], options: opts, correctIndex: opts.indexOf(correct), rule: `Subtract ${step} each time`, theme: 'numbers' };
    },
    () => {
      const a = 2, b = 3;
      const start = Math.floor(Math.random() * 5) + 1;
      const seq = [start];
      for (let i = 1; i < 5; i++) seq.push(seq[i-1] + (i % 2 === 1 ? a : b));
      const correct = seq[4] + (5 % 2 === 1 ? a : b);
      const opts = shuffle([correct, correct + 1, correct - 1, correct + 2].slice(0, 4));
      return { sequence: [...seq.slice(0, 5), '?'], options: opts, correctIndex: opts.indexOf(correct), rule: `Alternate adding ${a} and ${b}`, theme: 'numbers' };
    },
  ];

  return Array.from({ length: count }, (_, i) => generators[i % generators.length]());
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== Legacy Game Data (kept for backward compat) =====

const WORD_SCRAMBLE_POOLS: Record<string, { word: string; hint: string; category: string }[]> = {
  easy: [
    { word: 'GARDEN', hint: 'Where flowers grow', category: 'nature' },
    { word: 'BREAD', hint: 'Baked in an oven', category: 'cooking' },
    { word: 'RIVER', hint: 'Flowing water', category: 'nature' },
    { word: 'PIANO', hint: 'Musical instrument with keys', category: 'music' },
    { word: 'MAPLE', hint: 'Type of tree with sweet sap', category: 'nature' },
    { word: 'TRAIN', hint: 'Rides on tracks', category: 'travel' },
    { word: 'STARS', hint: 'Twinkle in the night sky', category: 'science' },
    { word: 'BOOKS', hint: 'You read them', category: 'literature' },
  ],
  medium: [
    { word: 'LIBRARY', hint: 'Building full of books', category: 'literature' },
    { word: 'COMPASS', hint: 'Shows direction', category: 'travel' },
    { word: 'ORCHARD', hint: 'Where fruit trees grow', category: 'nature' },
    { word: 'TRUMPET', hint: 'Brass instrument', category: 'music' },
    { word: 'HARVEST', hint: 'Gathering crops', category: 'nature' },
    { word: 'PYRAMID', hint: 'Ancient Egyptian structure', category: 'history' },
    { word: 'VOLCANO', hint: 'Mountain that erupts', category: 'science' },
    { word: 'MONARCH', hint: 'King or queen', category: 'history' },
  ],
  hard: [
    { word: 'ASTRONOMY', hint: 'Study of celestial objects', category: 'science' },
    { word: 'ORCHESTRA', hint: 'Large musical ensemble', category: 'music' },
    { word: 'CONTINENT', hint: 'Large landmass', category: 'travel' },
    { word: 'BIOGRAPHY', hint: 'Story of someone\'s life', category: 'literature' },
    { word: 'DEMOCRACY', hint: 'Government by the people', category: 'history' },
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

const WORD_CONNECTION_POOLS: Record<string, { prompt: string; options: string[]; correctIndex: number; category: string }[]> = {
  easy: [
    { prompt: 'Dog is to puppy as cat is to...', options: ['Kitten', 'Cub', 'Foal', 'Calf'], correctIndex: 0, category: 'nature' },
    { prompt: 'Hot is to cold as up is to...', options: ['Left', 'Down', 'Over', 'Away'], correctIndex: 1, category: 'general' },
    { prompt: 'Bread is to baker as book is to...', options: ['Teacher', 'Author', 'Reader', 'Student'], correctIndex: 1, category: 'literature' },
    { prompt: 'Sun is to day as moon is to...', options: ['Night', 'Star', 'Sky', 'Dark'], correctIndex: 0, category: 'science' },
    { prompt: 'Apple is to fruit as carrot is to...', options: ['Root', 'Vegetable', 'Orange', 'Food'], correctIndex: 1, category: 'cooking' },
    { prompt: 'Fish is to swim as bird is to...', options: ['Nest', 'Fly', 'Sing', 'Perch'], correctIndex: 1, category: 'nature' },
    { prompt: 'Winter is to snow as spring is to...', options: ['Flowers', 'Heat', 'Leaves', 'Wind'], correctIndex: 0, category: 'nature' },
    { prompt: 'Pen is to write as brush is to...', options: ['Clean', 'Draw', 'Paint', 'Sweep'], correctIndex: 2, category: 'general' },
  ],
  medium: [
    { prompt: 'Telescope is to stars as microscope is to...', options: ['Cells', 'Labs', 'Glass', 'Light'], correctIndex: 0, category: 'science' },
    { prompt: 'Shakespeare is to playwright as Beethoven is to...', options: ['Pianist', 'Composer', 'Conductor', 'Musician'], correctIndex: 1, category: 'music' },
    { prompt: 'Egypt is to pyramid as France is to...', options: ['Croissant', 'Eiffel Tower', 'Beret', 'Wine'], correctIndex: 1, category: 'travel' },
    { prompt: 'Marathon is to runner as regatta is to...', options: ['Horse', 'Sailor', 'Cyclist', 'Swimmer'], correctIndex: 1, category: 'sports' },
    { prompt: 'Broth is to soup as dough is to...', options: ['Flour', 'Bread', 'Oven', 'Yeast'], correctIndex: 1, category: 'cooking' },
    { prompt: 'Flock is to birds as pack is to...', options: ['Dogs', 'Wolves', 'Cats', 'Bears'], correctIndex: 1, category: 'nature' },
    { prompt: 'Chapter is to book as act is to...', options: ['Stage', 'Play', 'Movie', 'Script'], correctIndex: 1, category: 'literature' },
    { prompt: 'Peninsula is to land as archipelago is to...', options: ['Islands', 'Ocean', 'Mountains', 'River'], correctIndex: 0, category: 'travel' },
  ],
  hard: [
    { prompt: 'Photosynthesis is to plants as respiration is to...', options: ['Oxygen', 'Animals', 'Lungs', 'Carbon'], correctIndex: 1, category: 'science' },
    { prompt: 'Renaissance is to Florence as Enlightenment is to...', options: ['London', 'Paris', 'Berlin', 'Vienna'], correctIndex: 1, category: 'history' },
    { prompt: 'Sonata is to classical as riff is to...', options: ['Jazz', 'Rock', 'Blues', 'Pop'], correctIndex: 1, category: 'music' },
    { prompt: 'Odyssey is to Homer as Inferno is to...', options: ['Virgil', 'Dante', 'Ovid', 'Plato'], correctIndex: 1, category: 'literature' },
    { prompt: 'Hypothesis is to experiment as thesis is to...', options: ['Paper', 'Dissertation', 'Theory', 'Proof'], correctIndex: 1, category: 'science' },
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

const QUIZ_POOLS: Record<string, KnowledgeQuizRound[]> = {
  history: [
    { question: 'Which ancient wonder was located in Egypt?', options: ['Colossus of Rhodes', 'Great Pyramid of Giza', 'Hanging Gardens', 'Lighthouse of Alexandria'], correctIndex: 1, category: 'history', funFact: 'The Great Pyramid is the oldest of the Seven Wonders and the only one still standing!' },
    { question: 'Who was the first president of the United States?', options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'], correctIndex: 2, category: 'history', funFact: 'Washington was unanimously elected — the only president to receive every electoral vote.' },
    { question: 'The Renaissance began in which country?', options: ['France', 'England', 'Italy', 'Spain'], correctIndex: 2, category: 'history', funFact: 'Florence is often called the birthplace of the Renaissance, starting in the 14th century.' },
    { question: 'Which war ended in 1945?', options: ['World War I', 'World War II', 'Korean War', 'Vietnam War'], correctIndex: 1, category: 'history', funFact: 'WWII ended with ceremonies in both Europe (May) and the Pacific (September) in 1945.' },
  ],
  science: [
    { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, category: 'science', funFact: 'Mars appears red because of iron oxide (rust) on its surface.' },
    { question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], correctIndex: 2, category: 'science', funFact: 'Diamonds are formed under extreme pressure deep within the Earth.' },
    { question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2, category: 'science', funFact: 'Plants convert CO2 into oxygen through photosynthesis.' },
    { question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '256'], correctIndex: 1, category: 'science', funFact: 'Babies are born with about 270 bones, but many fuse as they grow.' },
  ],
  nature: [
    { question: 'What is the tallest type of tree?', options: ['Oak', 'Redwood', 'Pine', 'Maple'], correctIndex: 1, category: 'nature', funFact: 'The tallest known redwood stands over 380 feet tall.' },
    { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctIndex: 2, category: 'nature', funFact: 'The Pacific Ocean is larger than all of Earth\'s land area combined.' },
    { question: 'How many hearts does an octopus have?', options: ['One', 'Two', 'Three', 'Four'], correctIndex: 2, category: 'nature', funFact: 'Two hearts pump blood to the gills, and one pumps it to the rest of the body.' },
    { question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Horse', 'Antelope'], correctIndex: 1, category: 'nature', funFact: 'Cheetahs can reach 70 mph, but only in short bursts.' },
  ],
  music: [
    { question: 'How many keys does a standard piano have?', options: ['76', '82', '88', '92'], correctIndex: 2, category: 'music', funFact: 'The piano has 52 white keys and 36 black keys.' },
    { question: 'Who composed "The Four Seasons"?', options: ['Mozart', 'Vivaldi', 'Bach', 'Handel'], correctIndex: 1, category: 'music', funFact: 'Vivaldi composed it around 1723 — one of the most popular pieces of classical music ever.' },
    { question: 'What musical term means "gradually getting louder"?', options: ['Diminuendo', 'Crescendo', 'Staccato', 'Legato'], correctIndex: 1, category: 'music', funFact: 'Crescendo comes from the Italian word meaning "to grow."' },
    { question: 'Which decade saw the birth of rock and roll?', options: ['1940s', '1950s', '1960s', '1970s'], correctIndex: 1, category: 'music', funFact: 'Elvis Presley and Chuck Berry helped define the genre in the 1950s.' },
  ],
  cooking: [
    { question: 'What is the main ingredient in guacamole?', options: ['Tomato', 'Avocado', 'Onion', 'Lime'], correctIndex: 1, category: 'cooking', funFact: 'The Aztecs first made guacamole in the 16th century.' },
    { question: 'Which spice is the most expensive by weight?', options: ['Vanilla', 'Saffron', 'Cinnamon', 'Cardamom'], correctIndex: 1, category: 'cooking', funFact: 'Saffron is made from crocus flower stigmas — each flower produces only three strands.' },
    { question: 'What is the Italian phrase for "cooked to the tooth"?', options: ['Alfredo', 'Al dente', 'Antipasto', 'Aglio'], correctIndex: 1, category: 'cooking', funFact: 'Al dente pasta should be firm when bitten — not soft or crunchy.' },
    { question: 'What temperature does water boil at sea level?', options: ['180°F', '200°F', '212°F', '220°F'], correctIndex: 2, category: 'cooking', funFact: 'At higher altitudes, water boils at a lower temperature.' },
  ],
  sports: [
    { question: 'How many players are on a baseball team?', options: ['7', '9', '11', '13'], correctIndex: 1, category: 'sports', funFact: 'Baseball has been played professionally in America since 1869.' },
    { question: 'How long is a marathon race?', options: ['20 miles', '24 miles', '26.2 miles', '30 miles'], correctIndex: 2, category: 'sports', funFact: 'The distance was standardized at the 1908 London Olympics.' },
    { question: 'What sport uses the term "love" for zero?', options: ['Badminton', 'Tennis', 'Squash', 'Table Tennis'], correctIndex: 1, category: 'sports', funFact: 'The term may come from the French "l\'oeuf" meaning egg, shaped like a zero.' },
    { question: 'Which country invented the game of cricket?', options: ['Australia', 'India', 'England', 'South Africa'], correctIndex: 2, category: 'sports', funFact: 'Cricket dates back to the 16th century in England.' },
  ],
  general: [
    { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2, category: 'general', funFact: 'The seven continents together make up about 29% of Earth\'s surface.' },
    { question: 'What is the largest mammal on Earth?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], correctIndex: 1, category: 'general', funFact: 'Blue whales can grow up to 100 feet long.' },
    { question: 'What year did humans first walk on the Moon?', options: ['1965', '1967', '1969', '1971'], correctIndex: 2, category: 'general', funFact: 'Neil Armstrong took the famous first step on July 20, 1969.' },
    { question: 'What color do you get mixing blue and yellow?', options: ['Orange', 'Green', 'Purple', 'Brown'], correctIndex: 1, category: 'general', funFact: 'Blue and yellow are complementary primary colors.' },
  ],
};

export function getKnowledgeQuizRounds(difficulty: number, interests: InterestArea[], count = 8): KnowledgeQuizRound[] {
  let allQuestions: KnowledgeQuizRound[] = [];
  for (const interest of [...interests, 'general']) {
    const pool = QUIZ_POOLS[interest] || QUIZ_POOLS.general;
    allQuestions.push(...pool);
  }
  const unique = allQuestions.filter((q, i, arr) => arr.findIndex(x => x.question === q.question) === i);
  return unique.sort(() => Math.random() - 0.5).slice(0, count);
}

// Keep these for legacy compatibility
export const SEQUENCE_COLORS = [
  { color: '#8B4513', name: 'Walnut' },
  { color: '#2D6A4F', name: 'Forest' },
  { color: '#1A365D', name: 'Navy' },
  { color: '#744210', name: 'Amber' },
];

export function getSequenceLength(difficulty: number, round: number): number {
  const base = difficulty <= 2 ? 3 : difficulty <= 4 ? 4 : 5;
  return base + Math.floor(round / 3);
}
