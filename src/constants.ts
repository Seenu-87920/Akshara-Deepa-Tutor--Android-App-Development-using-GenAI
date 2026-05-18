import { Subject, Question } from './types';

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
  // Mathematics
  {
    id: 'q3',
    subject: 'math',
    chapter: 'Arithmetic Progressions',
    questionText: 'What is the common difference of the AP: 3, 1, -1, -3...?',
    options: { A: '2', B: '-2', C: '3', D: '1' },
    correctAnswer: 'B'
  },
  {
    id: 'q4',
    subject: 'math',
    chapter: 'Quadratic Equations',
    questionText: 'The discriminant of x^2 + 4x + 4 = 0 is?',
    options: { A: '16', B: '8', C: '0', D: '-16' },
    correctAnswer: 'C'
  },
  // Social Studies
  {
    id: 'q5',
    subject: 'social',
    chapter: 'Advent of Europeans',
    questionText: 'Vasco da Gama reached Calicut in which year?',
    options: { A: '1492', B: '1498', C: '1502', D: '1510' },
    correctAnswer: 'B'
  },
  {
    id: 'q6',
    subject: 'social',
    chapter: 'Indian Physiography',
    questionText: 'Which is the highest peak in South India?',
    options: { A: 'Mullayanagiri', B: 'Anamudi', C: 'Dodabetta', D: 'Mount Everest' },
    correctAnswer: 'B'
  }
];
