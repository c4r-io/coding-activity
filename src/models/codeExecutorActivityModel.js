import mongoose from 'mongoose';
const codeExecutorActivitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    },
    activityTitle: {
      type: String,
    },
    activityDefaultCode: {
      type: String,
    },
    activityCodeExecutor: {
      type: String,
    },
    activityCodeRuntime: {
      type: String,
      default: 'Pyodide',
    },
    uiContent: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);
const CodeExecutorActivity =
  mongoose.models.CodeExecutorActivity ||
  mongoose.model('CodeExecutorActivity', codeExecutorActivitySchema);
export default CodeExecutorActivity;
