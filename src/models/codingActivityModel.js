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
    gptModel: {
      type: String,
    },
    systemPrompt: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
const CodingActivity =
  mongoose.models.CodingActivity ||
  mongoose.model('CodingActivity', codeExecutorActivitySchema);
export default CodingActivity;
