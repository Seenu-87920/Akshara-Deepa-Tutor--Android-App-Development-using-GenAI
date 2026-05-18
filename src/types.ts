export interface Chapter {
  id: string;
  title: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
  color: string;
}

export interface Question {
  id: string;
  subject: string;
  chapter: string;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizResult {
  id: string;
  subject: string;
  score: number;
  total: number;
  date: string;
}

export interface StrengthData {
  subject: string;
  strength: number;
}
