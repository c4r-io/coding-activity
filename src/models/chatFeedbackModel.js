import mongoose from 'mongoose';
const chatFeedbackSchema = mongoose.Schema(
  {
    codeExecutorActivity: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'CodeExecutorActivity',
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
