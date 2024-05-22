import mongoose from 'mongoose';
const codeExecutorActivitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    },   
    parentActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingActivity",
      required: false,
      default: null,
    },
    activityTitle: {
      type: String,
    },
    activityDefaultCode: {
      type: String,
    },
    featureEngineeringCode: {
      type: String,
      default: `
# don't change "listOfDataFromAPI" name
datalist = listOfDataFromAPI
# edit from here
json.dumps(datalist, indent=2)
      `,
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
