import type { Question, QuizQuestion } from '@shared/types';
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
  router.get('/api/categories', async (req, res) => {
    const categories = await getAllCategories();
    res.json(categories);
  });

  // Get all difficulties for a category
  router.get('/api/difficulties/:category', async (req, res) => {
    const { category } = req.params;
    const questions = await getQuestionsByCategory(category);
    const difficulties = questions.map((question) => question.difficulty);
    const difficultiesSet = new Set(difficulties);
    res.json(Array.from(difficultiesSet));
  });

  // Get all quiz-ready questions for a category
  router.get('/api/questions/:category', async (req, res) => {
    const { category } = req.params;
    const questions = await getQuestionsByCategory(category);
    res.json(mapQuestionsToQuizQuestions(questions));
  });

  // Get all quiz-ready questions for a category and difficulty
  router.get('/api/questions/:category/:difficulty', async (req, res) => {
    const { category, difficulty } = req.params;
    const questions = await getQuestionsByCategoryAndDifficulty(category, difficulty);
    res.json(mapQuestionsToQuizQuestions(questions));
  });

  // Get question count for a category and difficulty
  router.get('/api/questions/:category/:difficulty/count', async (req, res) => {
    const { category, difficulty } = req.params;
    const questions = await getQuestionsByCategoryAndDifficulty(category, difficulty);
    res.json({ question_count: questions.length });
  });

  // Get X many quiz-ready questions for a given category, difficulty, and count
  router.get('/api/quiz/:category/:difficulty/:count', async (req, res) => {
    const { category, difficulty, count } = req.params;
    const questions = await getQuestionsByCategoryAndDifficulty(category, difficulty);
    res.json(mapQuestionsToQuizQuestions(questions.slice(0, Number(count))));
  });

  // Get score and correct answers for a quiz
  router.post('/api/quiz/score', async (req, res) => {
    const { questions, selected_answers } = req.body;
    const correct_answers = await mapQuizQuestionsToCorrectAnswers(questions);
    const score = calculateScore(selected_answers, correct_answers);
    res.json({ score, correct_answers });
  });

  return router;
}

const mapQuestionsToQuizQuestions = (questions: Question[]): QuizQuestion[] => {
  return questions.map((question) => ({
    question: question.question,
    possible_answers: question.incorrect_answers
      .concat(question.correct_answer)
      .sort(() => Math.random() - 0.5),
  }));
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
