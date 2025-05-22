export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export type Category = {
  id: number;
  name: string;
};

export type Question = {
  category: string;
  correct_answer: string;
  difficulty: Difficulty;
  incorrect_answers: string[];
  question: string;
  type: 'multiple';
};

export type QuizQuestion = {
  question: string;
  possible_answers: string[];
};

export type AnsweredQuestion = QuizQuestion & {
  correct_answer: string;
  user_answer: string;
};
