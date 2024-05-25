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
import json
datalist = json.loads(listOfDataFromAPI)
# don't change "list Of Data From API" name
# don't change order of the list element
# edit from here
def additionalList(result):
  new_result = []
  for item in result:
    # don't create nested dictionary
    new_item = {}
    device = item.get("device", "")
    device_version = item.get("deviceVersion", "")
    
    browser = item.get("browser", "")
    browser_version = item.get("browserVersion", "")

    new_item["deviceInformation"] = f"{device} {device_version} {browser} {browser_version}"
    new_result.append(new_item)
  return new_result
newList = additionalList(datalist)
json.dumps(newList, indent=2)
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
    codeRefPrompt: {
      type: String,
      default: "Here's the code that generates the output: \n"
    },
    systemPrompt: {
      type: String,
      default: "You are helping a student with their homework. The student is asking you to explain a concept to them. \n"
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
