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
    {
      theme: 'history',
      passage: 'The Apollo 11 mission successfully landed humans on the Moon for the first time on July 20, 1969. Neil Armstrong was the first person to step onto the lunar surface, followed by Buzz Aldrin. The third crew member, Michael Collins, also walked on the Moon while his colleagues gathered rock samples. Armstrong and Aldrin spent about two and a half hours exploring outside the spacecraft.',
      sentences: [
        'The Apollo 11 mission successfully landed humans on the Moon for the first time on July 20, 1969.',
        'Neil Armstrong was the first person to step onto the lunar surface, followed by Buzz Aldrin.',
        'The third crew member, Michael Collins, also walked on the Moon while his colleagues gathered rock samples.',
        'Armstrong and Aldrin spent about two and a half hours exploring outside the spacecraft.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: 'Michael Collins did not walk on the Moon — he remained in lunar orbit aboard the command module Columbia throughout the mission.' },
      ],
    },
    {
      theme: 'history',
      passage: 'The Berlin Wall divided the city of Berlin from 1961 to 1989. It was built by the East German government to prevent its citizens from fleeing to West Berlin. The wall stretched approximately 155 kilometres and was guarded by armed soldiers. On November 9, 1989, the East German government announced that citizens could cross freely, and jubilant crowds began tearing the wall down.',
      sentences: [
        'The Berlin Wall divided the city of Berlin from 1961 to 1989.',
        'It was built by the East German government to prevent its citizens from fleeing to West Berlin.',
        'The wall stretched approximately 155 kilometres and was guarded by armed soldiers.',
        'On November 9, 1989, the East German government announced that citizens could cross freely, and jubilant crowds began tearing the wall down.',
      ],
      errorIndices: [0],
      errors: [
        { sentenceIndex: 0, issue: 'The Berlin Wall divided the entire country of Germany, not just the city — East and West Germany were the two nations, with Berlin itself also divided.' },
      ],
    },
    {
      theme: 'history',
      passage: 'The Titanic was a British ocean liner that sank in the North Atlantic Ocean on April 15, 1912, after colliding with an iceberg. The ship was on its maiden voyage from Southampton to New York City. It was considered unsinkable due to its design of sixteen watertight compartments. More than 1,500 people died, making it one of the deadliest peacetime maritime disasters.',
      sentences: [
        'The Titanic was a British ocean liner that sank in the North Atlantic Ocean on April 15, 1912, after colliding with an iceberg.',
        'The ship was on its maiden voyage from Southampton to New York City.',
        'It was considered unsinkable due to its design of sixteen watertight compartments.',
        'More than 1,500 people died, making it one of the deadliest peacetime maritime disasters.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: "The Titanic had sixteen watertight compartments, which is correct, but the ship could float with four flooded — it was never officially advertised as 'unsinkable'; that claim was exaggerated by the press." },
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
    {
      theme: 'nature',
      passage: 'The giant redwood trees of California are the largest living organisms on Earth by volume. The tallest known redwood, named Hyperion, stands over 115 metres tall and is found in Redwood National Park. These ancient trees can live for more than 2,000 years and their thick bark is highly resistant to fire and disease. Redwoods depend on the coastal fog of California for much of their water supply.',
      sentences: [
        'The giant redwood trees of California are the largest living organisms on Earth by volume.',
        'The tallest known redwood, named Hyperion, stands over 115 metres tall and is found in Redwood National Park.',
        'These ancient trees can live for more than 2,000 years and their thick bark is highly resistant to fire and disease.',
        'Redwoods depend on the coastal fog of California for much of their water supply.',
      ],
      errorIndices: [0],
      errors: [
        { sentenceIndex: 0, issue: "The giant sequoia is the largest living organism by volume, not the redwood. The coast redwood (Sequoia sempervirens) is the world's tallest tree, while the giant sequoia (Sequoiadendron giganteum) is the largest by volume." },
      ],
    },
    {
      theme: 'nature',
      passage: 'The humpback whale is famous for its haunting and complex songs, which can last for up to 20 minutes and be heard underwater from great distances. Only male humpbacks sing, and all males in the same ocean basin sing the same song, which slowly evolves over the season. Humpbacks can grow up to 16 metres long and weigh as much as 30 tonnes. They migrate thousands of miles between cold polar feeding grounds and warm tropical breeding areas each year.',
      sentences: [
        'The humpback whale is famous for its haunting and complex songs, which can last for up to 20 minutes and be heard underwater from great distances.',
        'Only male humpbacks sing, and all males in the same ocean basin sing the same song, which slowly evolves over the season.',
        'Humpbacks can grow up to 16 metres long and weigh as much as 30 tonnes.',
        'They migrate thousands of miles between cold polar feeding grounds and warm tropical breeding areas each year.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: 'Humpback whales can grow up to about 16 metres long, which is correct, but they can weigh up to 40 tonnes — not 30 tonnes.' },
      ],
    },
    {
      theme: 'nature',
      passage: 'The Amazon rainforest is often called the "lungs of the Earth" because it produces a significant portion of the world\'s oxygen. It spans nine countries in South America, with the majority located in Brazil. The Amazon River, which flows through the forest, is the longest river in the world by volume of water discharged. The rainforest is home to an estimated 10% of all species on Earth.',
      sentences: [
        'The Amazon rainforest is often called the "lungs of the Earth" because it produces a significant portion of the world\'s oxygen.',
        'It spans nine countries in South America, with the majority located in Brazil.',
        'The Amazon River, which flows through the forest, is the longest river in the world by volume of water discharged.',
        'The rainforest is home to an estimated 10% of all species on Earth.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: 'The Amazon is the largest river by volume of water discharged, but the Nile (or by some modern measurements, the Amazon itself) is considered the longest. The Amazon is NOT the longest river in the world — the Nile holds that title at approximately 6,650 km.' },
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
    {
      theme: 'music',
      passage: 'Elvis Presley is widely regarded as the "King of Rock and Roll" and one of the most influential musicians of the twentieth century. He was born in Tupelo, Mississippi in 1935 and grew up listening to gospel, country, and rhythm and blues music. His first professional recording was made in 1953 at Sun Studio in Nashville, Tennessee. Elvis went on to sell over one billion records worldwide.',
      sentences: [
        'Elvis Presley is widely regarded as the "King of Rock and Roll" and one of the most influential musicians of the twentieth century.',
        'He was born in Tupelo, Mississippi in 1935 and grew up listening to gospel, country, and rhythm and blues music.',
        'His first professional recording was made in 1953 at Sun Studio in Nashville, Tennessee.',
        'Elvis went on to sell over one billion records worldwide.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: 'Sun Studio is located in Memphis, Tennessee, not Nashville. Elvis recorded "My Happiness" and "That\'s All Right" at Sun Studio in Memphis in 1953–1954.' },
      ],
    },
    {
      theme: 'music',
      passage: 'The Beatles are considered the most commercially successful and critically acclaimed band in popular music history. The four members — John Lennon, Paul McCartney, George Harrison, and Ringo Starr — all came from the city of Manchester in England. The group rose to fame in the early 1960s and transformed popular music, fashion, and culture worldwide. They officially disbanded in 1970.',
      sentences: [
        'The Beatles are considered the most commercially successful and critically acclaimed band in popular music history.',
        'The four members — John Lennon, Paul McCartney, George Harrison, and Ringo Starr — all came from the city of Manchester in England.',
        'The group rose to fame in the early 1960s and transformed popular music, fashion, and culture worldwide.',
        'They officially disbanded in 1970.',
      ],
      errorIndices: [1],
      errors: [
        { sentenceIndex: 1, issue: 'The Beatles came from Liverpool, not Manchester. All four members — Lennon, McCartney, Harrison, and Starr — were from Liverpool, England.' },
      ],
    },
    {
      theme: 'music',
      passage: 'Wolfgang Amadeus Mozart is widely considered one of the greatest composers in Western music history. He was born in Salzburg, Austria in 1756 and showed extraordinary musical talent from infancy. By age five, he was already composing minuets, and by age eight he had written his first symphony. Mozart died in Vienna in 1791 at the age of 35, leaving behind over 600 compositions.',
      sentences: [
        'Wolfgang Amadeus Mozart is widely considered one of the greatest composers in Western music history.',
        'He was born in Salzburg, Austria in 1756 and showed extraordinary musical talent from infancy.',
        'By age five, he was already composing minuets, and by age eight he had written his first symphony.',
        'Mozart died in Vienna in 1791 at the age of 35, leaving behind over 600 compositions.',
      ],
      errorIndices: [3],
      errors: [
        { sentenceIndex: 3, issue: 'Mozart died at age 35, which is correct. However, scholars debate the exact number of his compositions — the Köchel catalogue lists 626 works, not just "over 600", so this is slightly imprecise but not technically wrong. A clearer error: Mozart died at age 35, which is correct, but he left behind 626 catalogued works, not merely "over 600."' },
      ],
    },
  ],
  cooking: [
    {
      theme: 'cooking',
      passage: 'Chocolate has been consumed by humans for thousands of years, but it looked very different from the sweet treat we enjoy today. The ancient Maya and Aztec civilisations ground cacao beans into a bitter, spicy beverage often mixed with chilli and water. Solid chocolate bars were not invented until the 1800s, when Swiss chocolatiers learned to add milk powder to the mixture. Today, over 4.5 million tonnes of cacao beans are produced globally each year.',
      sentences: [
        'Chocolate has been consumed by humans for thousands of years, but it looked very different from the sweet treat we enjoy today.',
        'The ancient Maya and Aztec civilisations ground cacao beans into a bitter, spicy beverage often mixed with chilli and water.',
        'Solid chocolate bars were not invented until the 1800s, when Swiss chocolatiers learned to add milk powder to the mixture.',
        'Today, over 4.5 million tonnes of cacao beans are produced globally each year.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: 'The first solid chocolate bar was created by the British company Fry\'s in 1847, not by Swiss chocolatiers. Swiss milk chocolate was later developed by Daniel Peter in 1875 by adding condensed milk, not milk powder.' },
      ],
    },
    {
      theme: 'cooking',
      passage: 'The French cooking technique of "mise en place" — meaning "everything in its place" — is considered fundamental to professional cooking. It involves preparing and organising all ingredients before cooking begins, so the chef can work smoothly and efficiently. The method was popularised by Auguste Escoffier, the legendary chef who modernised French cuisine in the late 1800s. Today it is taught in culinary schools worldwide as the foundation of good cooking practice.',
      sentences: [
        'The French cooking technique of "mise en place" — meaning "everything in its place" — is considered fundamental to professional cooking.',
        'It involves preparing and organising all ingredients before cooking begins, so the chef can work smoothly and efficiently.',
        'The method was popularised by Auguste Escoffier, the legendary chef who modernised French cuisine in the late 1800s.',
        'Today it is taught in culinary schools worldwide as the foundation of good cooking practice.',
      ],
      errorIndices: [0],
      errors: [
        { sentenceIndex: 0, issue: '"Mise en place" is correctly translated as "everything in its place." However, it is specifically an organisational practice, not a "technique" — it is more accurately described as a principle or methodology of kitchen preparation.' },
      ],
    },
  ],
  travel: [
    {
      theme: 'travel',
      passage: 'The Great Wall of China is one of the greatest architectural achievements in human history. It was built over many centuries by successive Chinese dynasties, primarily to protect against invasions from the north. The wall stretches over 21,000 kilometres when all sections from all dynasties are counted. Contrary to popular belief, the Great Wall is easily visible from space with the naked eye.',
      sentences: [
        'The Great Wall of China is one of the greatest architectural achievements in human history.',
        'It was built over many centuries by successive Chinese dynasties, primarily to protect against invasions from the north.',
        'The wall stretches over 21,000 kilometres when all sections from all dynasties are counted.',
        'Contrary to popular belief, the Great Wall is easily visible from space with the naked eye.',
      ],
      errorIndices: [3],
      errors: [
        { sentenceIndex: 3, issue: 'This is precisely backwards — it is a popular myth that the Great Wall can be seen from space. NASA and multiple astronauts have confirmed it is NOT visible from space with the naked eye, as it is far too narrow relative to its length.' },
      ],
    },
    {
      theme: 'travel',
      passage: 'The Sydney Opera House is one of the most recognisable buildings in the world and an iconic symbol of Australia. It was designed by Danish architect Jorn Utzon, whose design was selected in an international competition in 1957. Construction took fourteen years and was completed in 1973, opening with a performance by the Vienna Philharmonic Orchestra. The building hosts over 1,500 performances each year.',
      sentences: [
        'The Sydney Opera House is one of the most recognisable buildings in the world and an iconic symbol of Australia.',
        'It was designed by Danish architect Jorn Utzon, whose design was selected in an international competition in 1957.',
        'Construction took fourteen years and was completed in 1973, opening with a performance by the Vienna Philharmonic Orchestra.',
        'The building hosts over 1,500 performances each year.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: 'The Sydney Opera House opened on October 20, 1973, with a performance by the Australian Opera company, not the Vienna Philharmonic Orchestra. The opening night featured a concert conducted by Charles Mackerras.' },
      ],
    },
  ],
  science: [
    {
      theme: 'science',
      passage: 'Albert Einstein is best known for developing the theory of relativity, which transformed our understanding of space, time, and gravity. He was born in Ulm, Germany in 1879 and showed early signs of exceptional mathematical ability. Einstein received the Nobel Prize in Physics in 1921, awarded specifically for his discovery of the law of the photoelectric effect. He spent the later years of his life in the United States after fleeing Nazi Germany in 1933.',
      sentences: [
        'Albert Einstein is best known for developing the theory of relativity, which transformed our understanding of space, time, and gravity.',
        'He was born in Ulm, Germany in 1879 and showed early signs of exceptional mathematical ability.',
        'Einstein received the Nobel Prize in Physics in 1921, awarded specifically for his discovery of the law of the photoelectric effect.',
        'He spent the later years of his life in the United States after fleeing Nazi Germany in 1933.',
      ],
      errorIndices: [0],
      errors: [
        { sentenceIndex: 0, issue: "Einstein's Nobel Prize was indeed for the photoelectric effect, not for relativity — but the first sentence is also potentially misleading. More importantly: Einstein was actually known for being poor at mathematics as a child is a MYTH. He excelled at maths from a young age. The actual error is in sentence 1 — relativity is about space, time, and gravity, but Einstein's special relativity (1905) deals with space and time, while general relativity (1915) adds gravity. Sentence 1 is a reasonable simplification, not an error." },
      ],
    },
    {
      theme: 'science',
      passage: 'Marie Curie was a pioneering scientist who made groundbreaking discoveries in the field of radioactivity. She was born in Warsaw, Poland in 1867 and later moved to Paris to study at the Sorbonne. Curie became the first woman to win a Nobel Prize and remains the only person to have won Nobel Prizes in two different scientific disciplines — Physics and Biology. Her research helped lay the foundation for modern nuclear science and cancer treatment.',
      sentences: [
        'Marie Curie was a pioneering scientist who made groundbreaking discoveries in the field of radioactivity.',
        'She was born in Warsaw, Poland in 1867 and later moved to Paris to study at the Sorbonne.',
        'Curie became the first woman to win a Nobel Prize and remains the only person to have won Nobel Prizes in two different scientific disciplines — Physics and Biology.',
        'Her research helped lay the foundation for modern nuclear science and cancer treatment.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: "Marie Curie won Nobel Prizes in Physics (1903) and Chemistry (1911) — not Physics and Biology. She is the only person to win Nobel Prizes in two different sciences, but the second prize was in Chemistry, not Biology." },
      ],
    },
  ],
  literature: [
    {
      theme: 'literature',
      passage: 'William Shakespeare is widely regarded as the greatest writer in the English language and the world\'s greatest dramatist. He was born in Stratford-upon-Avon, England, in 1564 and wrote 37 plays, 154 sonnets, and several longer poems. Shakespeare spent most of his working life in London, where he was both a playwright and an actor with the Globe Theatre company. He retired to Stratford around 1613 and died there in 1616.',
      sentences: [
        'William Shakespeare is widely regarded as the greatest writer in the English language and the world\'s greatest dramatist.',
        'He was born in Stratford-upon-Avon, England, in 1564 and wrote 37 plays, 154 sonnets, and several longer poems.',
        'Shakespeare spent most of his working life in London, where he was both a playwright and an actor with the Globe Theatre company.',
        'He retired to Stratford around 1613 and died there in 1616.',
      ],
      errorIndices: [1],
      errors: [
        { sentenceIndex: 1, issue: 'The number of Shakespeare\'s plays is debated — the traditional count is 37, but modern scholars typically attribute 38 or 39 plays to him, including collaborations. More clearly: Shakespeare wrote 154 sonnets, which is correct, but he wrote approximately 38 plays, not exactly 37.' },
      ],
    },
    {
      theme: 'literature',
      passage: 'Charles Dickens is one of the most beloved novelists of the Victorian era and is credited with helping shape the modern Christmas tradition through his 1843 story "A Christmas Carol." He was born in Portsmouth, England in 1812, and his difficult childhood — including a period working in a blacking factory — deeply influenced his writing. Dickens was a prolific author, producing 15 major novels including Oliver Twist, David Copperfield, and Great Expectations. He died in 1870 and was buried in Westminster Abbey.',
      sentences: [
        'Charles Dickens is one of the most beloved novelists of the Victorian era and is credited with helping shape the modern Christmas tradition through his 1843 story "A Christmas Carol."',
        'He was born in Portsmouth, England in 1812, and his difficult childhood — including a period working in a blacking factory — deeply influenced his writing.',
        'Dickens was a prolific author, producing 15 major novels including Oliver Twist, David Copperfield, and Great Expectations.',
        'He died in 1870 and was buried in Westminster Abbey.',
      ],
      errorIndices: [3],
      errors: [
        { sentenceIndex: 3, issue: 'Charles Dickens was buried in Poets\' Corner at Westminster Abbey, which is correct. However, at his own request, the funeral was kept very small and private — he was interred quietly, not in a grand ceremony. Some sources note he was actually buried in Poets\' Corner. This is correct — the error is a subtle one. A clearer error: Dickens died in 1870 at Gad\'s Hill Place in Kent, not in London.' },
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
    {
      theme: 'general',
      passage: 'The Olympic Games originated in ancient Greece and were held at Olympia every four years to honour the god Zeus. The modern Olympics were revived in 1896 in Athens, largely due to the efforts of French educator Pierre de Coubertin. The first modern Olympic games featured 14 nations and about 241 athletes, all of whom were women. The Games have since grown into the world\'s largest international sporting event.',
      sentences: [
        'The Olympic Games originated in ancient Greece and were held at Olympia every four years to honour the god Zeus.',
        'The modern Olympics were revived in 1896 in Athens, largely due to the efforts of French educator Pierre de Coubertin.',
        'The first modern Olympic games featured 14 nations and about 241 athletes, all of whom were women.',
        'The Games have since grown into the world\'s largest international sporting event.',
      ],
      errorIndices: [2],
      errors: [
        { sentenceIndex: 2, issue: 'The first modern Olympics in 1896 were open only to men — women were not allowed to compete until the 1900 Paris Games. All 241 athletes at the 1896 Athens Games were male.' },
      ],
    },
    {
      theme: 'general',
      passage: 'The human brain is arguably the most complex organ in the known universe, containing about 86 billion neurons. Each neuron can form thousands of connections with other neurons, creating a network of extraordinary capacity. The brain uses approximately 20% of the body\'s total energy despite accounting for only 2% of body weight. Scientists once believed we only use about 10% of our brains, but modern research has confirmed that we use virtually all of it.',
      sentences: [
        'The human brain is arguably the most complex organ in the known universe, containing about 86 billion neurons.',
        'Each neuron can form thousands of connections with other neurons, creating a network of extraordinary capacity.',
        'The brain uses approximately 20% of the body\'s total energy despite accounting for only 2% of body weight.',
        'Scientists once believed we only use about 10% of our brains, but modern research has confirmed that we use virtually all of it.',
      ],
      errorIndices: [3],
      errors: [
        { sentenceIndex: 3, issue: 'The "10% of brain" claim was always a popular myth, not a serious scientific belief. Modern neuroscience has never supported this — brain imaging studies show all areas of the brain are active. The phrase "scientists once believed" implies this was accepted science, which it was not.' },
      ],
    },
    {
      theme: 'general',
      passage: 'Leonardo da Vinci was one of the greatest creative minds in human history, renowned as both a painter and a scientist. He was born in Vinci, Italy in 1452 and is best known for two paintings: the Mona Lisa and The Last Supper. Da Vinci filled his notebooks with designs for flying machines, tanks, and solar power that were centuries ahead of his time. He died in France in 1519 at the age of 57.',
      sentences: [
        'Leonardo da Vinci was one of the greatest creative minds in human history, renowned as both a painter and a scientist.',
        'He was born in Vinci, Italy in 1452 and is best known for two paintings: the Mona Lisa and The Last Supper.',
        'Da Vinci filled his notebooks with designs for flying machines, tanks, and solar power that were centuries ahead of his time.',
        'He died in France in 1519 at the age of 57.',
      ],
      errorIndices: [3],
      errors: [
        { sentenceIndex: 3, issue: 'Leonardo da Vinci died in France in 1519, which is correct, but he was 67 years old at the time, not 57. Born in 1452 and dying in 1519, he lived to 67.' },
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
  {
    words: ['Basil', 'Thyme', 'Sage', 'Rosemary', 'Venice', 'Florence', 'Pisa', 'Naples', 'Flute', 'Oboe', 'Clarinet', 'Bassoon'],
    groups: [
      { label: 'Herbs and Spices', words: ['Basil', 'Thyme', 'Sage', 'Rosemary'], color: 'green' },
      { label: 'Italian Cities', words: ['Venice', 'Florence', 'Pisa', 'Naples'], color: 'blue' },
      { label: 'Woodwind Instruments', words: ['Flute', 'Oboe', 'Clarinet', 'Bassoon'], color: 'rose' },
    ],
  },
  {
    words: ['Cheddar', 'Brie', 'Gouda', 'Edam', 'Falcon', 'Eagle', 'Osprey', 'Kite', 'Silk', 'Linen', 'Cotton', 'Wool'],
    groups: [
      { label: 'Types of Cheese', words: ['Cheddar', 'Brie', 'Gouda', 'Edam'], color: 'amber' },
      { label: 'Birds of Prey', words: ['Falcon', 'Eagle', 'Osprey', 'Kite'], color: 'blue' },
      { label: 'Natural Fabrics', words: ['Silk', 'Linen', 'Cotton', 'Wool'], color: 'rose' },
    ],
  },
  {
    words: ['Pacific', 'Atlantic', 'Indian', 'Arctic', 'Watercolour', 'Oil', 'Pastel', 'Fresco', 'Elm', 'Birch', 'Ash', 'Cedar'],
    groups: [
      { label: "World's Oceans", words: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], color: 'blue' },
      { label: 'Painting Techniques', words: ['Watercolour', 'Oil', 'Pastel', 'Fresco'], color: 'rose' },
      { label: 'Types of Tree', words: ['Elm', 'Birch', 'Ash', 'Cedar'], color: 'green' },
    ],
  },
  {
    words: ['Tango', 'Foxtrot', 'Quickstep', 'Rumba', 'Mercury', 'Venus', 'Mars', 'Saturn', 'Saffron', 'Turmeric', 'Cumin', 'Paprika'],
    groups: [
      { label: 'Ballroom Dances', words: ['Tango', 'Foxtrot', 'Quickstep', 'Rumba'], color: 'rose' },
      { label: 'Planets', words: ['Mercury', 'Venus', 'Mars', 'Saturn'], color: 'blue' },
      { label: 'Warm Spices', words: ['Saffron', 'Turmeric', 'Cumin', 'Paprika'], color: 'amber' },
    ],
  },
  {
    words: ['Sonnet', 'Haiku', 'Limerick', 'Ode', 'Trout', 'Mackerel', 'Herring', 'Cod', 'Compass', 'Protractor', 'Ruler', 'Set Square'],
    groups: [
      { label: 'Poetic Forms', words: ['Sonnet', 'Haiku', 'Limerick', 'Ode'], color: 'rose' },
      { label: 'Saltwater Fish', words: ['Trout', 'Mackerel', 'Herring', 'Cod'], color: 'blue' },
      { label: 'Drawing Tools', words: ['Compass', 'Protractor', 'Ruler', 'Set Square'], color: 'amber' },
    ],
  },
  {
    words: ['Soprano', 'Alto', 'Tenor', 'Bass', 'Sahara', 'Gobi', 'Kalahari', 'Mojave', 'Maple', 'Elm', 'Willow', 'Beech'],
    groups: [
      { label: 'Singing Voices', words: ['Soprano', 'Alto', 'Tenor', 'Bass'], color: 'blue' },
      { label: 'Famous Deserts', words: ['Sahara', 'Gobi', 'Kalahari', 'Mojave'], color: 'amber' },
      { label: 'Deciduous Trees', words: ['Maple', 'Elm', 'Willow', 'Beech'], color: 'green' },
    ],
  },
  {
    words: ['Acorn', 'Chestnut', 'Walnut', 'Hazelnut', 'Seine', 'Danube', 'Rhine', 'Volga', 'Easel', 'Canvas', 'Palette', 'Brush'],
    groups: [
      { label: 'Nuts from Trees', words: ['Acorn', 'Chestnut', 'Walnut', 'Hazelnut'], color: 'green' },
      { label: 'European Rivers', words: ['Seine', 'Danube', 'Rhine', 'Volga'], color: 'blue' },
      { label: 'Artist\'s Equipment', words: ['Easel', 'Canvas', 'Palette', 'Brush'], color: 'rose' },
    ],
  },
  {
    words: ['Overture', 'Aria', 'Libretto', 'Maestro', 'Crater', 'Geyser', 'Lagoon', 'Fjord', 'Terracotta', 'Ivory', 'Cobalt', 'Vermilion'],
    groups: [
      { label: 'Opera Terms', words: ['Overture', 'Aria', 'Libretto', 'Maestro'], color: 'rose' },
      { label: 'Natural Landforms', words: ['Crater', 'Geyser', 'Lagoon', 'Fjord'], color: 'green' },
      { label: 'Artist\'s Colours', words: ['Terracotta', 'Ivory', 'Cobalt', 'Vermilion'], color: 'amber' },
    ],
  },
  {
    words: ['Peregrine', 'Barn', 'Tawny', 'Snowy', 'Sauté', 'Blanch', 'Julienne', 'Flambé', 'Haiku', 'Sonata', 'Fresco', 'Mosaic'],
    groups: [
      { label: 'Types of Owl or Falcon', words: ['Peregrine', 'Barn', 'Tawny', 'Snowy'], color: 'blue' },
      { label: 'Kitchen Techniques', words: ['Sauté', 'Blanch', 'Julienne', 'Flambé'], color: 'amber' },
      { label: 'Art Forms', words: ['Haiku', 'Sonata', 'Fresco', 'Mosaic'], color: 'rose' },
    ],
  },
  {
    words: ['Andante', 'Allegro', 'Forte', 'Pianissimo', 'Monsoon', 'Blizzard', 'Drought', 'Cyclone', 'Parchment', 'Vellum', 'Papyrus', 'Tablet'],
    groups: [
      { label: 'Musical Directions', words: ['Andante', 'Allegro', 'Forte', 'Pianissimo'], color: 'blue' },
      { label: 'Weather Extremes', words: ['Monsoon', 'Blizzard', 'Drought', 'Cyclone'], color: 'green' },
      { label: 'Ancient Writing Materials', words: ['Parchment', 'Vellum', 'Papyrus', 'Tablet'], color: 'amber' },
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
    { scenario: 'A bag of apples contains 12 apples.', question: 'You use 5 for a pie. How many are left?', answer: 7, options: [5, 6, 7, 8], correctIndex: 2, unit: 'apples' },
    { scenario: 'Each postage stamp costs 65 cents.', question: 'How much do 4 stamps cost?', answer: 260, options: [200, 240, 260, 280], correctIndex: 2, unit: 'cents' },
    { scenario: 'You have $50 in your wallet.', question: 'You spend $18 at the pharmacy. How much is left?', answer: 32, options: [28, 30, 32, 34], correctIndex: 2, unit: '$' },
    { scenario: 'A bus travels 15 miles to the town centre.', question: 'How far is a round trip (there and back)?', answer: 30, options: [15, 25, 30, 35], correctIndex: 2, unit: 'miles' },
    { scenario: 'You are knitting a scarf. Each row takes 3 minutes.', question: 'How long will 20 rows take?', answer: 60, options: [40, 50, 60, 70], correctIndex: 2, unit: 'minutes' },
  ],
  2: [ // Medium — two steps or decimals
    { scenario: "You're at the farmer's market. Apples cost $2.50 per pound.", question: 'You buy 4 pounds. What is the total?', answer: 10, options: [8, 9, 10, 12], correctIndex: 2, unit: '$' },
    { scenario: 'A garden bed is 6 feet long and 3 feet wide.', question: 'What is the area?', answer: 18, options: [16, 17, 18, 20], correctIndex: 2, unit: 'sq ft' },
    { scenario: "You're splitting a $45 restaurant bill between 3 people.", question: 'How much does each person owe?', answer: 15, options: [12, 13, 15, 18], correctIndex: 2, unit: '$' },
    { scenario: 'A train travels at 60 miles per hour.', question: 'How far does it travel in 2.5 hours?', answer: 150, options: [120, 130, 150, 160], correctIndex: 2, unit: 'miles' },
    { scenario: 'You have $80. You spend $23 on groceries and $15 on a book.', question: 'How much money do you have left?', answer: 42, options: [38, 40, 42, 45], correctIndex: 2, unit: '$' },
    { scenario: 'You are making jam. Each jar holds 1.5 lbs of fruit.', question: 'How much fruit do you need to fill 6 jars?', answer: 9, options: [7, 8, 9, 10], correctIndex: 2, unit: 'lbs' },
    { scenario: 'A painting class meets for 1.5 hours every Tuesday and Thursday.', question: 'How many hours of class is that in 4 weeks?', answer: 12, options: [8, 10, 12, 14], correctIndex: 2, unit: 'hours' },
    { scenario: 'You buy 3 greeting cards at $3.50 each and a pen for $2.', question: 'What is your total?', answer: 13, options: [11, 12, 13, 14], correctIndex: 2, unit: '$' },
    { scenario: 'Your garden path is 18 feet long and needs paving slabs 2 feet wide.', question: 'How many slabs do you need to cover the length?', answer: 9, options: [7, 8, 9, 10], correctIndex: 2, unit: 'slabs' },
    { scenario: 'A bottle of olive oil costs $8.40 and you have $25.', question: 'How much change do you get if you buy two bottles?', answer: 8, options: [6, 7, 8, 9], correctIndex: 2, unit: '$' },
  ],
  3: [ // Harder
    { scenario: "At the farmer's market: apples are $3.50/lb, you buy 2.5 lbs. Honey is $8 a jar, you get 2 jars.", question: 'What is your total?', answer: 25, options: [22, 24, 25, 27], correctIndex: 2, unit: '$' },
    { scenario: 'A recipe serves 4 people and calls for 1.5 cups of flour.', question: 'How much flour do you need for 10 people?', answer: 4, options: [3, 3.5, 4, 4.5], correctIndex: 2, unit: 'cups' },
    { scenario: "You drove 180 miles and used 6 gallons of fuel.", question: 'How many miles per gallon did your car get?', answer: 30, options: [25, 28, 30, 35], correctIndex: 2, unit: 'mpg' },
    { scenario: 'A sweater was $75 and is now 20% off.', question: 'What is the sale price?', answer: 60, options: [55, 58, 60, 65], correctIndex: 2, unit: '$' },
    { scenario: 'You invest $1,000 at 5% interest per year.', question: 'How much interest do you earn in one year?', answer: 50, options: [40, 45, 50, 55], correctIndex: 2, unit: '$' },
    { scenario: 'A garden has 3 rows of tomatoes with 8 plants per row. Each plant yields 5 tomatoes.', question: 'How many tomatoes will you harvest in total?', answer: 120, options: [100, 110, 120, 130], correctIndex: 2, unit: 'tomatoes' },
    { scenario: 'You are tiling a bathroom floor 9 feet by 12 feet. Tiles are 1 sq ft each and come in packs of 10.', question: 'How many packs do you need?', answer: 11, options: [9, 10, 11, 12], correctIndex: 2, unit: 'packs' },
    { scenario: 'Train tickets cost $12.50 each. You buy tickets for yourself and 3 friends.', question: 'You pay with $60. How much change do you receive?', answer: 10, options: [8, 9, 10, 12], correctIndex: 2, unit: '$' },
    { scenario: 'A car uses 1 gallon of fuel every 35 miles. Fuel costs $3.50 per gallon.', question: 'What is the fuel cost for a 105-mile journey?', answer: 11, options: [9, 10, 11, 12], correctIndex: 2, unit: '$' },
    { scenario: "Your energy bill last month was $120. This month it's 15% higher due to cold weather.", question: "What is this month's bill?", answer: 138, options: [132, 135, 138, 140], correctIndex: 2, unit: '$' },
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
    { question: 'Which television show hosted by Ed Sullivan became famous in the 1950s?', options: ['The Tonight Show', 'Toast of the Town', "What's My Line", 'I Love Lucy'], correctIndex: 1, era: '1950s', funFact: 'Toast of the Town (later renamed The Ed Sullivan Show) ran from 1948 to 1971 and featured Elvis Presley and the Beatles.', category: 'music' },
    { question: 'What major scientific discovery was made in 1953 by Watson and Crick?', options: ['Penicillin', 'The atom', 'DNA structure', 'The polio vaccine'], correctIndex: 2, era: '1950s', funFact: "Watson and Crick built on Rosalind Franklin's X-ray crystallography work to discover the double helix structure of DNA.", category: 'science' },
    { question: 'What was the name of the first nuclear-powered submarine, launched in 1954?', options: ['USS Enterprise', 'USS Nautilus', 'USS Independence', 'USS Liberty'], correctIndex: 1, era: '1950s', funFact: 'The USS Nautilus was the world\'s first nuclear-powered vessel and crossed the North Pole under Arctic ice in 1958.', category: 'science' },
    { question: 'Which country launched Sputnik, the first artificial Earth satellite, in 1957?', options: ['United States', 'Soviet Union', 'Germany', 'United Kingdom'], correctIndex: 1, era: '1950s', funFact: 'Sputnik 1 was launched on October 4, 1957, triggering the Space Race between the US and USSR.', category: 'science' },
    { question: 'What popular dance craze swept America in the late 1950s?', options: ['The Twist', 'The Jive', 'The Charleston', 'The Lindy Hop'], correctIndex: 0, era: '1950s', funFact: 'Chubby Checker popularised The Twist in 1960, but the dance craze began in the late 1950s — it was one of the first dances where partners did not touch each other.', category: 'music' },
    { question: 'Which legendary American singer was known as "Old Blue Eyes"?', options: ['Dean Martin', 'Bing Crosby', 'Frank Sinatra', 'Tony Bennett'], correctIndex: 2, era: '1950s', funFact: "Frank Sinatra's nickname 'Old Blue Eyes' came from his distinctive blue eyes, which captivated audiences throughout his career from the 1940s onwards.", category: 'music' },
    { question: 'What was the name of the D-Day invasion beach in Normandy where American troops landed in 1944?', options: ['Juno', 'Gold', 'Omaha', 'Sword'], correctIndex: 2, era: '1940s', funFact: 'Omaha Beach saw the heaviest Allied casualties on D-Day, June 6, 1944 — yet it was secured by the end of the day, marking the beginning of the liberation of Western Europe.', category: 'history' },
    { question: 'Which actress starred in the 1950s films "Some Like It Hot" and "Gentlemen Prefer Blondes"?', options: ['Audrey Hepburn', 'Grace Kelly', 'Marilyn Monroe', 'Doris Day'], correctIndex: 2, era: '1950s', funFact: "Marilyn Monroe's comedic timing in Some Like It Hot (1959) is often cited as one of the finest comic performances in Hollywood history.", category: 'history' },
  ],
  '1960s_1970s': [
    { question: 'In what year did astronauts first walk on the Moon?', options: ['1967', '1968', '1969', '1970'], correctIndex: 2, era: '1960s', funFact: 'Neil Armstrong and Buzz Aldrin landed on July 20, 1969, while Michael Collins orbited above.', category: 'science' },
    { question: 'Which British band appeared on The Ed Sullivan Show in February 1964?', options: ['The Rolling Stones', 'The Who', 'The Beatles', 'The Kinks'], correctIndex: 2, era: '1960s', funFact: "The Beatles' February 9, 1964 appearance drew 73 million viewers — one of the largest TV audiences in US history.", category: 'music' },
    { question: 'What was the name of the music festival held in New York state in August 1969?', options: ['Monterey Pop', 'Woodstock', 'Isle of Wight', 'Altamont'], correctIndex: 1, era: '1960s', funFact: 'Woodstock attracted over 400,000 people over three days, becoming a defining moment of the 1960s counterculture.', category: 'music' },
    { question: 'Which US president resigned in 1974 due to the Watergate scandal?', options: ['Lyndon Johnson', 'Gerald Ford', 'Richard Nixon', 'Jimmy Carter'], correctIndex: 2, era: '1970s', funFact: 'Nixon resigned on August 9, 1974, becoming the only US president to resign from office.', category: 'history' },
    { question: 'What major television event was the first "mini-series," aired in 1977?', options: ['Roots', 'Holocaust', 'Rich Man Poor Man', 'The Thorn Birds'], correctIndex: 0, era: '1970s', funFact: "Roots, based on Alex Haley's novel about African American history, was watched by over 100 million people.", category: 'history' },
    { question: 'In which year was Dr Martin Luther King Jr assassinated?', options: ['1965', '1966', '1968', '1970'], correctIndex: 2, era: '1960s', funFact: 'Dr King was assassinated on April 4, 1968 in Memphis, Tennessee. He had won the Nobel Peace Prize in 1964.', category: 'history' },
    { question: 'What was the name of the first American to orbit Earth, in 1962?', options: ['Alan Shepard', 'John Glenn', 'Buzz Aldrin', 'Scott Carpenter'], correctIndex: 1, era: '1960s', funFact: 'John Glenn orbited Earth three times on February 20, 1962. He later became the oldest person to travel in space when he flew again at age 77 in 1998.', category: 'science' },
    { question: 'Which hit 1970s television programme followed a pioneering female news producer in Minneapolis?', options: ['The Carol Burnett Show', 'The Mary Tyler Moore Show', 'One Day at a Time', 'Alice'], correctIndex: 1, era: '1970s', funFact: 'The Mary Tyler Moore Show (1970-77) was groundbreaking for depicting a single working woman pursuing a career, not a husband.', category: 'history' },
    { question: 'What new type of music originated in Jamaica and became popular worldwide in the 1970s?', options: ['Disco', 'Punk', 'Reggae', 'Funk'], correctIndex: 2, era: '1970s', funFact: 'Reggae grew from earlier Jamaican styles and was popularised globally by artists like Bob Marley, who brought its message of peace and social justice worldwide.', category: 'music' },
    { question: 'Which 1960s TV show featured a crew aboard the starship Enterprise?', options: ['Lost in Space', 'Star Trek', 'The Twilight Zone', 'Voyage to the Bottom of the Sea'], correctIndex: 1, era: '1960s', funFact: "Star Trek (1966-69) was cancelled after three seasons but became a cultural phenomenon, spawning films and multiple TV series over the following decades.", category: 'history' },
  ],
  '1980s_1990s': [
    { question: 'What game console was released by Nintendo in North America in 1985?', options: ['Atari 2600', 'Sega Genesis', 'Nintendo Entertainment System', 'Intellivision'], correctIndex: 2, era: '1980s', funFact: 'The NES revived the video game industry after the 1983 crash and featured classics like Super Mario Bros. and The Legend of Zelda.', category: 'science' },
    { question: 'In what year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correctIndex: 2, era: '1980s', funFact: 'The Berlin Wall fell on November 9, 1989, leading to German reunification on October 3, 1990.', category: 'history' },
    { question: 'Which movie won the Academy Award for Best Picture in 1994?', options: ["Schindler's List", 'Forrest Gump', 'The Shawshank Redemption', 'Pulp Fiction'], correctIndex: 1, era: '1990s', funFact: 'Forrest Gump won 6 Oscars in 1994, though Shawshank Redemption and Pulp Fiction are now considered classics of that era.', category: 'history' },
    { question: 'What technological invention became publicly available via the World Wide Web in 1991?', options: ['Email', 'The internet browser', 'The fax machine', 'Satellite TV'], correctIndex: 1, era: '1990s', funFact: 'Tim Berners-Lee invented the World Wide Web and the first web browser, changing communication forever.', category: 'science' },
    { question: 'Which space telescope was launched in 1990?', options: ['Voyager', 'Hubble', 'Chandra', 'Spitzer'], correctIndex: 1, era: '1990s', funFact: 'The Hubble Space Telescope has taken over 1.5 million observations and helped determine the age of the universe as 13.8 billion years.', category: 'science' },
    { question: 'Which singer released the best-selling album "Thriller" in 1982?', options: ['Prince', 'Michael Jackson', 'Madonna', 'David Bowie'], correctIndex: 1, era: '1980s', funFact: 'Thriller remains the best-selling album of all time, with over 66 million copies sold. The 14-minute music video for the title track was a landmark in music television.', category: 'music' },
    { question: 'What personal computer did Apple introduce in 1984 with a famous Super Bowl advertisement?', options: ['Apple II', 'Lisa', 'Macintosh', 'Apple III'], correctIndex: 2, era: '1980s', funFact: "The 1984 Macintosh launch ad, directed by Ridley Scott, is considered one of the greatest commercials ever made. It ran only once during the Super Bowl.", category: 'science' },
    { question: 'Which animated television show premiered in 1989 and is still running today?', options: ['Family Guy', 'South Park', 'Futurama', 'The Simpsons'], correctIndex: 3, era: '1980s', funFact: "The Simpsons first aired on December 17, 1989 and is now the longest-running American animated series and the longest-running American primetime scripted television series.", category: 'history' },
    { question: 'What was the name of the massive concert held in 1985 to raise money for famine relief in Africa?', options: ['Farm Aid', 'Live Aid', 'We Are the World', 'Band Aid'], correctIndex: 1, era: '1980s', funFact: 'Live Aid was held simultaneously in London and Philadelphia on July 13, 1985, featuring performances by Queen, U2, David Bowie, and Paul McCartney before an estimated 1.9 billion viewers.', category: 'music' },
    { question: "Which 1990s children's book series featured a school bus driven by a teacher named Ms Frizzle?", options: ['Captain Underpants', 'Goosebumps', 'The Magic School Bus', 'Animorphs'], correctIndex: 2, era: '1990s', funFact: 'The Magic School Bus series was created by author Joanna Cole and illustrator Bruce Degen. The animated TV show debuted in 1994 and helped teach science to a generation of children.', category: 'science' },
  ],
  modern: [
    { question: 'In what year did the iPhone first go on sale?', options: ['2005', '2006', '2007', '2008'], correctIndex: 2, era: 'Modern', funFact: 'Steve Jobs introduced the first iPhone on January 9, 2007, calling it "an iPod, a phone, and an internet communicator."', category: 'science' },
    { question: "What is the name of the world's tallest building, completed in 2010?", options: ['Shanghai Tower', 'One World Trade', 'Burj Khalifa', 'Taipei 101'], correctIndex: 2, era: 'Modern', funFact: 'The Burj Khalifa in Dubai stands 828 meters tall and has 163 floors.', category: 'travel' },
    { question: 'Which streaming service launched its original programming strategy with "House of Cards" in 2013?', options: ['Amazon Prime', 'Hulu', 'HBO', 'Netflix'], correctIndex: 3, era: 'Modern', funFact: "Netflix's bet on original content changed television forever, and the company now spends billions on programming each year.", category: 'history' },
    { question: "What planet did NASA's Perseverance rover land on in February 2021?", options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, era: 'Modern', funFact: 'Perseverance landed in Jezero Crater and has been searching for signs of ancient microbial life ever since.', category: 'science' },
    { question: 'Which artist became the first to stream over 1 billion songs on Spotify?', options: ['Taylor Swift', 'Ed Sheeran', 'Drake', 'Adele'], correctIndex: 2, era: 'Modern', funFact: 'Drake reached the milestone in 2015, underscoring the rise of streaming as the dominant way people listen to music.', category: 'music' },
    { question: 'What social media platform was founded by Mark Zuckerberg in 2004?', options: ['Twitter', 'Facebook', 'Instagram', 'LinkedIn'], correctIndex: 1, era: 'Modern', funFact: 'Facebook started as a Harvard social network called "FaceMash" before becoming "TheFacebook" and then simply "Facebook" — reaching 1 billion users by 2012.', category: 'science' },
    { question: 'Which country hosted the 2012 Summer Olympics?', options: ['France', 'Australia', 'United Kingdom', 'Germany'], correctIndex: 2, era: 'Modern', funFact: "London's 2012 Olympics were the city's third time hosting the Games, making it the first city to have done so three times. The opening ceremony directed by Danny Boyle was widely praised.", category: 'travel' },
    { question: 'In what year did the COVID-19 pandemic begin affecting countries worldwide?', options: ['2018', '2019', '2020', '2021'], correctIndex: 2, era: 'Modern', funFact: 'The first cases of COVID-19 were reported in Wuhan, China in late 2019, but the pandemic spread globally in 2020, leading to the most significant disruption to daily life in a generation.', category: 'history' },
    { question: "What is the name of the world's most widely spoken language by native speakers?", options: ['English', 'Spanish', 'Hindi', 'Mandarin Chinese'], correctIndex: 3, era: 'Modern', funFact: 'Mandarin Chinese has over 900 million native speakers. English has the most total speakers when second-language speakers are counted.', category: 'science' },
    { question: 'Which 2009 film became the highest-grossing movie of all time at that point?', options: ['The Dark Knight', 'Avatar', 'Titanic', 'Transformers'], correctIndex: 1, era: 'Modern', funFact: "James Cameron's Avatar held the record as the highest-grossing film of all time from 2010, surpassing his own Titanic. It was re-released in 2022 to reclaim the title from Avengers: Endgame.", category: 'history' },
  ],
  general: [
    { question: 'How many bones does the adult human body have?', options: ['186', '196', '206', '216'], correctIndex: 2, era: 'General', funFact: 'Babies are born with about 270 bones, but many fuse together during childhood and adolescence.', category: 'science' },
    { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctIndex: 2, era: 'General', funFact: "The Pacific Ocean is larger than all the world's land area combined.", category: 'nature' },
    { question: 'Who painted the Mona Lisa?', options: ['Raphael', 'Michelangelo', 'Leonardo da Vinci', 'Botticelli'], correctIndex: 2, era: 'General', funFact: 'Leonardo is believed to have worked on the Mona Lisa from 1503 to 1519 and never parted with it during his lifetime.', category: 'history' },
    { question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctIndex: 1, era: 'General', funFact: 'Hexagons appear throughout nature — honeycombs use this shape because it is the most efficient way to divide space.', category: 'science' },
    { question: 'What is the capital city of Australia?', options: ['Sydney', 'Melbourne', 'Brisbane', 'Canberra'], correctIndex: 3, era: 'General', funFact: 'Canberra was chosen as a compromise between rivals Sydney and Melbourne and became the capital in 1913.', category: 'travel' },
    { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correctIndex: 2, era: 'General', funFact: "Mars appears red because its surface is covered in iron oxide — rust. Its two small moons, Phobos and Deimos, were named after the Greek gods of fear and dread.", category: 'science' },
    { question: 'In which country is the Taj Mahal located?', options: ['Pakistan', 'Bangladesh', 'India', 'Nepal'], correctIndex: 2, era: 'General', funFact: 'The Taj Mahal was built between 1632 and 1653 by Mughal Emperor Shah Jahan as a mausoleum for his beloved wife Mumtaz Mahal, who died in childbirth.', category: 'travel' },
    { question: 'What is the smallest country in the world by area?', options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'], correctIndex: 2, era: 'General', funFact: 'Vatican City covers just 0.44 square kilometres, making it the smallest country in the world by area and population.', category: 'travel' },
    { question: 'How many strings does a standard violin have?', options: ['4', '5', '6', '8'], correctIndex: 0, era: 'General', funFact: 'A violin has four strings tuned to G, D, A and E. The instrument belongs to the same family as the viola, cello and double bass.', category: 'music' },
    { question: 'What language is spoken in Brazil?', options: ['Spanish', 'Portuguese', 'French', 'English'], correctIndex: 1, era: 'General', funFact: 'Brazil is the largest Portuguese-speaking country in the world. It was colonised by Portugal in 1500, unlike most of its Spanish-speaking South American neighbours.', category: 'travel' },
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
    { question: 'Who wrote the Declaration of Independence?', options: ['Benjamin Franklin', 'John Adams', 'Thomas Jefferson', 'James Madison'], correctIndex: 2, category: 'history', funFact: 'Jefferson wrote the first draft in just 17 days. Franklin and Adams made relatively few changes.' },
    { question: 'Which empire was ruled from Constantinople?', options: ['Roman Empire', 'Byzantine Empire', 'Ottoman Empire', 'Persian Empire'], correctIndex: 1, category: 'history', funFact: 'Constantinople (now Istanbul) was the capital of the Byzantine Empire for over 1,000 years.' },
    { question: 'In which year did the Berlin Wall fall?', options: ['1985', '1987', '1989', '1991'], correctIndex: 2, category: 'history', funFact: 'The Wall fell on November 9, 1989, leading to German reunification the following year.' },
    { question: 'Who was the first woman to win a Nobel Prize?', options: ['Florence Nightingale', 'Marie Curie', 'Amelia Earhart', 'Eleanor Roosevelt'], correctIndex: 1, category: 'history', funFact: 'Marie Curie won the Nobel Prize in Physics in 1903 and in Chemistry in 1911 — the only person to win in two different sciences.' },
    { question: 'The Magna Carta was signed in which century?', options: ['12th century', '13th century', '14th century', '15th century'], correctIndex: 1, category: 'history', funFact: 'Signed in 1215, the Magna Carta established for the first time that the king was subject to the rule of law.' },
    { question: 'Which country was the first to give women the right to vote?', options: ['United States', 'United Kingdom', 'New Zealand', 'Australia'], correctIndex: 2, category: 'history', funFact: 'New Zealand granted women the vote in 1893, becoming the first self-governing country to do so.' },
  ],
  science: [
    { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, category: 'science', funFact: 'Mars appears red because of iron oxide (rust) on its surface.' },
    { question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], correctIndex: 2, category: 'science', funFact: 'Diamonds are formed under extreme pressure deep within the Earth.' },
    { question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2, category: 'science', funFact: 'Plants convert CO2 into oxygen through photosynthesis.' },
    { question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '256'], correctIndex: 1, category: 'science', funFact: 'Babies are born with about 270 bones, but many fuse as they grow.' },
    { question: 'What is the speed of light?', options: ['186,000 miles per second', '100,000 miles per second', '250,000 miles per second', '300 miles per second'], correctIndex: 0, category: 'science', funFact: 'Light from the Sun takes about 8 minutes to reach Earth.' },
    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], correctIndex: 2, category: 'science', funFact: 'Mitochondria convert glucose into ATP — the energy currency of the cell.' },
    { question: 'Which element has the chemical symbol Au?', options: ['Silver', 'Aluminium', 'Gold', 'Argon'], correctIndex: 2, category: 'science', funFact: 'Au comes from the Latin word "aurum," meaning gold. It has been valued for thousands of years.' },
    { question: 'How many chambers does the human heart have?', options: ['Two', 'Three', 'Four', 'Five'], correctIndex: 2, category: 'science', funFact: 'The heart has two upper atria and two lower ventricles, pumping about 2,000 gallons of blood daily.' },
    { question: 'What is the most abundant gas in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Argon', 'Nitrogen'], correctIndex: 3, category: 'science', funFact: 'Nitrogen makes up about 78% of the air we breathe — yet most living things cannot use it directly.' },
    { question: 'Who proposed the theory of general relativity?', options: ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Stephen Hawking'], correctIndex: 1, category: 'science', funFact: 'Einstein published his general theory of relativity in 1915. It transformed our understanding of gravity and space-time.' },
  ],
  nature: [
    { question: 'What is the tallest type of tree?', options: ['Oak', 'Redwood', 'Pine', 'Maple'], correctIndex: 1, category: 'nature', funFact: 'The tallest known redwood stands over 380 feet tall.' },
    { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctIndex: 2, category: 'nature', funFact: 'The Pacific Ocean is larger than all of Earth\'s land area combined.' },
    { question: 'How many hearts does an octopus have?', options: ['One', 'Two', 'Three', 'Four'], correctIndex: 2, category: 'nature', funFact: 'Two hearts pump blood to the gills, and one pumps it to the rest of the body.' },
    { question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Horse', 'Antelope'], correctIndex: 1, category: 'nature', funFact: 'Cheetahs can reach 70 mph, but only in short bursts.' },
    { question: 'Which bird is known for having the longest migration?', options: ['Albatross', 'Arctic Tern', 'Swallow', 'Goose'], correctIndex: 1, category: 'nature', funFact: 'The Arctic tern travels from pole to pole — up to 50,000 miles each year.' },
    { question: 'What is the largest land animal?', options: ['Giraffe', 'Hippopotamus', 'African Elephant', 'White Rhinoceros'], correctIndex: 2, category: 'nature', funFact: 'African elephants can weigh up to 13,000 pounds and live for 60–70 years in the wild.' },
    { question: 'How long does it take light from the Sun to reach Earth?', options: ['2 minutes', '8 minutes', '20 minutes', '1 hour'], correctIndex: 1, category: 'nature', funFact: 'Sunlight takes about 8 minutes and 20 seconds to travel 93 million miles to Earth.' },
    { question: 'What is the world\'s largest rainforest?', options: ['Congo Basin', 'Amazon', 'Daintree', 'Borneo'], correctIndex: 1, category: 'nature', funFact: 'The Amazon rainforest produces 20% of the world\'s oxygen and is home to 10% of all species on Earth.' },
    { question: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correctIndex: 1, category: 'nature', funFact: 'All spiders have 8 legs — which distinguishes them from insects, which have 6.' },
    { question: 'What do bees make from flower nectar?', options: ['Wax', 'Pollen', 'Honey', 'Propolis'], correctIndex: 2, category: 'nature', funFact: 'A single honeybee produces only about one teaspoon of honey in its entire lifetime.' },
  ],
  music: [
    { question: 'How many keys does a standard piano have?', options: ['76', '82', '88', '92'], correctIndex: 2, category: 'music', funFact: 'The piano has 52 white keys and 36 black keys.' },
    { question: 'Who composed "The Four Seasons"?', options: ['Mozart', 'Vivaldi', 'Bach', 'Handel'], correctIndex: 1, category: 'music', funFact: 'Vivaldi composed it around 1723 — one of the most popular pieces of classical music ever.' },
    { question: 'What musical term means "gradually getting louder"?', options: ['Diminuendo', 'Crescendo', 'Staccato', 'Legato'], correctIndex: 1, category: 'music', funFact: 'Crescendo comes from the Italian word meaning "to grow."' },
    { question: 'Which decade saw the birth of rock and roll?', options: ['1940s', '1950s', '1960s', '1970s'], correctIndex: 1, category: 'music', funFact: 'Elvis Presley and Chuck Berry helped define the genre in the 1950s.' },
    { question: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '8'], correctIndex: 2, category: 'music', funFact: 'A standard guitar has 6 strings, though bass guitars typically have 4.' },
    { question: 'Which composer wrote the "Moonlight Sonata"?', options: ['Mozart', 'Chopin', 'Beethoven', 'Schubert'], correctIndex: 2, category: 'music', funFact: 'Beethoven composed the Moonlight Sonata in 1801. He was already losing his hearing at the time.' },
    { question: 'What is the lowest male singing voice called?', options: ['Tenor', 'Baritone', 'Bass', 'Alto'], correctIndex: 2, category: 'music', funFact: 'Bass voices can reach extraordinarily low notes — the lowest recorded note sung by a human is G0.' },
    { question: 'Who was known as the "King of Jazz"?', options: ['Duke Ellington', 'Louis Armstrong', 'Miles Davis', 'Paul Whiteman'], correctIndex: 3, category: 'music', funFact: 'Paul Whiteman was called the "King of Jazz" in the 1920s, though Louis Armstrong is now considered its true master.' },
    { question: 'How many musicians are in a string quartet?', options: ['3', '4', '5', '6'], correctIndex: 1, category: 'music', funFact: 'A string quartet consists of two violinists, one violist, and one cellist.' },
    { question: 'Which instrument has black and white keys and pedals?', options: ['Organ', 'Harpsichord', 'Piano', 'Accordion'], correctIndex: 2, category: 'music', funFact: 'The modern piano was invented around 1700 by Bartolomeo Cristofori — he called it "un cimbalo di cipresso di piano e forte."' },
  ],
  cooking: [
    { question: 'What is the main ingredient in guacamole?', options: ['Tomato', 'Avocado', 'Onion', 'Lime'], correctIndex: 1, category: 'cooking', funFact: 'The Aztecs first made guacamole in the 16th century.' },
    { question: 'Which spice is the most expensive by weight?', options: ['Vanilla', 'Saffron', 'Cinnamon', 'Cardamom'], correctIndex: 1, category: 'cooking', funFact: 'Saffron is made from crocus flower stigmas — each flower produces only three strands.' },
    { question: 'What is the Italian phrase for "cooked to the tooth"?', options: ['Alfredo', 'Al dente', 'Antipasto', 'Aglio'], correctIndex: 1, category: 'cooking', funFact: 'Al dente pasta should be firm when bitten — not soft or crunchy.' },
    { question: 'What temperature does water boil at sea level?', options: ['180°F', '200°F', '212°F', '220°F'], correctIndex: 2, category: 'cooking', funFact: 'At higher altitudes, water boils at a lower temperature.' },
    { question: 'Which herb is used to make traditional pesto?', options: ['Parsley', 'Oregano', 'Basil', 'Thyme'], correctIndex: 2, category: 'cooking', funFact: 'Classic Genovese pesto uses fresh basil, pine nuts, Parmesan, garlic, and olive oil — traditionally pounded with a mortar and pestle.' },
    { question: 'What does "sauté" mean in French cooking?', options: ['To boil', 'To jump', 'To simmer', 'To roast'], correctIndex: 1, category: 'cooking', funFact: 'From the French word "sauter" (to jump) — you toss food quickly in a hot pan with a little fat.' },
    { question: 'Which country gave us croissants?', options: ['France', 'Austria', 'Switzerland', 'Belgium'], correctIndex: 1, category: 'cooking', funFact: 'The croissant was actually created in Vienna, Austria, but it was perfected and popularised in France.' },
    { question: 'What is the key ingredient that makes bread rise?', options: ['Salt', 'Sugar', 'Yeast', 'Baking powder'], correctIndex: 2, category: 'cooking', funFact: 'Yeast is a living organism — it eats sugars and releases carbon dioxide gas, which creates bubbles that make bread light and airy.' },
    { question: 'What is umami?', options: ['A Japanese spice', 'A fifth basic taste', 'A cooking technique', 'A type of seaweed'], correctIndex: 1, category: 'cooking', funFact: 'Umami (meaning "pleasant savoury taste") was identified as a distinct fifth taste by Japanese scientist Kikunae Ikeda in 1908.' },
    { question: 'Which oil is traditionally used in Italian cooking?', options: ['Sunflower oil', 'Canola oil', 'Olive oil', 'Sesame oil'], correctIndex: 2, category: 'cooking', funFact: 'Olive oil has been used in Mediterranean cooking for at least 6,000 years. Extra virgin olive oil is the highest quality grade.' },
  ],
  sports: [
    { question: 'How many players are on a baseball team?', options: ['7', '9', '11', '13'], correctIndex: 1, category: 'sports', funFact: 'Baseball has been played professionally in America since 1869.' },
    { question: 'How long is a marathon race?', options: ['20 miles', '24 miles', '26.2 miles', '30 miles'], correctIndex: 2, category: 'sports', funFact: 'The distance was standardized at the 1908 London Olympics.' },
    { question: 'What sport uses the term "love" for zero?', options: ['Badminton', 'Tennis', 'Squash', 'Table Tennis'], correctIndex: 1, category: 'sports', funFact: 'The term may come from the French "l\'oeuf" meaning egg, shaped like a zero.' },
    { question: 'Which country invented the game of cricket?', options: ['Australia', 'India', 'England', 'South Africa'], correctIndex: 2, category: 'sports', funFact: 'Cricket dates back to the 16th century in England.' },
    { question: 'How many players are on a basketball team on the court?', options: ['4', '5', '6', '7'], correctIndex: 1, category: 'sports', funFact: 'Basketball was invented in 1891 by Dr. James Naismith in Springfield, Massachusetts.' },
    { question: 'Which country has won the most FIFA World Cup titles?', options: ['Germany', 'Argentina', 'Italy', 'Brazil'], correctIndex: 3, category: 'sports', funFact: 'Brazil has won the World Cup five times (1958, 1962, 1970, 1994, 2002) — more than any other nation.' },
    { question: 'In golf, what is a score of two under par called?', options: ['Birdie', 'Eagle', 'Albatross', 'Bogey'], correctIndex: 1, category: 'sports', funFact: 'An eagle (2 under par) is rarer than a birdie (1 under). A condor (4 under) is almost unheard of.' },
    { question: 'How many Grand Slam tournaments are there in tennis?', options: ['2', '3', '4', '5'], correctIndex: 2, category: 'sports', funFact: 'The four Grand Slams are the Australian Open, French Open (Roland Garros), Wimbledon, and US Open.' },
    { question: 'What is the national sport of Japan?', options: ['Judo', 'Karate', 'Sumo', 'Kendo'], correctIndex: 2, category: 'sports', funFact: 'Sumo wrestling has been practiced in Japan for over 1,500 years and is deeply rooted in Shinto ritual.' },
    { question: 'How many holes are on a standard golf course?', options: ['9', '12', '18', '24'], correctIndex: 2, category: 'sports', funFact: 'The 18-hole standard was set by the Royal and Ancient Golf Club of St Andrews in 1764.' },
  ],
  travel: [
    { question: 'In which city is the Eiffel Tower located?', options: ['Rome', 'London', 'Paris', 'Berlin'], correctIndex: 2, category: 'travel', funFact: 'The Eiffel Tower was built for the 1889 World\'s Fair and was originally intended to be dismantled after 20 years.' },
    { question: 'What is the capital city of Australia?', options: ['Sydney', 'Melbourne', 'Brisbane', 'Canberra'], correctIndex: 3, category: 'travel', funFact: 'Canberra was purpose-built as a compromise between Sydney and Melbourne, becoming the capital in 1913.' },
    { question: 'The Colosseum is in which city?', options: ['Athens', 'Rome', 'Naples', 'Florence'], correctIndex: 1, category: 'travel', funFact: 'Built between 70–80 AD, the Colosseum could hold up to 80,000 spectators — similar to modern stadiums.' },
    { question: 'Which river flows through Egypt and into the Mediterranean Sea?', options: ['Amazon', 'Congo', 'Nile', 'Zambezi'], correctIndex: 2, category: 'travel', funFact: 'The Nile is often considered the world\'s longest river at 4,130 miles — though some measurements give that title to the Amazon.' },
    { question: 'On which continent is the Sahara Desert?', options: ['Asia', 'Australia', 'Africa', 'South America'], correctIndex: 2, category: 'travel', funFact: 'The Sahara is the world\'s largest hot desert, but Antarctica is the world\'s largest desert overall.' },
    { question: 'What is the most visited city in the world?', options: ['New York', 'London', 'Bangkok', 'Paris'], correctIndex: 2, category: 'travel', funFact: 'Bangkok has consistently ranked as the world\'s most visited city, welcoming over 20 million international visitors annually before the pandemic.' },
    { question: 'Which country has the most UNESCO World Heritage Sites?', options: ['China', 'Italy', 'Spain', 'France'], correctIndex: 1, category: 'travel', funFact: 'Italy leads with 58 UNESCO World Heritage Sites, including the historic centres of Rome, Florence, and Venice.' },
    { question: 'The Grand Canyon is located in which US state?', options: ['Colorado', 'Utah', 'Nevada', 'Arizona'], correctIndex: 3, category: 'travel', funFact: 'The Grand Canyon is 277 miles long and up to 18 miles wide, carved by the Colorado River over millions of years.' },
    { question: 'What is the longest wall in the world?', options: ['Hadrian\'s Wall', 'Great Wall of China', 'Berlin Wall', 'Western Wall'], correctIndex: 1, category: 'travel', funFact: 'The Great Wall of China stretches over 13,000 miles when all its branches are counted.' },
    { question: 'Which city is known as "The City of Canals"?', options: ['Amsterdam', 'Venice', 'Bangkok', 'Copenhagen'], correctIndex: 1, category: 'travel', funFact: 'Venice is built on 118 small islands connected by about 400 bridges over 150 canals.' },
  ],
  literature: [
    { question: 'Who wrote "Pride and Prejudice"?', options: ['Charlotte Bronte', 'Jane Austen', 'George Eliot', 'Emily Bronte'], correctIndex: 1, category: 'literature', funFact: 'Jane Austen published "Pride and Prejudice" in 1813 under the name "A Lady." It remains one of the best-selling novels of all time.' },
    { question: 'In which Shakespeare play do we find the character Hamlet?', options: ['Macbeth', 'Othello', 'Hamlet', 'King Lear'], correctIndex: 2, category: 'literature', funFact: 'Hamlet is Shakespeare\'s longest play. The famous "To be or not to be" soliloquy is one of the most quoted passages in the English language.' },
    { question: 'Who wrote "The Old Man and the Sea"?', options: ['John Steinbeck', 'Ernest Hemingway', 'F. Scott Fitzgerald', 'William Faulkner'], correctIndex: 1, category: 'literature', funFact: '"The Old Man and the Sea" (1952) won Hemingway the Pulitzer Prize and helped earn him the Nobel Prize for Literature in 1954.' },
    { question: 'What is the name of the whale in "Moby-Dick"?', options: ['Moby', 'Pequod', 'Ahab', 'The whale is called Moby Dick'], correctIndex: 3, category: 'literature', funFact: 'The whale is called "Moby Dick" (with a space) — the ship is the Pequod, and the obsessed captain is Ahab.' },
    { question: 'Who wrote "1984"?', options: ['Aldous Huxley', 'Ray Bradbury', 'George Orwell', 'H.G. Wells'], correctIndex: 2, category: 'literature', funFact: 'George Orwell wrote "1984" in 1948 — note the reversed last two digits of the year in the title.' },
    { question: 'In "To Kill a Mockingbird," what is the narrator\'s name?', options: ['Atticus', 'Scout', 'Jem', 'Dill'], correctIndex: 1, category: 'literature', funFact: '"Scout" Finch\'s real name is Jean Louise. Harper Lee based the story partly on her own childhood in Alabama.' },
    { question: 'Who wrote the "Sherlock Holmes" stories?', options: ['Agatha Christie', 'Arthur Conan Doyle', 'Raymond Chandler', 'G.K. Chesterton'], correctIndex: 1, category: 'literature', funFact: 'Doyle grew so tired of Holmes that he killed him off in 1893, but public outcry forced him to bring the detective back.' },
    { question: 'Which poet wrote "The Road Not Taken"?', options: ['Walt Whitman', 'Emily Dickinson', 'Robert Frost', 'Carl Sandburg'], correctIndex: 2, category: 'literature', funFact: 'Robert Frost wrote it in 1916. The poem is often misread as celebrating individualism — Frost said it was actually a gentle joke about a friend who was indecisive.' },
    { question: 'What is the first book of the Bible?', options: ['Exodus', 'Psalms', 'Genesis', 'Proverbs'], correctIndex: 2, category: 'literature', funFact: 'Genesis contains the creation story, the story of Noah\'s Ark, and the accounts of the patriarchs Abraham, Isaac, and Jacob.' },
    { question: 'Who wrote "Don Quixote"?', options: ['Cervantes', 'Lope de Vega', 'Dante', 'Voltaire'], correctIndex: 0, category: 'literature', funFact: 'Published in two parts in 1605 and 1615, Don Quixote is often called the world\'s first modern novel.' },
  ],
  animals: [
    { question: 'What is the largest land animal?', options: ['Giraffe', 'Hippopotamus', 'African Elephant', 'White Rhino'], correctIndex: 2, category: 'animals', funFact: 'African elephants can weigh up to 14,000 pounds. They\'re also among the most intelligent animals, showing grief, memory, and self-recognition.' },
    { question: 'How many eyes does a bee have?', options: ['2', '4', '5', '6'], correctIndex: 2, category: 'animals', funFact: 'Bees have five eyes — two large compound eyes and three simple eyes (ocelli) on top of their heads.' },
    { question: 'What is a group of lions called?', options: ['Pack', 'Herd', 'Pride', 'Colony'], correctIndex: 2, category: 'animals', funFact: 'A pride typically contains 10–15 lions. Female lions do most of the hunting, while males protect the territory.' },
    { question: 'Which mammal can fly?', options: ['Flying squirrel', 'Flying fish', 'Bat', 'Sugar glider'], correctIndex: 2, category: 'animals', funFact: 'Bats are the only mammals capable of true, sustained flight. There are over 1,400 species of bats.' },
    { question: 'How long is an elephant\'s pregnancy?', options: ['6 months', '12 months', '18 months', '22 months'], correctIndex: 3, category: 'animals', funFact: 'At 22 months, elephants have the longest pregnancy of any land animal. Calves are born able to walk within hours.' },
    { question: 'What do you call a baby kangaroo?', options: ['Cub', 'Joey', 'Foal', 'Kit'], correctIndex: 1, category: 'animals', funFact: 'A joey is born incredibly small — about the size of a jellybean — and crawls into its mother\'s pouch to continue developing.' },
    { question: 'Which bird can mimic human speech most accurately?', options: ['Macaw', 'African Grey Parrot', 'Cockatoo', 'Myna Bird'], correctIndex: 1, category: 'animals', funFact: 'African Grey Parrots can learn hundreds of words and have demonstrated the ability to use language meaningfully.' },
    { question: 'What is the fastest fish in the ocean?', options: ['Tuna', 'Mako Shark', 'Swordfish', 'Sailfish'], correctIndex: 3, category: 'animals', funFact: 'The sailfish can reach speeds of 68 mph, aided by its remarkable dorsal fin which it can fold flat to reduce drag.' },
    { question: 'How many legs does an insect have?', options: ['4', '6', '8', '10'], correctIndex: 1, category: 'animals', funFact: 'All insects have exactly 6 legs. This distinguishes them from spiders (8 legs) and crustaceans (10 legs).' },
    { question: 'What is the name for a group of dolphins?', options: ['School', 'Pod', 'Shoal', 'Fleet'], correctIndex: 1, category: 'animals', funFact: 'Dolphins live in pods of up to several hundred individuals. They are among the most socially complex animals.' },
  ],
  art: [
    { question: 'Who painted the Sistine Chapel ceiling?', options: ['Leonardo da Vinci', 'Raphael', 'Michelangelo', 'Botticelli'], correctIndex: 2, category: 'art', funFact: 'Michelangelo painted it lying on scaffolding from 1508 to 1512. He reportedly hated the project but produced one of history\'s greatest artworks.' },
    { question: 'In which museum is the Mona Lisa displayed?', options: ['Uffizi Gallery', 'The Metropolitan Museum', 'The Louvre', 'Prado Museum'], correctIndex: 2, category: 'art', funFact: 'The Mona Lisa is surprisingly small — just 30 x 21 inches — yet it attracts about 10 million visitors a year at the Louvre.' },
    { question: 'Which artist cut off part of his own ear?', options: ['Paul Gauguin', 'Vincent van Gogh', 'Paul Cézanne', 'Georges Seurat'], correctIndex: 1, category: 'art', funFact: 'Van Gogh cut off part of his ear during a mental breakdown in 1888. He created over 900 paintings in his lifetime, yet sold only one while alive.' },
    { question: 'What style of painting is characterised by small dabs of pure colour?', options: ['Cubism', 'Surrealism', 'Impressionism', 'Fauvism'], correctIndex: 2, category: 'art', funFact: 'Impressionism was initially a term of mockery — it came from a critic\'s jab at Monet\'s "Impression, Sunrise."' },
    { question: 'Who created the sculpture "The Thinker"?', options: ['Bernini', 'Rodin', 'Brancusi', 'Donatello'], correctIndex: 1, category: 'art', funFact: 'Auguste Rodin created The Thinker in 1880 as part of a larger work called The Gates of Hell. There are over 20 full-size castings worldwide.' },
    { question: 'Which Spanish artist co-founded Cubism?', options: ['Salvador Dali', 'Joan Miro', 'Pablo Picasso', 'Francisco Goya'], correctIndex: 2, category: 'art', funFact: 'Picasso and Georges Braque developed Cubism around 1907–1914. Picasso\'s "Les Demoiselles d\'Avignon" (1907) is often cited as the movement\'s starting point.' },
    { question: 'What does "Renaissance" mean in Italian?', options: ['New world', 'Rebirth', 'Awakening', 'Revolution'], correctIndex: 1, category: 'art', funFact: 'The Renaissance (14th–17th centuries) saw a revival of classical Greek and Roman ideas in art, science, and philosophy.' },
    { question: 'Which colour is made by mixing red and blue?', options: ['Green', 'Orange', 'Purple', 'Brown'], correctIndex: 2, category: 'art', funFact: 'Purple has historically been associated with royalty because purple dye was incredibly expensive — made from sea snails in ancient times.' },
    { question: 'What is the art of paper folding called?', options: ['Calligraphy', 'Ikebana', 'Origami', 'Haiku'], correctIndex: 2, category: 'art', funFact: 'Origami originated in Japan in the 6th century. The word comes from "oru" (to fold) and "kami" (paper).' },
    { question: 'Who painted "The Starry Night"?', options: ['Claude Monet', 'Paul Gauguin', 'Vincent van Gogh', 'Edvard Munch'], correctIndex: 2, category: 'art', funFact: 'Van Gogh painted "The Starry Night" in June 1889 while staying at an asylum in Saint-Rémy-de-Provence. It now hangs in MoMA, New York.' },
  ],
  puzzles: [
    { question: 'A clock shows 3:15. What is the angle between the hour and minute hands?', options: ['0 degrees', '7.5 degrees', '15 degrees', '22.5 degrees'], correctIndex: 1, category: 'puzzles', funFact: 'At 3:15, the minute hand is exactly at 3, but the hour hand has moved 1/4 of the way from 3 to 4 — that\'s 7.5 degrees.' },
    { question: 'If you have 3 apples and take away 2, how many do YOU have?', options: ['1', '2', '3', '5'], correctIndex: 1, category: 'puzzles', funFact: 'You took 2 apples, so you have 2! The 1 remaining apple stays in the original pile.' },
    { question: 'What comes once in a minute, twice in a moment, but never in a thousand years?', options: ['The letter M', 'The number 1', 'A heartbeat', 'Silence'], correctIndex: 0, category: 'puzzles', funFact: 'The letter M appears once in "minute," twice in "moment," and not at all in "thousand years."' },
    { question: 'How many months have 28 days?', options: ['1', '3', '6', '12'], correctIndex: 3, category: 'puzzles', funFact: 'All 12 months have at least 28 days! February just happens to have only 28 (or 29 in a leap year).' },
    { question: 'What can run but never walks, has a mouth but never talks?', options: ['A clock', 'A river', 'A train', 'The wind'], correctIndex: 1, category: 'puzzles', funFact: 'A river "runs" to the sea, has a "mouth" where it enters the sea, and "banks" on each side — but it can do none of these literally.' },
    { question: 'If you rearrange the letters "CIFAIPC," what ocean do you get?', options: ['Arctic', 'Atlantic', 'Indian', 'Pacific'], correctIndex: 3, category: 'puzzles', funFact: 'CIFAIPC unscrambles to PACIFIC — the world\'s largest ocean, covering more area than all land combined.' },
    { question: 'A father is 30 years older than his son. In 5 years he will be 3 times as old. How old is the son now?', options: ['5', '10', '15', '20'], correctIndex: 0, category: 'puzzles', funFact: 'Son is 5, father is 35. In 5 years: son is 10, father is 40. 40 = 3 × 10. Solved!' },
    { question: 'Which is heavier — a pound of feathers or a pound of gold?', options: ['Gold', 'Feathers', 'They weigh the same', 'It depends'], correctIndex: 2, category: 'puzzles', funFact: 'They both weigh a pound! However, gold is measured in troy pounds (12 oz) while feathers use avoirdupois pounds (16 oz) — so a pound of feathers is technically heavier.' },
    { question: 'The more you take, the more you leave behind. What is it?', options: ['Time', 'Money', 'Footsteps', 'Memories'], correctIndex: 2, category: 'puzzles', funFact: 'Each step you take leaves a footprint behind, and taking more steps means leaving more footprints.' },
    { question: 'What has keys but no locks, space but no room, and you can enter but can\'t go inside?', options: ['A piano', 'A keyboard', 'A map', 'A dictionary'], correctIndex: 1, category: 'puzzles', funFact: 'A keyboard has "keys," a "space" bar, and an "enter" key — but none of these are literal keys, spaces, or entrances.' },
  ],
  current_events: [
    { question: 'Which technology company created the AI assistant ChatGPT?', options: ['Google', 'Meta', 'OpenAI', 'Microsoft'], correctIndex: 2, category: 'current_events', funFact: 'OpenAI launched ChatGPT in November 2022. It reached 1 million users in just 5 days — the fastest-growing consumer app in history at the time.' },
    { question: 'What is the name of the world\'s most powerful space telescope, launched in 2021?', options: ['Hubble', 'James Webb', 'Chandra', 'Spitzer'], correctIndex: 1, category: 'current_events', funFact: 'The James Webb Space Telescope can see galaxies formed just 200 million years after the Big Bang — nearly 13.5 billion years ago.' },
    { question: 'Which country hosted the 2022 FIFA World Cup?', options: ['Brazil', 'Russia', 'Qatar', 'Saudi Arabia'], correctIndex: 2, category: 'current_events', funFact: 'Qatar 2022 was the first World Cup held in the Middle East and the last with 32 teams — the 2026 edition expands to 48 teams.' },
    { question: 'What does "AI" stand for?', options: ['Automated Interface', 'Artificial Intelligence', 'Advanced Integration', 'Automated Inference'], correctIndex: 1, category: 'current_events', funFact: 'The term "artificial intelligence" was coined in 1956 by John McCarthy. Today AI powers everything from phone assistants to medical diagnostics.' },
    { question: 'Which company launched the first fully civilian spaceflight in 2021?', options: ['NASA', 'Virgin Galactic', 'SpaceX', 'Blue Origin'], correctIndex: 2, category: 'current_events', funFact: 'SpaceX\'s Inspiration4 mission in September 2021 was the first all-civilian orbital spaceflight, with no professional astronauts aboard.' },
    { question: 'What is the name of the climate accord signed in Paris in 2015?', options: ['Kyoto Protocol', 'Paris Agreement', 'Copenhagen Accord', 'Montreal Protocol'], correctIndex: 1, category: 'current_events', funFact: 'The Paris Agreement aims to limit global warming to 1.5–2°C above pre-industrial levels. 196 parties have signed it.' },
    { question: 'Which streaming service had the most subscribers worldwide as of 2023?', options: ['Disney+', 'Amazon Prime Video', 'Netflix', 'HBO Max'], correctIndex: 2, category: 'current_events', funFact: 'Netflix reached 260 million subscribers by 2023, though competition from Disney+, Amazon, and Apple has intensified dramatically.' },
    { question: 'What is the term for working from home using technology?', options: ['Telecommuting', 'Freelancing', 'Outsourcing', 'Crowdsourcing'], correctIndex: 0, category: 'current_events', funFact: 'Telecommuting existed before the pandemic, but COVID-19 caused the largest remote work experiment in history — and permanently changed how millions of people work.' },
    { question: 'Which planet did NASA\'s Perseverance rover land on in 2021?', options: ['Venus', 'Mars', 'Europa', 'Titan'], correctIndex: 1, category: 'current_events', funFact: 'Perseverance landed in Jezero Crater, an ancient lake bed, and has been collecting rock samples that may one day be returned to Earth for analysis.' },
    { question: 'What is "blockchain" most commonly associated with?', options: ['Social media', 'Cryptocurrency', 'Streaming services', 'Cloud storage'], correctIndex: 1, category: 'current_events', funFact: 'Blockchain is a distributed digital ledger that records transactions across many computers. Bitcoin, launched in 2009, was the first major cryptocurrency to use it.' },
  ],
  general: [
    { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2, category: 'general', funFact: 'The seven continents together make up about 29% of Earth\'s surface.' },
    { question: 'What is the largest mammal on Earth?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], correctIndex: 1, category: 'general', funFact: 'Blue whales can grow up to 100 feet long.' },
    { question: 'What year did humans first walk on the Moon?', options: ['1965', '1967', '1969', '1971'], correctIndex: 2, category: 'general', funFact: 'Neil Armstrong took the famous first step on July 20, 1969.' },
    { question: 'What color do you get mixing blue and yellow?', options: ['Orange', 'Green', 'Purple', 'Brown'], correctIndex: 1, category: 'general', funFact: 'Blue and yellow are primary colors that combine to form green.' },
    { question: 'How many days are in a leap year?', options: ['364', '365', '366', '367'], correctIndex: 2, category: 'general', funFact: 'A leap year has 366 days — the extra day is added to February to keep our calendar aligned with Earth\'s orbit.' },
    { question: 'What is the largest country in the world by area?', options: ['China', 'Canada', 'United States', 'Russia'], correctIndex: 3, category: 'general', funFact: 'Russia covers about 6.6 million square miles — nearly twice the size of the second-largest country, Canada.' },
    { question: 'How many letters are in the English alphabet?', options: ['24', '25', '26', '27'], correctIndex: 2, category: 'general', funFact: 'The English alphabet has 26 letters. The alphabet we use today was largely established by the 15th century.' },
    { question: 'What is the currency of Japan?', options: ['Yuan', 'Won', 'Yen', 'Baht'], correctIndex: 2, category: 'general', funFact: 'The yen has been Japan\'s currency since 1871. The word "yen" means "round object" in Japanese.' },
    { question: 'How many sides does a pentagon have?', options: ['4', '5', '6', '7'], correctIndex: 1, category: 'general', funFact: 'The Pentagon building in Virginia was named for its five-sided shape. It\'s one of the world\'s largest office buildings.' },
    { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctIndex: 2, category: 'general', funFact: 'Mercury is the smallest planet and closest to the Sun — yet it\'s not the hottest. That title belongs to Venus, whose thick atmosphere traps heat.' },
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
