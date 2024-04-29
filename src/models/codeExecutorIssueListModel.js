import mongoose from 'mongoose';
const pythonExecutorIssueListSchema = mongoose.Schema(
  {
    codeExecutorActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodeExecutorActivity',
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
