"use client"
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
export default function CodeExecutorAppView({codingActivityId, uiDataFromDb}) {
  const [cssEditor, setCssEditor] = useState(false)
  return (
    <div className="overflow-x-hidden max-h-max pb-2">
      <AllContextProviders>
        <CustomCssInjector />
        <div
          className={`flex justify-center`}
        >
          <div className={`annotation max-w-[750px]`}>
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