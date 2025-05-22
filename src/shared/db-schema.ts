import { model, Schema } from 'mongoose';

export const CategorySchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
});

export const CategoryModel = model('Category', CategorySchema);

export const QuestionSchema = new Schema({
  category: { type: String, required: true },
  correct_answer: { type: String, required: true },
  difficulty: { type: String, required: true },
  incorrect_answers: { type: [String], required: true },
  question: { type: String, required: true, unique: true },
  type: { type: String, required: true },
});

export const QuestionModel = model('Question', QuestionSchema);
