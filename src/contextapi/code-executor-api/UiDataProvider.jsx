import { uiCOntentDefault } from "@/components/hooks/ApiHooks";
import { createContext, useReducer, useState } from "react";
export const UiDataContext = createContext();

export const UiDataProvider = ({ children }) => {

  function reducer(state, action) {
    switch (action.type) {
      case "setActivityId": {
        return {
          ...state,
          codingActivityId: action.payload,
        };
      }
      case "getUiData": {
        return {
          ...state,
          uiContentss: action.payload,
        };
      }
      case "setActivityDefaultCode": {
        return {
          ...state,
          activityDefaultCode: action.payload,
        };
      }
      case "setUiContent": {
        return {
          ...state,
          ...action.payload,
        };
      }
      case "setContent": {
        console.log("handle delete")

        const content = JSON.parse(JSON.stringify(state.uiContent));
        // content[action.payload.key] = action.payload.data;
        // console.log(action.payload)
        if (!action.payload.key) {
          return state
        }
        if (action.payload.key.includes(".") || action.payload.key.includes("[")) {
          const keys = action.payload.key.split(".");
          let nestedContent = content;
          for (let i = 0; i < keys.length - 1; i++) {
            if (keys[i].includes('[')) {
              const index = keys[i].split('[')[1].split(']')[0]
              if (!nestedContent[keys[i].split('[')[0]]) {
                nestedContent[keys[i].split('[')[0]] = [];
              }
              nestedContent = nestedContent[keys[i].split('[')[0]][index];
            } else {
              if (!nestedContent[keys[i]]) {
                nestedContent[keys[i]] = {};
              }
              nestedContent = nestedContent[keys[i]];
            }
          }
          if (!action.payload.data) {
            delete nestedContent[keys[keys.length - 1]];
          } else {
            nestedContent[keys[keys.length - 1]] = action.payload.data;
          }
        } else {
          content[action.payload.key] = action.payload.data;
        }
        // console.log(content)
        return {
          ...state,
          uiContent: content,
        };
      }
      case "replaceContent": {
        return {
          ...state,
          uiContent: action.payload,
        };
      }
      case "deleteContent": {
        function deleteValueOfObjectByPath({ path }) {
          // Clone the original object to avoid mutating it directly
          const updatedObject = JSON.parse(JSON.stringify(state.uiContent));
          console.log("delete called ", path)
          // Split the path string into parts (accounting for array indices)
          const parts = path.split(/\.|\[|\]/).filter(p => p);
      
          // Recursively update the object
          const updateRecursively = (obj, parts) => {
            const part = parts[0];
      
            // If it's the last part of the path, update the value
            if (parts.length === 1) {
              if (Array.isArray(obj)) {
                obj.splice(part, 1)
                return;
              }
              delete obj[part]
              return;
            }
      
            // Otherwise, proceed to the next part of the path
            updateRecursively(obj[part], parts.slice(1));
          };
      
          updateRecursively(updatedObject, parts);
          // console.log("update called ", updatedObject)
          // uiObject.value = updatedObject
          return updatedObject;
        }
        return {
          ...state,
          uiContent: deleteValueOfObjectByPath({path: action.payload.key}),
          activePath: null
        };
      }
      case "setScreen": {
        return {
          ...state,
          screen: action.payload,
        };
      }
      case "setChatScreenStatus": {
        return {
          ...state,
          chatScreenStatus: action.payload,
        };
      }
      case "setDevmode": {
        return {
          ...state,
          devmode: action.payload,
        };
      }
      case "setOpenReportUi": {
        return {
          ...state,
          openReportUi: action.payload,
        };
      }
      case "setHighlightClass": {
        return {
          ...state,
          highlightClass: action.payload,
        };
      }
      case "setActivePath": {
        if (action.payload) {
          return {
            ...state,
            activePath: action.payload,
          };
        }
        else {
          return {
            ...state,
            activePath: null,
          };
        }
      }
      default: {
        return state;
      }
    }
  }
  const [uiData, dispatchUiData] = useReducer(reducer, {
    uiContentss: null,
    codingActivityId: null,
    uiContent: uiCOntentDefault,
    _id: null,
    gptModel: "gpt-4o",
    systemPrompt: "You are helping a student with their homework. The student is asking you to explain a concept to them. \n",
    codeRefPrompt: "Here's the code that generates the output: \n",
    activityTitle: "Activity Title",
    activityDefaultCode: "",
    activityCodeExecutor: "Pyodide",
    activityCodeRuntime: "Pyodide",
    screen: 'editor',
    chatScreenStatus: 'followUpAskQuestion',
    devmode: false,
    openReportUi: false,
    activityDefaultCode: "",
    highlightClass: "",
    activePath: null
  });
  return (
    <UiDataContext.Provider value={{ uiData, dispatchUiData }}>
      {children}
    </UiDataContext.Provider>
  );
};
