import dotenv from 'dotenv';
import { connect, connection } from 'mongoose';
import { CategoryModel, QuestionModel } from '../shared/db-schema';
import { shuffleArray } from '../shared/utils';

type OpenTDBCategory = {
  id: number;
  name: string;
};

type OpenTDBQuestion = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

type OpenTDBCategoryResponseData = {
  trivia_categories: OpenTDBCategory[];
};

type OpenTDBQuestionResponseData = {
  results: OpenTDBQuestion[];
};

// Load environment variables
dotenv.config();
const {
  CATEGORIES_ENDPOINT,
  MAX_NUMBER_OF_CATEGORIES,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_URI,
  QUESTIONS_ENDPOINT,
} = process.env as Record<string, string>;

// Connect to local mongo db
connect(MONGO_URI, {
  auth: {
    username: MONGO_INITDB_ROOT_USERNAME,
    password: MONGO_INITDB_ROOT_PASSWORD,
  },
});
const db = connection;

// Handle connection errors
db.on('error', console.error.bind(console, 'connection error:'));

// Handle connection success
db.once('open', function () {
  handleConnectionSuccess();
});

const handleConnectionSuccess = async () => {
  console.log('\nConnected to MongoDB');
  await clearDb();
  await seedCategories();
  await seedQuestions();
  const totalQuestions = await QuestionModel.countDocuments();
  console.log(`\nTotal questions seeded: ${totalQuestions}`);
  await closeConnectionAndExit();
};

const clearDb = async () => {
  await CategoryModel.deleteMany();
  await QuestionModel.deleteMany();
};

const seedCategories = async () => {
  console.log(`\nSeeding ${MAX_NUMBER_OF_CATEGORIES} categories...`);
  const categories = await fetchCategories();
  const categoriesToInsert = categories
    // Keep only the first n categories
    .slice(0, parseInt(MAX_NUMBER_OF_CATEGORIES));
  const shuffledCategories = shuffleArray(categoriesToInsert);
  await CategoryModel.insertMany(shuffledCategories);
  console.log(`\n${MAX_NUMBER_OF_CATEGORIES} categories have been successfully seeded to db!`);
};

const seedQuestions = async () => {
  console.log('\nSeeding questions. Please be patient, it can take a while...');
  const categories = await CategoryModel.find();
  for (const category of categories) {
    const questions = await fetchAllQuestionsForOneCategory(category.id);
    const numberOfQuestions = questions.length;
    if (numberOfQuestions === 0) {
      // If no questions are fetched, delete the category
      console.log(`\nNo questions fetched for category ${category.name}`);
      await CategoryModel.deleteOne({ id: category.id });
    } else {
      console.log(`\n${category.name} questions fetched:`, numberOfQuestions);
      await QuestionModel.insertMany(questions);
    }
  }
  const totalQuestions = await QuestionModel.countDocuments();
  console.log(`\n${totalQuestions} questions have been seeded to db!`);
};

const fetchCategories = async () => {
  try {
    const response = await fetch(CATEGORIES_ENDPOINT);
    const data = (await response.json()) as OpenTDBCategoryResponseData;
    return data.trivia_categories as OpenTDBCategory[];
  } catch (error) {
    console.error('\nError fetching categories:', error);
    return [];
  }
};

// There is a rate limit for the OpenTDB API
// https://forums.pixeltailgames.com/t/download-rate-limited/49325
const waitSixSeconds = () => new Promise((resolve) => setTimeout(resolve, 6000));

const fetchAllQuestionsForOneCategory = async (categoryId: number) => {
  let data: OpenTDBQuestionResponseData = { results: [] };
  try {
    while (!data?.results?.length) {
      await waitSixSeconds();
      const response = await fetch(
        `${QUESTIONS_ENDPOINT}?amount=50&category=${categoryId}&type=multiple`,
      );
      data = (await response.json()) as OpenTDBQuestionResponseData;
    }
  } catch (error) {
    console.error(`\nError fetching questions for category ${categoryId}:`, error);
  }
  return data.results;
};

const closeConnectionAndExit = async () => {
  await db.close();
  console.log('\nMongoDB connection closed');
  process.exit(0);
};
