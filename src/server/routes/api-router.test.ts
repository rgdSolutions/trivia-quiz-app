import express from 'express';
import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { apiRouter } from './api-router';

// DB function mocks
vi.mock('../db', () => ({
  getAllCategories: vi.fn().mockResolvedValue([
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ]),
  getQuestionsByCategory: vi.fn().mockResolvedValue([
    { question: 'Q1', difficulty: 'easy', incorrect_answers: ['A', 'B', 'C'], correct_answer: 'D' },
    {
      question: 'Q2',
      difficulty: 'medium',
      incorrect_answers: ['E', 'F', 'G'],
      correct_answer: 'H',
    },
  ]),
  getQuestionsByCategoryAndDifficulty: vi.fn().mockResolvedValue([
    {
      question: 'Q3',
      difficulty: 'hard',
      incorrect_answers: ['I', 'J', 'K'],
      correct_answer: 'L',
    },
  ]),
  getOneQuestionByText: vi.fn().mockResolvedValue({ correct_answer: 'D' }),
}));

// Create a test API Express server
const app = express();
app.use(express.json());
app.use(apiRouter());

describe('API Router', () => {
  it('GET /api/categories returns all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ]);
  });

  it('GET /api/difficulties/:category returns unique difficulties', async () => {
    const res = await request(app).get('/api/difficulties/1');
    expect(res.status).toBe(200);
    expect(res.body).toContain('easy');
    expect(res.body).toContain('medium');
  });

  it('GET /api/questions/:category returns quiz questions', async () => {
    const res = await request(app).get('/api/questions/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('question');
    expect(res.body[0]).toHaveProperty('possible_answers');
  });

  it('GET /api/questions/:category/:difficulty returns quiz questions', async () => {
    const res = await request(app).get('/api/questions/1/hard');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('question');
    expect(res.body[0]).toHaveProperty('possible_answers');
  });

  it('GET /api/questions/:category/:difficulty/count returns question count', async () => {
    const res = await request(app).get('/api/questions/1/hard/count');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('question_count');
  });

  it('GET /api/quiz/:category/:difficulty/:count returns limited quiz questions', async () => {
    const res = await request(app).get('/api/quiz/1/hard/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('POST /api/quiz/score returns score and correct answers', async () => {
    const res = await request(app)
      .post('/api/quiz/score')
      .send({
        questions: [{ question: 'Q1', possible_answers: ['A', 'B', 'C', 'D'] }],
        selected_answers: ['D'],
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('score');
    expect(res.body).toHaveProperty('correct_answers');
    expect(Array.isArray(res.body.correct_answers)).toBe(true);
  });
});
