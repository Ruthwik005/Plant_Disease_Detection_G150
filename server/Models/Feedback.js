import mongoose from 'mongoose';

const Feedback = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true, // Example: 'Anonymous' for unauthenticated users
  },
  email: {
    type: String,
    trim: true,
    required:true, // Optional email
  },
  feedback: {
    type: String,
    required: true,
    trim: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const FeedbackSchema = mongoose.model('Feedback', Feedback);

export default FeedbackSchema;
