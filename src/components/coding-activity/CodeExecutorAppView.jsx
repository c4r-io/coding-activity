import MainView from "./MainView.jsx";
import { AllContextProviders } from "@/contextapi/code-executor-api/AllContextProviders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssEditorView from "./CssEditorView.jsx";
import CustomCssInjector from "./CustomCssInjector.jsx";
import UpdateCustomizedDataButton from "./UpdateCustomizedDataButton.jsx";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useState } from "react";
export default function CodeExecutorAppView({ codingActivityId, uiDataFromDb, children }) {
  const [cssEditor, setCssEditor] = useState(true)
  return (
    <div className="max-h-max min-w-[1200px] pb-2">
      <AllContextProviders>
        <CustomCssInjector />
        <div className="mb-4 flex flex-wrap">
          {/* injected buttons as children to make all buttons in one row */}
          {children}
          <UpdateCustomizedDataButton />
        </div>
        <div className="flex -m-1 w-[1200px] relative">
          {cssEditor ?
            <div className=" w-[450px] h-[500px] sticky top-0 right-0">
              <div className="border border-dashed border-gray-400">
                <CssEditorView />
              </div>
            </div> : ""
          }
          <div className="p-1 w-[750px] border relative border-dashed border-gray-400">

            <div className="absolute top-0 left-0 z-50">
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
            </div>
            <div
              className={`flex justify-center pt-6`}
            >
              <div className={`annotation max-w-[750px]`}>
                <MainView devmode={true} codingActivityId={codingActivityId} uiDataFromDb={uiDataFromDb} />
                <ToastContainer />
              </div>
            </div>
            <div className="absolute top-0 left-0 z-50">
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
            </div>
          </div>

        </div>
      </AllContextProviders>
    </div>
  );
}
// @codemirror/lang-python @lezer/highlight @uiw/codemirror-extensions-langs @uiw/codemirror-themes @uiw/codemirror-themes-all @uiw/react-codemirror
// animejs axios codemirror html2canvas node-fetch openai pyodide react-cropper
// react-icons react-image-crop react-markdown react-syntax-highlighter react-toastify 