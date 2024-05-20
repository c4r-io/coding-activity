import mongoose from 'mongoose';
const pythonExecutorIssueListSchema = mongoose.Schema(
  {
    codingActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingActivity',
    },
    analytics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analytics',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    },
    description: {
      type: String,
    },
    attachment: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

const PythonExecutorIssueList =
  mongoose.models.PythonExecutorIssueList ||
  mongoose.model('PythonExecutorIssueList', pythonExecutorIssueListSchema);
export default PythonExecutorIssueList;
