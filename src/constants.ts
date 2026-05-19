import { Subject, Question, LeaderboardEntry, Badge } from './types';

export const INITIAL_SYLLABUS: Subject[] = [
  {
    id: 'science',
    name: 'Science',
    color: '#3B82F6', // Blue
    chapters: [
      { id: 'sci-1', title: 'Chemical Reactions and Equations', completed: false },
      { id: 'sci-2', title: 'Acids, Bases and Salts', completed: false },
      { id: 'sci-3', title: 'Metals and Non-metals', completed: false },
      { id: 'sci-4', title: 'Life Processes', completed: false },
      { id: 'sci-5', title: 'Control and Coordination', completed: false },
      { id: 'sci-6', title: 'Light - Reflection and Refraction', completed: false },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    color: '#EF4444', // Red
    chapters: [
      { id: 'math-1', title: 'Arithmetic Progressions', completed: false },
      { id: 'math-2', title: 'Triangles', completed: false },
      { id: 'math-3', title: 'Pair of Linear Equations', completed: false },
      { id: 'math-4', title: 'Quadratic Equations', completed: false },
      { id: 'math-5', title: 'Introduction to Trigonometry', completed: false },
      { id: 'math-6', title: 'Statistics', completed: false },
    ],
  },
  {
    id: 'social',
    name: 'Social Studies',
    color: '#10B981', // Green
    chapters: [
      { id: 'soc-1', title: 'Advent of Europeans to India', completed: false },
      { id: 'soc-2', title: 'The Extension of British Rule', completed: false },
      { id: 'soc-3', title: 'India under British Rule', completed: false },
      { id: 'soc-4', title: 'Indian Physiography', completed: false },
      { id: 'soc-5', title: 'Public Finance', completed: false },
      { id: 'soc-6', title: 'Consumer Education and Protection', completed: false },
    ],
  },
];

export const MOCK_QUESTIONS: Question[] = [
  // Science
  {
    id: 'q1',
    subject: 'science',
    chapter: 'Chemical Reactions',
    questionText: 'What is the color of Magnesium ribbon after rubbing with sandpaper?',
    options: { A: 'Black', B: 'Silver-White', C: 'Brown', D: 'Deep Blue' },
    correctAnswer: 'B'
  },
  {
    id: 'q2',
    subject: 'science',
    chapter: 'Acids, Bases',
    questionText: 'Which acid is present in Tamarind?',
    options: { A: 'Citric Acid', B: 'Lactic Acid', C: 'Tartaric Acid', D: 'Acetic Acid' },
    correctAnswer: 'C'
  },
  {
    id: 'q3',
    subject: 'science',
    chapter: 'Metals',
    questionText: 'Which metal is liquid at room temperature?',
    options: { A: 'Sodium', B: 'Mercury', C: 'Iron', D: 'Gold' },
    correctAnswer: 'B'
  },
  // Mathematics
  {
    id: 'q4',
    subject: 'math',
    chapter: 'Arithmetic Progressions',
    questionText: 'What is the common difference of the AP: 3, 1, -1, -3...?',
    options: { A: '2', B: '-2', C: '3', D: '1' },
    correctAnswer: 'B'
  },
  {
    id: 'q5',
    subject: 'math',
    chapter: 'Quadratic Equations',
    questionText: 'The discriminant of x^2 + 4x + 4 = 0 is?',
    options: { A: '16', B: '8', C: '0', D: '-16' },
    correctAnswer: 'C'
  },
  {
    id: 'q6',
    subject: 'math',
    chapter: 'Triangles',
    questionText: 'In a right-angled triangle, the square of the hypotenuse is equal to the sum of squares of depth and height. What is this theorem?',
    options: { A: 'Thales Theorem', B: 'Pythagoras Theorem', C: 'Euler Theorem', D: 'Taylor Theorem' },
    correctAnswer: 'B'
  },
  // Social Studies
  {
    id: 'q7',
    subject: 'social',
    chapter: 'Advent of Europeans',
    questionText: 'Vasco da Gama reached Calicut in which year?',
    options: { A: '1492', B: '1498', C: '1502', D: '1510' },
    correctAnswer: 'B'
  },
  {
    id: 'q8',
    subject: 'social',
    chapter: 'Indian Physiography',
    questionText: 'Which is the highest peak in South India?',
    options: { A: 'Mullayanagiri', B: 'Anamudi', C: 'Dodabetta', D: 'Mount Everest' },
    correctAnswer: 'B'
  },
  {
    id: 'q9',
    subject: 'social',
    chapter: 'Public Finance',
    questionText: 'The central bank of India is?',
    options: { A: 'SBI', B: 'RBI', C: 'ICICI', D: 'HDFC' },
    correctAnswer: 'B'
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Rahul K.', xp: 12450 },
  { rank: 2, name: 'Priya M.', xp: 11200 },
  { rank: 3, name: 'Amit Singh', xp: 10850 },
  { rank: 4, name: 'Ananya V.', xp: 9400 },
  { rank: 5, name: 'Karthik S.', xp: 8200 },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'Early Bird', icon: '🌅', description: 'First login of the day!', unlocked: true },
  { id: 'b2', name: 'Quiz Master', icon: '🎯', description: 'Get 5/5 in a quiz', unlocked: false },
  { id: 'b3', name: 'Streak King', icon: '🔥', description: 'Maintain a 7-day streak', unlocked: false },
  { id: 'b4', name: 'Scholar', icon: '📚', description: 'Complete a whole subject', unlocked: false },
];
