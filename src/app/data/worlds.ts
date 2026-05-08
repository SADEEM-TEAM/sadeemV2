export type WorldId = 'math' | 'history' | 'deen' | 'manners' | 'art';
export type GameType = 'counting' | 'addition' | 'shapes' | 'quiz' | 'ordering' | 'story_choice' | 'puzzle';

export interface LessonSlide {
  emoji: string;
  title: string;
  text: string;
}

export interface QuizOption {
  emoji?: string;
  text: string;
  correct?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface OrderingItem {
  id: number;
  emoji: string;
  label: string;
}

export interface StoryScene {
  situation: string;
  mascotSays: string;
  choices: { emoji: string; text: string; isCorrect: boolean; response: string }[];
}

export interface Level {
  id: number;
  title: string;
  emoji: string;
  gemReward: number;
  lesson: LessonSlide[];
  gameType: GameType;
  quiz?: QuizQuestion[];
  orderingItems?: OrderingItem[];
  storyScene?: StoryScene;
  badgeReward?: string;
}

export interface World {
  id: WorldId;
  name: string;
  nameAr: string;
  description: string;
  emoji: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  textColor: string;
  levels: Level[];
}

export const WORLDS: World[] = [
  {
    id: 'math',
    name: 'Math Garden',
    nameAr: 'حديقة الأرقام',
    description: 'Count, add & explore!',
    emoji: '🌱',
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.4)',
    bgGradient: 'from-[#064e3b] via-[#065f46] to-[#0f2922]',
    textColor: '#86efac',
    levels: [
      {
        id: 1,
        title: 'Counting Garden',
        emoji: '🍎',
        gemReward: 20,
        gameType: 'counting',
        lesson: [
          { emoji: '🍎🍎🍎', title: 'Counting Apples!', text: 'When we count, we touch each fruit one by one. 1... 2... 3! Three apples!' },
          { emoji: '🍌🍌🍌🍌🍌', title: 'Count the Bananas!', text: 'Can you count with me? 1, 2, 3, 4, 5! Yes! Five bananas! Great job!' },
          { emoji: '⭐🌟✨', title: "You're a Star Counter!", text: 'Now you know how to count fruits! Ready to play the counting game?' },
        ],
        quiz: [
          { question: 'How many 🍊 oranges?', options: [{ text: '3' }, { text: '5' }, { text: '4', correct: true }, { text: '2' }] },
          { question: 'How many 🍇 grapes?', options: [{ text: '6', correct: true }, { text: '4' }, { text: '7' }, { text: '5' }] },
        ],
        badgeReward: '🧮 Counter Star',
      },
      {
        id: 2,
        title: 'Addition Market',
        emoji: '🛒',
        gemReward: 25,
        gameType: 'addition',
        lesson: [
          { emoji: '🍎+🍎', title: 'Adding Fruits!', text: 'If you have 2 apples and get 1 more, you have 3 apples! Adding means putting together.' },
          { emoji: '🛒🍊🍌', title: 'Help Sadeen Shop!', text: 'Sadeen has 3 oranges 🍊 and buys 2 bananas 🍌. How many fruits total? 3 + 2 = 5!' },
          { emoji: '🎉', title: "Let's Play!", text: "You understand addition! Let's practice adding fruits together at the market!" },
        ],
        quiz: [
          { question: '3 🍎 + 2 🍎 = ?', options: [{ text: '4' }, { text: '5', correct: true }, { text: '6' }, { text: '3' }] },
          { question: '1 🍌 + 4 🍌 = ?', options: [{ text: '6' }, { text: '4' }, { text: '5', correct: true }, { text: '3' }] },
        ],
        badgeReward: '➕ Addition Hero',
      },
      {
        id: 3,
        title: 'Shapes Island',
        emoji: '🔷',
        gemReward: 30,
        gameType: 'shapes',
        lesson: [
          { emoji: '⬛🔴🔷', title: 'Shapes are Everywhere!', text: 'Look around! Squares, circles, and triangles are everywhere! A door is a rectangle. The sun is a circle!' },
          { emoji: '🏠', title: 'Build with Shapes!', text: 'A house has a square body and a triangle roof. We use shapes to build things!' },
          { emoji: '🎨', title: 'Shape Artist!', text: "Now let's play! Can you identify the shapes? You'll be a shape expert!" },
        ],
        quiz: [
          { question: 'Which shape has 3 sides?', options: [{ emoji: '⬛', text: 'Square' }, { emoji: '🔺', text: 'Triangle', correct: true }, { emoji: '⭕', text: 'Circle' }, { emoji: '🔷', text: 'Diamond' }] },
          { question: 'Which shape has 0 corners?', options: [{ emoji: '🔺', text: 'Triangle' }, { emoji: '⬛', text: 'Square' }, { emoji: '⭕', text: 'Circle', correct: true }, { emoji: '🔷', text: 'Rectangle' }] },
        ],
        badgeReward: '🔷 Shape Master',
      },
    ],
  },
  {
    id: 'history',
    name: 'History Desert',
    nameAr: 'صحراء التاريخ',
    description: 'Travel through time!',
    emoji: '🏺',
    color: '#f97316',
    glowColor: 'rgba(249,115,22,0.4)',
    bgGradient: 'from-[#431407] via-[#7c2d12] to-[#1c0a03]',
    textColor: '#fed7aa',
    levels: [
      {
        id: 1,
        title: 'Ancient Algeria',
        emoji: '🐴',
        gemReward: 25,
        gameType: 'quiz',
        lesson: [
          { emoji: '🏺🏛️', title: 'Ancient Algeria!', text: 'Long, long ago — before your grandparents were born — Algeria had mighty kings and brave warriors!' },
          { emoji: '🐴👑', title: 'King Massinissa!', text: 'King Massinissa was a great Numidian king. He was famous for his amazing horse riders. They were the fastest in the world!' },
          { emoji: '🏛️⭐', title: 'Numidian Wonders!', text: 'The Numidians built cities and monuments in the desert. The Medracen tomb still stands today in Algeria!' },
        ],
        quiz: [
          { question: 'What animal were Numidians famous for?', options: [{ emoji: '🐪', text: 'Camel' }, { emoji: '🐴', text: 'Horse', correct: true }, { emoji: '🐟', text: 'Fish' }, { emoji: '🦁', text: 'Lion' }] },
          { question: 'What was Massinissa?', options: [{ emoji: '👨‍🌾', text: 'Farmer' }, { emoji: '⚓', text: 'Sailor' }, { emoji: '👑', text: 'King', correct: true }, { emoji: '👨‍🍳', text: 'Cook' }] },
          { question: 'Where did Numidians live?', options: [{ emoji: '🏝️', text: 'Islands' }, { emoji: '❄️', text: 'Snow' }, { emoji: '🌊', text: 'The sea' }, { emoji: '🏜️', text: 'The desert', correct: true }] },
        ],
        badgeReward: '🏺 Little Historian',
      },
      {
        id: 2,
        title: 'Islamic Algeria',
        emoji: '🕌',
        gemReward: 30,
        gameType: 'quiz',
        lesson: [
          { emoji: '🕌✨', title: 'Islam Arrives!', text: 'Many centuries ago, Islam came to Algeria. People built beautiful mosques and learned science and art.' },
          { emoji: '📚🔬', title: 'Science & Culture!', text: 'Muslim scholars in Algeria taught mathematics, astronomy, and medicine. They were scientists!' },
          { emoji: '🏛️🌙', title: 'Beautiful Mosques!', text: 'The Great Mosque of Tlemcen is one of the most beautiful mosques in Algeria, built over 900 years ago!' },
        ],
        quiz: [
          { question: 'What did Muslim scholars study?', options: [{ emoji: '🔬', text: 'Science', correct: true }, { emoji: '🎮', text: 'Video games' }, { emoji: '🏈', text: 'Football' }, { emoji: '🍕', text: 'Pizza' }] },
          { question: 'What do Muslims build for prayer?', options: [{ emoji: '🏰', text: 'Castle' }, { emoji: '🕌', text: 'Mosque', correct: true }, { emoji: '🏪', text: 'Shop' }, { emoji: '🏫', text: 'School' }] },
        ],
        badgeReward: '🕌 History Explorer',
      },
      {
        id: 3,
        title: 'The Casbah',
        emoji: '🏰',
        gemReward: 35,
        gameType: 'quiz',
        lesson: [
          { emoji: '🏙️🌊', title: 'The White City!', text: 'Algiers, the capital of Algeria, has a beautiful old city called the Casbah. It is UNESCO World Heritage!' },
          { emoji: '🏠🏠🏠', title: 'Casbah Streets!', text: 'The Casbah has narrow winding streets with beautiful white houses. It is like a magical maze!' },
          { emoji: '⭐🇩🇿', title: 'Our Heritage!', text: 'The Casbah is one of Algeria\'s greatest treasures. We must protect and love our heritage!' },
        ],
        quiz: [
          { question: 'What is the Casbah?', options: [{ emoji: '🏖️', text: 'A beach' }, { emoji: '🏙️', text: 'An old city', correct: true }, { emoji: '🌲', text: 'A forest' }, { emoji: '⛰️', text: 'A mountain' }] },
          { question: 'Where is the Casbah?', options: [{ emoji: '🌍', text: 'Morocco' }, { emoji: '🇩🇿', text: 'Algeria', correct: true }, { emoji: '🇹🇳', text: 'Tunisia' }, { emoji: '🇪🇬', text: 'Egypt' }] },
        ],
        badgeReward: '🏰 Casbah Guardian',
      },
    ],
  },
  {
    id: 'deen',
    name: 'Noor Mosque',
    nameAr: 'مسجد النور',
    description: 'Learn & grow in faith!',
    emoji: '🕌',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.4)',
    bgGradient: 'from-[#0c1445] via-[#1e2a6b] to-[#050c2e]',
    textColor: '#bfdbfe',
    levels: [
      {
        id: 1,
        title: 'Wudu Steps',
        emoji: '💧',
        gemReward: 25,
        gameType: 'ordering',
        lesson: [
          { emoji: '💧🤲', title: 'What is Wudu?', text: 'Before we pray to Allah, we do Wudu — a special washing to be clean and pure. It\'s like a fresh start!' },
          { emoji: '✋😊💪', title: 'Wash & Clean!', text: 'We wash our hands first, then rinse our mouth, wash our face, wash our arms, wipe our head, and wash our feet!' },
          { emoji: '🤲✨', title: 'Ready to Pray!', text: 'After Wudu, we are clean and ready to speak to Allah through prayer. Can you remember the steps?' },
        ],
        orderingItems: [
          { id: 1, emoji: '🙌', label: 'Wash Hands' },
          { id: 2, emoji: '💧', label: 'Rinse Mouth' },
          { id: 3, emoji: '😊', label: 'Wash Face' },
          { id: 4, emoji: '💪', label: 'Wash Arms' },
          { id: 5, emoji: '🦶', label: 'Wash Feet' },
        ],
        badgeReward: '💧 Wudu Master',
      },
      {
        id: 2,
        title: 'Prayer Positions',
        emoji: '🙏',
        gemReward: 30,
        gameType: 'quiz',
        lesson: [
          { emoji: '🕌🙏', title: 'How Do We Pray?', text: 'Muslims pray 5 times a day. Each prayer is a conversation with Allah! We face the Kaaba in Mecca.' },
          { emoji: '🧎‍♂️🤲', title: 'Prayer Positions!', text: 'We stand (Qiyam), bow (Ruku), and prostrate (Sujood). Each position has a special remembrance of Allah.' },
          { emoji: '⭐🌙', title: 'Prayer Times!', text: 'The 5 prayers are: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night).' },
        ],
        quiz: [
          { question: 'How many times do Muslims pray daily?', options: [{ text: '3' }, { text: '5', correct: true }, { text: '7' }, { text: '4' }] },
          { question: 'Which prayer is at dawn?', options: [{ emoji: '🌅', text: 'Fajr', correct: true }, { emoji: '🌞', text: 'Dhuhr' }, { emoji: '🌇', text: 'Maghrib' }, { emoji: '🌃', text: 'Isha' }] },
        ],
        badgeReward: '🙏 Prayer Star',
      },
      {
        id: 3,
        title: 'Al-Fatiha',
        emoji: '📖',
        gemReward: 40,
        gameType: 'quiz',
        lesson: [
          { emoji: '📖✨', title: 'The Opening!', text: 'Al-Fatiha is the first surah of the Quran. Its name means "The Opening". We read it in every prayer!' },
          { emoji: '🤲🌟', title: '7 Verses!', text: 'Al-Fatiha has 7 beautiful verses. It is a prayer for guidance, asking Allah to show us the right path.' },
          { emoji: '💎🕌', title: 'The Greatest Surah!', text: 'Prophet Muhammad ﷺ said Al-Fatiha is the greatest surah. Allah loves when we read it with love and understanding.' },
        ],
        quiz: [
          { question: 'What does Al-Fatiha mean?', options: [{ text: 'The Closing' }, { text: 'The Opening', correct: true }, { text: 'The Light' }, { text: 'The Sea' }] },
          { question: 'How many verses does Al-Fatiha have?', options: [{ text: '5' }, { text: '10' }, { text: '7', correct: true }, { text: '3' }] },
        ],
        badgeReward: '📖 Quran Star',
      },
    ],
  },
  {
    id: 'manners',
    name: 'Kindness Village',
    nameAr: 'قرية اللطف',
    description: 'Be kind & be great!',
    emoji: '🏡',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.4)',
    bgGradient: 'from-[#4a0437] via-[#7b1d5e] to-[#2d0427]',
    textColor: '#fbcfe8',
    levels: [
      {
        id: 1,
        title: 'Sharing is Caring',
        emoji: '🤝',
        gemReward: 25,
        gameType: 'story_choice',
        lesson: [
          { emoji: '🤝❤️', title: 'Why Share?', text: 'When we share with friends, everyone is happy! Sharing shows we care about others. And that makes Allah happy too.' },
          { emoji: '😊😊', title: 'Friends are Gifts!', text: 'The Prophet Muhammad ﷺ said: "None of you truly believes until he loves for his brother what he loves for himself."' },
          { emoji: '🌟💛', title: 'Be the Sharer!', text: "Now let's meet Sadeen and a friend. What would YOU do? Choose wisely!" },
        ],
        storyScene: {
          situation: "Sadeen has 3 cookies 🍪🍪🍪. His friend Amira arrives and looks hungry.",
          mascotSays: "What should Sadeen do?",
          choices: [
            { emoji: '🙈', text: 'Hide the cookies', isCorrect: false, response: "Oh no! Amira feels sad and lonely. Being selfish hurts our friends. Let's try again!" },
            { emoji: '🍪😊', text: 'Share 1 cookie with Amira', isCorrect: true, response: "Amazing! Amira is so happy! Sharing made both Sadeen AND Amira smile! You earned 3 stars! 🌟🌟🌟" },
            { emoji: '🏃', text: 'Run away quickly', isCorrect: false, response: "Running away is not kind. A good friend stays and shares! Try again!" },
          ],
        },
        badgeReward: '🤝 Good Friend',
      },
      {
        id: 2,
        title: 'Respecting Elders',
        emoji: '👴',
        gemReward: 30,
        gameType: 'story_choice',
        lesson: [
          { emoji: '👴👵❤️', title: 'Respect Your Elders!', text: 'In Islam and our Algerian culture, we always respect older people. We greet them first and listen to them.' },
          { emoji: '🤲✊', title: 'The Prophet\'s Teaching!', text: 'Prophet Muhammad ﷺ said: "He is not of us who does not respect our elders."' },
          { emoji: '👨‍👩‍👧‍👦🌟', title: 'Be the Good One!', text: 'Respecting grandparents, parents, and teachers shows great character. Let\'s see how you handle this situation!' },
        ],
        storyScene: {
          situation: "Sadeen is playing on his tablet 📱 when grandpa walks in slowly needing help carrying groceries 🛍️",
          mascotSays: "What should Sadeen do?",
          choices: [
            { emoji: '📱', text: 'Keep playing, ignore grandpa', isCorrect: false, response: 'That makes grandpa feel invisible. Our elders deserve love and respect! Try again!' },
            { emoji: '🛍️💪', text: 'Jump up and help grandpa carry', isCorrect: true, response: 'Mashallah! Sadeen ran to help grandpa and got a big warm hug in return! 3 stars! 🌟🌟🌟' },
            { emoji: '😒', text: 'Say "I\'m busy, later!"', isCorrect: false, response: "Grandpa needs help now. Good manners means helping when needed, not later!" },
          ],
        },
        badgeReward: '👴 Respectful Kid',
      },
      {
        id: 3,
        title: 'Saying Sorry',
        emoji: '🙏',
        gemReward: 35,
        gameType: 'story_choice',
        lesson: [
          { emoji: '😔🙏', title: 'Saying Sorry!', text: 'Everyone makes mistakes! The bravest thing is to say "I\'m sorry" when we do something wrong. It shows real strength.' },
          { emoji: '❤️‍🩹✨', title: 'Forgiveness Heals!', text: 'When you apologize sincerely, it heals friendships. Allah loves those who say sorry and forgive others.' },
          { emoji: '🤝🌟', title: 'Ready?', text: 'Let\'s see if you know the right thing to do when you make a mistake!' },
        ],
        storyScene: {
          situation: "Sadeen accidentally bumps into Yacine's desk and Yacine's drawing falls and gets torn 😢",
          mascotSays: "What should Sadeen do?",
          choices: [
            { emoji: '🏃', text: 'Pretend it didn\'t happen', isCorrect: false, response: 'Pretending makes it worse! Yacine is hurt and Sadeen feels guilty. Try again!' },
            { emoji: '🙏😊', text: 'Say sorry and offer to help fix it', isCorrect: true, response: 'Beautiful! Sadeen said sorry and Yacine smiled. True friends forgive! ⭐⭐⭐' },
            { emoji: '😠', text: 'Blame Yacine for being in the way', isCorrect: false, response: "Blaming others when we made a mistake is not fair. Be honest and say sorry!" },
          ],
        },
        badgeReward: '🙏 Brave Apologizer',
      },
    ],
  },
  {
    id: 'art',
    name: 'Creative Planet',
    nameAr: 'كوكب الإبداع',
    description: 'Build & create!',
    emoji: '🎨',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.4)',
    bgGradient: 'from-[#2d1b69] via-[#4c1d95] to-[#1a0a4a]',
    textColor: '#ddd6fe',
    levels: [
      {
        id: 1,
        title: 'Casbah Puzzle',
        emoji: '🧩',
        gemReward: 30,
        gameType: 'puzzle',
        lesson: [
          { emoji: '🏛️✨', title: 'The Casbah of Algiers!', text: 'The Casbah is Algeria\'s most famous historic site. Its white walls and narrow streets have stories from centuries ago!' },
          { emoji: '🎨🏠', title: 'Beautiful Architecture!', text: 'Casbah houses have colorful tiles, arched doorways, and beautiful courtyards. Artists love to paint them!' },
          { emoji: '🧩🎨', title: 'Let\'s Build It!', text: "Now let's put together a Casbah puzzle! Match the pieces to complete the picture!" },
        ],
        quiz: [
          { question: 'What color are Casbah houses?', options: [{ emoji: '⬛', text: 'Black' }, { emoji: '🔵', text: 'Blue' }, { emoji: '⬜', text: 'White', correct: true }, { emoji: '🟡', text: 'Yellow' }] },
        ],
        badgeReward: '🧩 Puzzle Architect',
      },
      {
        id: 2,
        title: 'Shape Builder',
        emoji: '🔷',
        gemReward: 35,
        gameType: 'puzzle',
        lesson: [
          { emoji: '🔷⬛⭕', title: 'Build with Shapes!', text: 'Great artists and architects use shapes to create amazing things. Circles, squares, and triangles make everything!' },
          { emoji: '🕌🏠🚀', title: 'Shape Combinations!', text: 'A mosque has a circle dome on a square body. A rocket is triangles on a cylinder. Shapes are everywhere!' },
          { emoji: '🎨🌟', title: 'Your Turn!', text: "Now let's build something amazing with shapes! Use your creativity!" },
        ],
        quiz: [
          { question: 'What shape is a mosque dome?', options: [{ emoji: '⬛', text: 'Square' }, { emoji: '⭕', text: 'Circle/Half sphere', correct: true }, { emoji: '🔺', text: 'Triangle' }, { emoji: '🔷', text: 'Diamond' }] },
        ],
        badgeReward: '🏗️ Shape Builder',
      },
      {
        id: 3,
        title: 'Colour Algeria',
        emoji: '🖌️',
        gemReward: 40,
        gameType: 'puzzle',
        lesson: [
          { emoji: '🇩🇿🎨', title: 'Algeria\'s Colors!', text: 'Algeria has beautiful traditional clothes full of bright colors. Each region has its own unique patterns and style!' },
          { emoji: '💚⬜❤️', title: 'The Flag!', text: 'Algeria\'s flag has green (for nature and Islam), white (for peace), and a red crescent and star (for Islam and people).' },
          { emoji: '🎨✨', title: 'Artist Time!', text: "Now let's color a beautiful Algerian scene! Express yourself with color!" },
        ],
        quiz: [
          { question: "What color is on Algeria's flag?", options: [{ emoji: '💛', text: 'Yellow' }, { emoji: '💙', text: 'Blue' }, { emoji: '💚', text: 'Green', correct: true }, { emoji: '🟠', text: 'Orange' }] },
        ],
        badgeReward: '🖌️ Color Artist',
      },
    ],
  },
];

export function getWorld(id: WorldId): World | undefined {
  return WORLDS.find(w => w.id === id);
}

export function getLevel(worldId: WorldId, levelId: number): Level | undefined {
  const world = getWorld(worldId);
  return world?.levels.find(l => l.id === levelId);
}
