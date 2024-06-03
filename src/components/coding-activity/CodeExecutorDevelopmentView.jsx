import MainView from "./MainView.jsx";
import { AllContextProviders } from "@/contextapi/code-executor-api/AllContextProviders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssEditorView from "./CssEditorView.jsx";
import CustomCssInjector from "./CustomCssInjector.jsx";
import UpdateCustomizedDataButton from "./UpdateCustomizedDataButton.jsx";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdKeyboardArrowLeft } from "react-icons/md";
import React, { useState, useCallback, useEffect } from "react";
import { UiDataContext } from "@/contextapi/code-executor-api/UiDataProvider.jsx";
import { useDebounceEffect } from "../hooks/useDebounceEffect.jsx";
import { useReduUndu } from "../hooks/navigation/useReduUndu.jsx";
// development mode
export default function CodeExecutorDevelopmentView({ codingActivityId, uiDataFromDb, children }) {
  const [cssEditor, setCssEditor] = useState(true)
  const { uiData, dispatchUiData } = React.useContext(UiDataContext);

  const reduUndu = useReduUndu((data) => {
    dispatchUiData({ type: 'replaceContent', payload: data })
  })
  useEffect(() => {
    reduUndu.updateMainStack(uiData.uiContent)
  }, [uiData.uiContent])

  // :DONE: Implement undo redo functionality as a custom hook
  // const [undoStack, setUndoStack] = useState([]);
  // const [redoStack, setRedoStack] = useState([]);
  // const [isUndoing, setIsUndoing] = useState(false);
  // const [isRedoing, setIsRedoing] = useState(false);

  // const undo = React.useCallback(() => {
  //   console.log("undu ", undoStack)
  //   if (undoStack.length > 0) {
  //     setIsUndoing(true);
  //     const previousContent = undoStack[undoStack.length - 1];
  //     setUndoStack(prev => prev.slice(0, -1));
  //     dispatchUiData({ type: 'replaceContent', payload: JSON.parse(JSON.stringify(previousContent)) })
  //     setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(previousContent))]);
  //   }
  // },[uiData.uiContent, isUndoing, undoStack, redoStack])

  // // Redo the last undone action
  // const redo = React.useCallback(() => {
  //   console.log("redu ", redoStack)
  //   if (redoStack.length > 0) {
  //     setIsRedoing(true);
  //     const nextContent = redoStack[redoStack.length - 1];
  //     dispatchUiData({ type: 'replaceContent', payload: JSON.parse(JSON.stringify(nextContent)) })
  //     setRedoStack(prev => prev.slice(0, -1));
  //     setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(nextContent))]);
  //   }
  // },[uiData.uiContent, isRedoing, undoStack, redoStack])
  // React.useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
  //       if (event.shiftKey) {
  //         redo();
  //       } else {
  //         undo();
  //       }
  //       event.preventDefault();
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [undo, redo]);

  // useDebounceEffect(() => {
  //   if (!(isRedoing || isUndoing)) {
  //     if (JSON.stringify(uiData.uiContent) !== JSON.stringify(undoStack[undoStack.length - 1])) {
  //       console.log("not same state")
  //       setUndoStack(prev => {
  //         if (prev.length > 20) {
  //           return [...prev.slice(1), JSON.parse(JSON.stringify(uiData.uiContent))];
  //         }
  //         return [...prev, JSON.parse(JSON.stringify(uiData.uiContent))];
  //       });
  //       setRedoStack([]);
  //     } else {
  //       console.log("same state")
  //     }
  //   }
  //   console.log("debounce effect", isRedoing, isUndoing)
  //   if (isRedoing) {
  //     setIsRedoing(false)
  //   }
  //   if (isUndoing) {
  //     setIsUndoing(false)
  //   }
  //   console.log("debounce effect", isRedoing, isUndoing)
  // }, 600, [uiData.uiContent])

  return (
    <div className="max-h-max min-w-[800px] pb-2">
      {/* <AllContextProviders> */}
      <CustomCssInjector />
      <div className="mb-4 flex flex-wrap">
        {/* injected buttons as children to make all buttons in one row */}
        {children}
        <UpdateCustomizedDataButton />
      </div>
      <div className="flex -m-1 w-[800px] relative">
        {/* {cssEditor ?
            <div className=" w-[450px] h-[500px] sticky top-0 right-0">
              <div className="border border-dashed border-gray-400">
                <CssEditorView />
              </div>
            </div> : ""
          } */}
        <div className="p-1 w-[750px] border relative border-dashed border-gray-400">

          {/* <div className="absolute top-0 left-0 z-50">
              {cssEditor ?
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md"
                  onClick={() => setCssEditor(false)}
                >
                  Close Css Editor
                </button> :
                <button
                  className="bg-cyan-500 text-white px-4 py-1 rounded-md"
                  onClick={() => setCssEditor(true)}
                >
                  Open Css Editor
                </button>
              }
            </div> */}
          <div
            className={`flex justify-center pt-6`}
          >
            <div className={`annotation max-w-[750px]`}>
              <MainView devmode={true} codingActivityId={codingActivityId} uiDataFromDb={uiDataFromDb} />
              <ToastContainer />
            </div>
          </div>
          {/* <div className="absolute top-0 left-0 z-50">
              {cssEditor ?
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md"
                  onClick={() => setCssEditor(false)}
                >
                  Close Css Editor
                </button> :
                <button
                  className="bg-cyan-500 text-white px-4 py-1 rounded-md"
                  onClick={() => setCssEditor(true)}
                >
                  Open Css Editor
                </button>
              }
            </div> */}
        </div>

      </div>
      {/* </AllContextProviders> */}
    </div>
  );
}
// @codemirror/lang-python @lezer/highlight @uiw/codemirror-extensions-langs @uiw/codemirror-themes @uiw/codemirror-themes-all @uiw/react-codemirror
// animejs axios codemirror html2canvas node-fetch openai pyodide react-cropper
// react-icons react-image-crop react-markdown react-syntax-highlighter react-toastify 