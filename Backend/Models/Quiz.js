import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const quizSchema = new Schema({
  title: { type: String },
  quizcode: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  startingDate: { type: Date },
  endingDate: { type: Date },
});

const questionSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  questionText: { type: String, required: true },
  options: [{
    optionText: { type: String },
    isCorrect: { type: Number },
  }],
  points: { type: Number, default: 1 },
});

export const Quiz = mongoose.model('Quiz', quizSchema);
export const Question = mongoose.model('Question', questionSchema);
