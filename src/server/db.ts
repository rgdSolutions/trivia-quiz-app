import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { CategoryModel, QuestionModel } from '../shared/db-schema';

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
  return categories;
};

export const getQuestionsByCategory = async (category: string) => {
  const questions = await QuestionModel.find({ category });
  return questions;
};

export const getQuestionsByCategoryAndDifficulty = async (category: string, difficulty: string) => {
  const questions = await QuestionModel.find({ category, difficulty });
  return questions;
};
