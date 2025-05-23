import type { Question, QuizQuestion } from '@shared/types';
import { shuffleArray } from '@shared/utils';
import bodyParser from 'body-parser';
import { Router } from 'express';
import {
  getAllCategories,
  getOneQuestionByText,
  getQuestionsByCategory,
  getQuestionsByCategoryAndDifficulty,
} from '../db';

export function apiRouter(): Router {
  const router = Router();
  router.use(bodyParser.json());

  // Get all categories
  router.get('/api/categories', async (_req, res) => {
    const categories = await getAllCategories();
    res.json(categories);
  });

  // Get all difficulties for a category
  router.get('/api/difficulties/:category', async (req: any, res: any) => {
    const { category } = req.params;
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const questions = await getQuestionsByCategory(category);
    const difficulties = questions.map((question) => question.difficulty);
    const difficultiesSet = new Set(difficulties);
    res.json(Array.from(difficultiesSet));
  });

  // Get all quiz-ready questions for a category
  router.get('/api/questions/:category', async (req: any, res: any) => {
    const { category } = req.params;
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const questions = await getQuestionsByCategory(category);
    res.json(mapQuestionsToQuizQuestions(questions));
  });

  // Get all quiz-ready questions for a category and difficulty
  router.get('/api/questions/:category/:difficulty', async (req: any, res: any) => {
    const { category, difficulty } = req.params;
    if (
      !category ||
      typeof category !== 'string' ||
      !difficulty ||
      typeof difficulty !== 'string'
    ) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const questions = await getQuestionsByCategoryAndDifficulty(category, difficulty);
    res.json(mapQuestionsToQuizQuestions(questions));
  });

  // Get question count for a category and difficulty
  router.get('/api/questions/:category/:difficulty/count', async (req: any, res: any) => {
    const { category, difficulty } = req.params;
    if (
      !category ||
      typeof category !== 'string' ||
      !difficulty ||
      typeof difficulty !== 'string'
    ) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const questions = await getQuestionsByCategoryAndDifficulty(category, difficulty);
    res.json({ question_count: questions.length });
  });

  // Get X many quiz-ready questions for a given category, difficulty, and count
  router.get('/api/quiz/:category/:difficulty/:count', async (req: any, res: any) => {
    const { category, difficulty, count } = req.params;
    if (
      !category ||
      typeof category !== 'string' ||
      !difficulty ||
      typeof difficulty !== 'string' ||
      !count ||
      typeof count !== 'string'
    ) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const questions = await getQuestionsByCategoryAndDifficulty(category, difficulty);
    res.json(mapQuestionsToQuizQuestions(questions.slice(0, Number(count))));
  });

  // Get score and correct answers for a quiz
  router.post('/api/quiz/score', async (req: any, res: any) => {
    const { questions, selected_answers } = req.body;
    if (
      !questions ||
      !Array.isArray(questions) ||
      !questions.length ||
      !selected_answers ||
      !Array.isArray(selected_answers) ||
      !selected_answers.length ||
      selected_answers.length !== questions.length
    ) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const correct_answers = await mapQuizQuestionsToCorrectAnswers(questions);
    const score = calculateScore(selected_answers, correct_answers);
    res.json({ score, correct_answers });
  });

  return router;
}

const mapQuestionsToQuizQuestions = (questions: Question[]): QuizQuestion[] => {
  const quizQuestions = questions.map((question) => ({
    question: question.question,
    possible_answers: question.incorrect_answers.concat(question.correct_answer),
  }));
  return shuffleArray(quizQuestions);
};

const mapQuizQuestionsToCorrectAnswers = async (
  quizQuestions: QuizQuestion[],
): Promise<string[]> => {
  return await Promise.all(
    quizQuestions.map(async (quizQuestion) => {
      const question = await getOneQuestionByText(quizQuestion.question);
      return question.correct_answer;
    }),
  );
};

const calculateScore = (selected_answers: string[], correct_answers: string[]): number => {
  return selected_answers.filter((answer, index) => answer === correct_answers[index]).length;
};
