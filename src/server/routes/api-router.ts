import bodyParser from 'body-parser';
import { Router } from 'express';
import {
  getAllCategories,
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
  router.get('/api/categories/:category/difficulties', async (req, res) => {
    const { category } = req.params;
    const questions = await getQuestionsByCategory(category);
    const difficulties = questions.map((question) => question.difficulty);
    const difficultiesSet = new Set(difficulties);
    res.json(Array.from(difficultiesSet));
  });

  // Get all questions for a category
  router.get('/api/categories/:category/questions', async (req, res) => {
    const { category } = req.params;
    const questions = await getQuestionsByCategory(category);
    res.json(questions);
  });

  // Get all questions for a category and difficulty
  router.get('/api/categories/:category/:difficulty/questions', async (req, res) => {
    const { category, difficulty } = req.params;
    const questions = await getQuestionsByCategoryAndDifficulty(category, difficulty);
    res.json(questions);
  });

  return router;
}
