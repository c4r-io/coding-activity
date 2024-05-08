import mongoose from 'mongoose';
const chatFeedbackSchema = mongoose.Schema(
  {
    codingActivity: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'CodingActivity',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    },
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
const ChatFeedback =
  mongoose.models.ChatFeedback ||
  mongoose.model('ChatFeedback', chatFeedbackSchema);
export default ChatFeedback;
