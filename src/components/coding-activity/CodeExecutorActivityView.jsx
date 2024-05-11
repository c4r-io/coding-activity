"use client"
import MainView from "./MainView.jsx";
import { AllContextProviders } from "@/contextapi/code-executor-api/AllContextProviders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomCssInjector from "./CustomCssInjector.jsx";
export default function CodeExecutorActivityView({codingActivityId, uiDataFromDb}) {
  return (
    <div className="overflow-x-hidden max-h-max pb-2">
      {/* coding activity providers/stores */}
      <AllContextProviders>
        {/* innerHTML css which is being edited by author from /dashboard/coding-activity/:activityid */}
        <CustomCssInjector />
        <div
          className={`flex justify-center`}
        >
          <div className={`annotation max-w-[750px]`}>
            {/* we have 2 modes one for editable ui and other for output ui */}
            {/* editable ui for author */}
            {/* output ui for students */}
            <MainView  devmode={false} codingActivityId={codingActivityId} uiDataFromDb={uiDataFromDb} />
            <ToastContainer />
          </div>
        </div>
      </AllContextProviders>
    </div>
  );
}
// @codemirror/lang-python @lezer/highlight @uiw/codemirror-extensions-langs @uiw/codemirror-themes @uiw/codemirror-themes-all @uiw/react-codemirror
// animejs axios codemirror html2canvas node-fetch openai pyodide react-cropper
// react-icons react-image-crop react-markdown react-syntax-highlighter react-toastify 