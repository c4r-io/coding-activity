"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import EditorViewTopCardUi from "./cards/EditorViewTopCardUi.jsx";
import { UiDataContext } from "@/contextapi/code-executor-api/UiDataProvider.jsx";
import { ChatMessagesContext } from "@/contextapi/code-executor-api/ChatMessagesProvider.jsx";
import { api, authorDaashboardApi } from "@/utils/apibase.js";
import { toast } from "react-toastify";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdClear,
} from "react-icons/md";
import axios from "axios";

import html2canvas from "html2canvas";

import "react-image-crop/dist/ReactCrop.css";

import ReactCrop from "react-image-crop";
import ChatPromptTopCardUi from "./cards/ChatPromptTopCardUi.jsx";
import Script from "next/script.js";
import CodeMirrorEidtor from "./CodeMirrorEidtor.jsx";
import EditTextElementWrapper from "./editors/EditTextElementWrapper.jsx";

const demoCode = `

# Python code demo
# This is an example
class Math:
    @staticmethod
    def fib(n: int):
        """Fibonacci series up to n."""
        a, b = 0, 1
        while a < n:
            yield a
            a, b = b, a + b
result = sum(Math.fib(42))
print("The answer is {}".format(result))

`;
const seabornDemoCode = `
import seaborn as sns
import matplotlib.pyplot as plt

url = 'https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv' # based on [Data repository for seaborn examples](https://github.com/mwaskom/seaborn-data)
from pyodide.http import open_url
import pandas
df = pandas.read_csv(open_url(url))

# create a seaborn plot
sns.set(style="darkgrid")
ax = sns.scatterplot(x="total_bill", y="tip", data=df)

plt.show()

`;
export default function CodeEditorView() {

  const { messages, dispatchMessages } = React.useContext(ChatMessagesContext);
  let pyodide = useRef(null);
  let pyodideLoaded = useRef(null);

  const [code, setCode] = React.useState("");
  const [isCodeExecuting, setIsCodeExecuting] = React.useState(false);
  const [isCodeFormating, setIsCodeFormating] = React.useState(false);
  const [isIssueSubmitting, setIsIssueSubmitting] = React.useState(false);
  const [isIssueSubmitted, setIsIssueSubmitted] = React.useState(false);
  const [packagesLoading, setPackagesLoading] = React.useState(false);
  const [issueDiscription, setIssueDiscription] = React.useState(null);
  const [issueAttachment, setIssueAttachment] = React.useState(null);
  const [executedCodeOutput, setExecutedCodeOutput] = React.useState(null);
  const { uiData, dispatchUiData } = React.useContext(UiDataContext);
  const [editorFocused, setEditorFocused] = React.useState('');
  const [expandBottomSection, setExpandBottomSection] = React.useState(!uiData.devmode);
  const handleExpandBottomSection = () => {
    dispatchUiData({ type: 'setOpenReportUi', payload: !uiData.openReportUi })
  };

  useEffect(() => {
    if (uiData.devmode) {
      dispatchUiData({ type: 'setOpenReportUi', payload: true })
    }
  }, [uiData.devmode])


  async function getReadyPyodide() {
    pyodide.current = await window.loadPyodide();
    await pyodide.current.loadPackage("micropip");
    await pyodide.current.loadPackage("sympy");
    const micropip = pyodide.current.pyimport("micropip");
    await micropip.install("matplotlib");
    await micropip.install("numpy");
    await micropip.install("autopep8");
    // await micropip.install("rpy2");
    await micropip.install("seaborn"); // dynamic loads not working in pyodide
    await micropip.install("pandas");
    await micropip.install("sympy");
    // await micropip.install("datasets"); // showing problem
    // await micropip.install("sklearn"); // showing problem
    // await micropip.install("scikit-learn"); // showing problem
    // await micropip.install("scipy"); // showing problem
  }
  // vanila react way
  // useEffect(() => {
  //   if (pyodide.current == null) {
  //     const script = document.createElement("script");
  //     script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
  //     script.type = "text/javascript";
  //     document.head.appendChild(script);
  //     pyodideLoaded.current = true;
  //     console.log("pyodide script added");
  //   }
  //   if (pyodideLoaded.current == true) {
  //     console.log("pyodide loaded");

  //     getReadyPyodide();
  //   }
  // }, [pyodideLoaded.current]);
  const handleOnChange = (e) => {
    setCode(e);
    dispatchMessages({ type: "setCode", payload: e })
  };


  const pltshow = `
from io import BytesIO
buf = BytesIO()
plt.savefig(buf, format="svg")
buf.seek(0)
buf.read().decode("utf-8")`;
  const pep8FromatEer = `
import autopep8

code = """
{codestring}
"""
autopep8.fix_code(code)`;

  function preparedCodeForPep8() {
    return pep8FromatEer.replaceAll("{codestring}", code.replaceAll('"""', '\\"\\"\\"'));
  }
  const pythonExecutorApi = axios.create({
    // baseURL: "http://127.0.0.1:8000/", // local development django server
    baseURL: "https://python-executor.vercel.app/",
  });
  const runCode = (apiCallCount = 1) => {
    if (code == "") {
      toast.error("Please enter code to execute");
      return;
    }
    const nc = code.replaceAll("plt.show()", pltshow);
    const nc2 = nc.replaceAll(/print\((.*?)\)/g, "$1");
    setIsCodeExecuting(true);
    try {
      // const response = await pythonExecutorApi.request(config);
      const op = pyodide.current.runPython(`
${nc2}`);
      // if (typeof op == "object") {
      //   console.log("op code obj",op, JSON.stringify(op));
      // } else if(typeof op == "string") {
      // }
      // console.log("op code str", op, nc2);
      // console.log("code nc", nc);
      setExecutedCodeOutput({
        output: op,
        error: null,
      });
      setIsCodeExecuting(false);
      dispatchUiData({ type: 'setOpenReportUi', payload: false })
    } catch (error) {
      if (apiCallCount <= 3) {
        setTimeout(() => {
          console.log("running count", apiCallCount);
          runCode(apiCallCount + 1);
        }, 5000 * apiCallCount);
      } else {
        setExecutedCodeOutput({
          output: null,
          error: error,
        });
        setIsCodeExecuting(false);
      }
      getReadyPyodide()
      console.error(error);
    }
  };
  const formatCodeWithPep8 = async (apiCallCount = 1) => {
    if (code == "") {
      toast.error("Please enter code to execute");
      return;
    }
    const fc = preparedCodeForPep8();

    setIsCodeFormating(true);
    try {
      const op = await pyodide.current.runPython(`
${fc}
        `);
      setCode(op);
      setIsCodeFormating(false);
    } catch (error) {
      if (apiCallCount <= 3) {
        setTimeout(() => {
          console.log("running count", apiCallCount);
          formatCodeWithPep8(apiCallCount + 1);
        }, 5000 * apiCallCount);
      } else {
        setExecutedCodeOutput({ error: error });
        setIsCodeFormating(false);
      }
      getReadyPyodide()
      console.error(error);
    }
  };
  const createSamplePythonExecutorIssueList = async () => {
    if (issueDiscription == null) {
      toast.error("Please enter issue description", {
        position: "top-center",
      });
      return;
    }
    const config = {
      method: "post",
      url: "api/code-executor-issue-list",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        codeExecutorActivity: uiData.codingActivityId,
        description: issueDiscription,
        attachment: issueAttachment,
      },
    };
    setIsIssueSubmitting(true);
    try {
      const response = await api.request(config);
      console.log(response.data);
      setIsIssueSubmitting(false);
      toast.success("Your Issue Submitted Successfully!", {
        position: "top-center",
      });
      setIssueDiscription(null);
      setIssueAttachment(null);
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
        router.push("/");
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      console.error(error);
      setIsIssueSubmitting(false);
    }
  };
  const pc = `
  str = "Hello World"
  print(str)
  `;



  // implement take screenshot functionality
  const [crop, setCrop] = useState();

  const takeScreenshotHanlder = () => {
    const { x, y, width, height } = crop;
    console.log("crop", crop);
    if (width == 0 || height == 0) return;
    // Select the HTML element to be cropped
    const elementToCrop = document.getElementById("elementToCrop");
    // const body = document.getElementById("root");

    // // Create a temporary canvas element
    // const canvas = document.createElement("canvas");
    // canvas.width = width;
    // canvas.height = height;

    // Calculate the offset of the element
    // const rect = elementToCrop.getBoundingClientRect();

    // Draw the cropped area onto the canvas
    html2canvas(elementToCrop, {
      x: x,
      y: y,
      width,
      height,
    }).then((canvas) => {
      // Convert the canvas content to base64 image data
      const base64ImageData = canvas.toDataURL("image/png");

      // Log or use the base64ImageData as needed
      // console.log(base64ImageData);
      dispatchMessages({ type: "setImage", payload: base64ImageData });
      dispatchUiData({ type: "setChatScreenStatus", payload: "followUpAskQuestion" });
      setTimeout(() => {
        // dispatchMessages({type: "setTakeScreenshot", payload: false});
        dispatchUiData({ type: "setScreen", payload: "chat" });
        setCrop();
      }, 300);
    });
  };

  const closeHelpModalHandler = () => {
    dispatchMessages({ type: "setTakeScreenshot", payload: false });
    dispatchMessages({ type: "setImage", payload: false });
    setCrop();
  };
  return (
    <div className="annotation code-editor-container">
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"
        onLoad={() => getReadyPyodide()}
      />
      {/* <div className="bg-black text-white">{JSON.stringify(uiData)}</div> */}
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        disabled={!messages.takeScreenshot}
        onDragEnd={takeScreenshotHanlder}
      >
        <div id="elementToCrop" className="cropper-container">
          <div className={`${messages.takeScreenshot ? 'hidden' : 'block'}`}>
            <EditorViewTopCardUi />
          </div>
          <div className={`${!messages.takeScreenshot ? 'hidden' : 'block'}`}>
            <ChatPromptTopCardUi headerText={"Take Screenshot"} />
          </div>
          <div className={`${!messages.takeScreenshot ? 'ps-4 pe-14 widget' : 'ps-12 pe-10 widget'}`}>
            <div className="mx-3 p-1 pb-0 border-x-2 space-y-3 border-ui-violet rounded-xl bg-[#171819] text-white">
              <div className="p-3 pb-0 mt-3 relative group">

                <CodeMirrorEidtor
                  value={code}
                  onChange={(e) => {
                    handleOnChange(e);
                  }}
                />
                <div className="buttons absolute top-[10px] right-[10px]">
                  <div className="progressive">

                    <EditTextElementWrapper
                      className={`unclicked py-0.5 px-3 rounded-sm pep8-formatter-button text-center`}
                      path={"editorview.editorPep8Btn"}
                      buttonEditor={true}
                    >
                      <button
                        className={`${isCodeFormating ? "clicked" : "unclicked"
                          } py-0.5 px-3 rounded-sm pep8-formatter-button`}
                        onClick={() => formatCodeWithPep8()}
                      >
                        {isCodeFormating ? "Formating" : uiData?.uiContent?.editorview?.editorPep8Btn}
                      </button>
                    </EditTextElementWrapper>
                  </div>
                </div>
              </div>
              <div className="px-3 pt-0 flex justify-between buttons -m-2">
                <div className="passive w-1/2 m-2">
                  <EditTextElementWrapper
                    className={`unclicked py-2 px-3 w-full !text-sm text-center`}
                    path={"editorview.editorNeedHelpBtn"}
                    buttonEditor={true}
                  >
                    <button
                      className={`${messages.takeScreenshot ? "clicked" : "unclicked"
                        } py-2 px-3 w-full !text-sm `}
                      onClick={() =>
                        dispatchMessages({ type: "setTakeScreenshot", payload: true })}
                    >
                      I need help with this!
                    </button>
                  </EditTextElementWrapper>

                </div>
                <div className="progressive w-1/2 m-2">
                  <EditTextElementWrapper
                    className={`unclicked py-2 px-3 w-full !text-sm text-center`}
                    path={"editorview.editorActionBtn"}
                    buttonEditor={true}
                  >

                    <button
                      className={`${isCodeExecuting ? "clicked" : "unclicked"
                        } py-2 px-3 w-full !text-sm`}
                      onClick={() => runCode()}
                    >
                      {isCodeExecuting ? <img className="w-6 h-6" src="/images/loading.gif" /> : "Execute"}
                    </button>
                  </EditTextElementWrapper>
                </div>
              </div>
              {!uiData?.openReportUi && executedCodeOutput && (
                <div className="px-3 space-y-3">
                  <div className="divider w-full"></div>
                  <div className="relative group">
                    <button
                      className="absolute top-0 right-0 text-white group-hover:block hidden"
                      onClick={() => {
                        setExecutedCodeOutput(null);
                      }}
                    >
                      <MdClear />
                    </button>
                    <div
                      className="px-2 py-1 codeoutput-bg text-white"
                      id="codeoutput-bg"
                    >
                      {typeof executedCodeOutput?.output == "string" &&
                        executedCodeOutput?.output?.includes(
                          'xmlns:xlink="http://www.w3.org/1999/xlink"'
                        ) ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: executedCodeOutput?.output,
                          }}
                        ></div>
                      ) : (
                        <textarea
                          type="textarea"
                          disabled
                          className={`h-64 w-full codeoutput-bg ${!executedCodeOutput?.error
                            ? "text-white"
                            : "text-red-600"
                            }`}
                          value={
                            executedCodeOutput?.error ||
                            executedCodeOutput?.output?.toString() ||
                            "No output found"
                          }
                        ></textarea>
                      )}
                      {/* {executedCodeOutput?.error &&
                    !(
                      typeof executedCodeOutput?.output == "string" &&
                      executedCodeOutput?.output?.includes(
                        'xmlns:xlink="http://www.w3.org/1999/xlink"'
                      )
                    ) && (
                      <textarea
                        type="textarea"
                        disabled
                        className="h-64 w-full codeoutput-bg text-red-600"
                        value={executedCodeOutput?.error || ""}
                      ></textarea>
                    )} */}
                      {/* {JSON.stringify(executedCodeOutput)} */}
                    </div>
                  </div>
                </div>
              )}
              {uiData?.openReportUi && (
                <div className="px-3 space-y-3">
                  <div className="divider w-full"></div>
                  <div className="h-64 codeoutput-bg">
                    <textarea
                      className="h-full w-full m-0 px-2 py-1 codeoutput-bg text-white"
                      type="textarea"
                      placeholder="Describe your issue here"
                      value={issueDiscription || ""}
                      onChange={(e) => {
                        setIssueDiscription(e.target.value);
                      }}
                    />
                  </div>

                  <EditTextElementWrapper
                    className={`buttons passive unclicked btn py-2 px-3 w-full h-20 flex justify-center items-center`}
                    path={"editorview.editorActionAttachScreenshot"}
                    buttonEditor={true}
                  >
                    <Fragment>
                      <div className="mt-0 buttons w-full h-20 relative">
                        <label
                          className="opacity-0 w-full h-20 absolute"
                          htmlFor="issueFile"
                        >
                          Attach Schreenshot {issueAttachment?.name}
                        </label>
                        <input
                          className="opacity-0 w-full h-20 absolute"
                          id="issueFile"
                          type="file"
                          placeholder="Describe your issue here"
                          onInput={(e) => {
                            setIssueAttachment(e.target.files[0]);
                          }}
                        />
                        <div className="passive">
                          <button
                            className={`${issueAttachment ? "clicked" : "unclicked"
                              } py-2 px-3 w-full h-20`}
                          >
                            {uiData?.uiContent?.editorview?.editorActionAttachScreenshot}
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  </EditTextElementWrapper>

                  <div className=" buttons w-full h-12">
                    <div className="progressive">

                      <EditTextElementWrapper
                        className={`unclicked py-2 px-3 w-full h-12  flex justify-center items-center`}
                        path={"editorview.editorActionSubmitAttachment"}
                        buttonEditor={true}
                      >
                        <button
                          className={`${isIssueSubmitting
                            ? "clicked pointer-events-none"
                            : "unclicked"
                            } py-2 px-3 w-full h-12`}
                          onClick={createSamplePythonExecutorIssueList}
                        >
                          {isIssueSubmitting ? "Submitting..." : uiData?.uiContent?.editorview?.editorActionSubmitAttachment}
                        </button>
                      </EditTextElementWrapper>
                    </div>
                  </div>
                </div>
              )}
              <div className="pb-2"></div>
            </div>
            {/* expansion btn */}
            <div className="expand-bootom-container">

              <div className="expand-bootom-action">
                <button
                  className="bootom-action-btn"
                  onClick={() => handleExpandBottomSection()}
                >
                  <div className="w-[30px] flex justify-center text-lg">
                    {!uiData?.openReportUi ? (
                      <MdKeyboardArrowDown />
                    ) : (
                      <MdKeyboardArrowUp />
                    )}
                  </div>
                  <p className="text-center text-[10px]">
                    {!uiData?.openReportUi ? "Running Into Issue" : "Close"}
                  </p>
                  <div className="w-[30px] flex justify-center text-lg">
                    {!uiData?.openReportUi ? (
                      <MdKeyboardArrowDown />
                    ) : (
                      <MdKeyboardArrowUp />
                    )}
                  </div>
                </button>
              </div>
            </div>
            {/* {runningIssueStatus (
        )} */}
          </div>
        </div>
      </ReactCrop>
    </div>
  );
}
