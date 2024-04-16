import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IEssay {
  essayText: string; // essayText is the text of the essay
  prompt: string; // question is the question that the essay answers
  feedback: string; // feedback is the feedback given to the essay
  user: string; // user is the username of the user who wrote the essay
  _id?: string; // _id is the unique identifier of the essay
}

const essaySchema = new Schema<IEssay>({
  essayText: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: false,
  },
  user: {
    type: String,
    required: true,
  },
});

const Essay = mongoose.model('Question', essaySchema);

export default Essay;
