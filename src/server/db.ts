import { CategoryModel, QuestionModel } from '@shared/db-schema';
import type { Category, Question } from '@shared/types';
import dotenv from 'dotenv';
import { connect, connection } from 'mongoose';

// Load environment variables
dotenv.config();
const { MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, MONGO_URI } = process.env as Record<
  string,
  string
>;

// Connect to local mongo db and handle connection errors
connect(MONGO_URI, {
  auth: {
    username: MONGO_INITDB_ROOT_USERNAME,
    password: MONGO_INITDB_ROOT_PASSWORD,
  },
});
const db = connection;
db.on('error', console.error.bind(console, 'Databse connection error:'));

export const getAllCategories = async () => {
  const categories = await CategoryModel.find();
  return categories as unknown as Category[];
};

export const getQuestionsByCategory = async (category: string) => {
  const questions = await QuestionModel.find({ category });
  return questions as unknown as Question[];
};

export const getQuestionsByCategoryAndDifficulty = async (category: string, difficulty: string) => {
  const questions = await QuestionModel.find({ category, difficulty });
  return questions as unknown as Question[];
};

export const getOneQuestionByText = async (questionText: string) => {
  const question = await QuestionModel.findOne({ question: questionText });
  return question as unknown as Question;
};
