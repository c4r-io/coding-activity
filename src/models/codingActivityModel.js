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
    
    _id = item.get("_id", "")

    new_item["deviceInformation"] = f"{device} {device_version} {browser} {browser_version}"
    
    # must provide _id
    new_item["_id"] = _id
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
