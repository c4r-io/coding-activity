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

  return (
    <div className="max-h-max min-w-[750px] pb-2 overflow-auto">
      {/* <AllContextProviders> */}
      <CustomCssInjector />
        {/* injected buttons as children to make all buttons in one row */}
      {/* <div className="mb-4 flex flex-wrap">
        {children}
        <UpdateCustomizedDataButton />
      </div> */}
      <div className="flex -m-1 w-[750px] relative">
        <div className="p-1 w-[750px] relative">
          <div
            className={`flex justify-center pt-6`}
          >
            <div className={`annotation max-w-[750px]`}>
              <MainView devmode={true} codingActivityId={codingActivityId} uiDataFromDb={uiDataFromDb} />
              <ToastContainer />
            </div>
          </div>
        </div>

      </div>
      {/* </AllContextProviders> */}
    </div>
  );
}
// @codemirror/lang-python @lezer/highlight @uiw/codemirror-extensions-langs @uiw/codemirror-themes @uiw/codemirror-themes-all @uiw/react-codemirror
// animejs axios codemirror html2canvas node-fetch openai pyodide react-cropper
// react-icons react-image-crop react-markdown react-syntax-highlighter react-toastify 