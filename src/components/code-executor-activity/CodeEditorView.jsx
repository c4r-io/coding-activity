"use client";
import React, { Fragment, useEffect, useCallback, useRef, useState } from "react";
import EditorViewTopCardUi from "./cards/EditorViewTopCardUi.jsx";
import { UiDataContext } from "@/contextapi/code-executor-api/UiDataProvider.jsx";
import { ChatMessagesContext } from "@/contextapi/code-executor-api/ChatMessagesProvider.jsx";
import { api } from "@/utils/apibase.js";
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
import DrawerArround from "./DrawerArround.jsx";
import { WebR } from 'webr';

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
  const { uiData, dispatchUiData } = React.useContext(UiDataContext);

  const { messages, dispatchMessages } = React.useContext(ChatMessagesContext);
  let pyodide = useRef(null);
  let pyodideLoaded = useRef(null);


  let webRLoaded = useRef(false);
  const webRRef = useRef(null);
  const webR2Ref = useRef(null);
  useEffect(() => {
    if (!uiData.devmode) {
      webRRef.current = new WebR()
      webR2Ref.current = new WebR()
    }
  }, [uiData.devmode])
  const webR = webRRef.current;
  const webR2 = webR2Ref.current;

  const [code, setCode] = React.useState("");
  const [isCodeExecuting, setIsCodeExecuting] = React.useState(false);
  const [isCodeFormating, setIsCodeFormating] = React.useState(false);
  const [isIssueSubmitting, setIsIssueSubmitting] = React.useState(false);
  const [isIssueSubmitted, setIsIssueSubmitted] = React.useState(false);
  const [packagesLoading, setPackagesLoading] = React.useState(false);
  const [issueDiscription, setIssueDiscription] = React.useState(null);
  const [issueAttachment, setIssueAttachment] = React.useState(null);
  const [executedCodeOutput, setExecutedCodeOutput] = React.useState(null);
  const [isWebRImage, setIsWebRImage] = React.useState(false);
  const [expandBottomSection, setExpandBottomSection] = React.useState(!uiData.devmode);
  const handleExpandBottomSection = () => {
    dispatchUiData({ type: 'setOpenReportUi', payload: !uiData.openReportUi })
  };

  useEffect(() => {
    if (uiData.devmode) {
      dispatchUiData({ type: 'setOpenReportUi', payload: true })
    }
    setCode(uiData?.uiContent?.defaults?.code || "")
  }, [uiData.devmode, uiData?.uiContent?.defaults?.code])


  const getReadyWebR = useCallback(async function getReadyWebR() {
    await webR?.init();

    // Set the default graphics device and pager
    await webR?.evalRVoid('webr::pager_install()');
    await webR?.evalRVoid('webr::canvas_install()');

    // shim function from base R with implementations for webR
    // see ?webr::shim_install for details.
    await webR?.evalRVoid('webr::shim_install()');

  }, [])
  useEffect(() => {
    if (!webRLoaded.current && !uiData.devmode) {
      getReadyWebR();
      webRLoaded.current = true;
      console.log("R added");
    }
  }, [webRLoaded.current, uiData.devmode]);
  const [outputImageUrl, setOutputImageUrl] = useState(null);
  const graphicsCode = ["plot", "barplot", "pie"]
  const runWebRCode = async (apiCallCount = 1) => {
    if (code == "") {
      toast.error("Please enter code to execute");
      return;
    }
    // const nc = code.replaceAll("plt.show()", pltshow);
    // const nc2 = nc.replaceAll(/print\((.*?)\)/g, "$1");
    setIsCodeExecuting(true);
    console.log("code   ", code);
    try {
      setOutputImageUrl(null);
      const canvas = document.getElementById('plot-canvas');
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      if (graphicsCode.some((gc) => code.includes(gc))) {
        setIsWebRImage(true);
        const res = await webR2.evalRVoid(`
        webr::shim_install()
        webr::canvas()
        ${code}
        dev.off()
      `);

        const output2 = await webR2.read();
        console.log("output type 2 ", output2.type);
        const msgs = await webR2.flush();
        msgs.forEach(async (msg) => {
          if (msg?.type === 'canvas' && msg?.data.event === 'canvasImage') {
            console.log(JSON.stringify(msg.data.image));
            canvas.getContext('2d').drawImage(msg.data.image, 0, 0);

          } else {
            console.log(msg);
          }
        });
        // webR2?.destroy(res);
      } else {
        let result = await webR.evalR(`
        webr::shim_install()
        ${code}
        `);
        let output = await result.toArray();
        const output1 = await webR.read();

        console.log("output type 1 ", output1.type, output1.data);
        console.log('Result of running `rnorm` from webR: ', output);
        webR.destroy(result);
        setExecutedCodeOutput({
          output: output,
          error: null,
        });
      }

      setIsCodeExecuting(false);
      setExpandBottomSection(true);
    } catch (error) {
      if (apiCallCount <= 3) {
        setTimeout(() => {
          console.log("running count", apiCallCount);
          runWebRCode(apiCallCount + 1);
        }, 500 * apiCallCount);
      } else {
        setExecutedCodeOutput({
          output: null,
          error: error,
        });
        setIsCodeExecuting(false);
      }
      getReadyWebR()
      console.error(error);
    }
  };

  async function getReadyPyodide() {
    if (uiData.devmode) {
      return;
    }
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
    if (uiData.devmode) {
      dispatchUiData({ type: 'setContent', payload: { key: "defaults.code", data: e } });
    }
  };


  const pltshow = `
from io import BytesIO
import base64
buf = BytesIO()
plt.savefig(buf, format="jpeg")
buf.seek(0)
dt = "data:image/jpeg;base64,"+ base64.b64encode(buf.read()).decode()
expectedop.append(dt)`;
  const pep8FromatEer = `
import autopep8

code = """
{codestring}
"""
autopep8.fix_code(code)`;

  function preparedCodeForPep8() {
    return pep8FromatEer.replaceAll("{codestring}", code.replaceAll('"""', '\\"\\"\\"'));
  }
  const runCode = (apiCallCount = 1) => {
    if (code == "") {
      toast.error("Please enter code to execute");
      return;
    }
    const modifiedCode = `
import json
expectedop = []
${code}
`
    const nc = modifiedCode.replaceAll("plt.show()", pltshow);
    const nc2 = nc.replaceAll(/print\((.*?)\)/g, "expectedop.extend([$1])");
    setIsCodeExecuting(true);
    const executableCode = `
${nc2}
json.dumps(expectedop, indent=2)
`
    try {
      console.log(
        pyodide.current.runPython(`
${executableCode}
`))

      const op = pyodide.current.runPython(`
${executableCode}`)
        ;
      const stringOutput = JSON.parse(op);
      console.log("op code", stringOutput);
      setExecutedCodeOutput({
        output: stringOutput.filter((op) => !String(op).includes("data:image")).join("\n"),
        images: stringOutput.filter((op) => String(op).includes("data:image")),
        error: null,
      });
      setIsCodeExecuting(false);
      dispatchUiData({ type: 'setOpenReportUi', payload: false })
    } catch (error) {
      if (apiCallCount <= 3) {
        setTimeout(() => {
          console.log("running count", apiCallCount);
          runCode(apiCallCount + 1);
        }, 500 * apiCallCount);
      } else {
        setExecutedCodeOutput({
          output: null,
          images: null,
          error: JSON.stringify(error),
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
        }, 500 * apiCallCount);
      } else {
        setExecutedCodeOutput({ error: error });
        setIsCodeFormating(false);
      }
      getReadyPyodide()
      console.error(error);
    }
  };

  // aws code runner 

  const pltshowAws = `
import json
from io import BytesIO
buf = BytesIO()
plt.savefig(buf, format="svg")
buf.seek(0)
output = {}
output["type"] = "image"
output["content"] = buf.read().decode("utf-8")
print(json.dumps(output))`;
  const pep8FromaterAws = `
import autopep8

code = """
{codestring}
"""
print(autopep8.fix_code(code))`;

  const pythonExecutorApi = axios.create({
    baseURL: "https://em8ez2rypi.execute-api.us-east-2.amazonaws.com",
  });
  const runCodeAws = async (apiCallCount = 1) => {
    if (code == "") {
      toast.error("Please enter code to execute");
      return;
    }
    const modifiedCode = `
import json
expectedop = []
${code}
`
    const nc = modifiedCode.replaceAll("plt.show()", pltshow);
    const nc2 = nc.replaceAll(/print\((.*?)\)/g, "expectedop.extend([$1])");
    setIsCodeExecuting(true);
    const executableCode = `
${nc2}
opdt = json.dumps(expectedop, indent=2)
print(opdt)
`
    // const nc2 = nc.replaceAll(/print\((.*?)\)/g, "$1");
    console.log(nc);
    setIsCodeExecuting(true);
    try {
      const config = {
        method: "post",
        url: "default",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          code: `print('New Code Running...')\n${executableCode}`,
        }
      }
      const response = await pythonExecutorApi.request(config);
      if (response.data?.body) {
        const output = JSON.parse(response.data?.body)?.output;
        const error = JSON.parse(response.data?.body)?.error;
        let op = []
        const imagesList = []
        if (output) {
          for (const [key, value] of Object.entries(output)) {
            if (value != 'New Code Running...') {
              // console.log("val",value)
              op.push(value)
              // try {
              //   const data = JSON.parse(value)
              //   if (data.type == "image") {
              //     imagesList.push(data.content)
              //   }
              // } catch (e) {
              //   if (!value.includes("Matplotlib created a temporary cache directory at")) {
              //     op.push(value)
              //   }
              // }

            }
          }
          // setExecutedCodeImageOutput(imagesList)
          const stringOutput = JSON.parse(JSON.stringify(op))
          stringOutput.shift()
          stringOutput.pop()
          const modifiedStringOp = stringOutput.map((op) => {
            op = op.replaceAll("\"", "")
            return  op;
          })
          setExecutedCodeOutput({
            output: modifiedStringOp.filter((op) => !String(op).includes("data:image")).join("\n"),
            images: modifiedStringOp.filter((op) => String(op).includes("data:image")),
            error: null,
          });
        }
        if (error) {
          // setExecutedCodeErrorOutput("Error: " + error);
        }
        // console.log(op)
      } else if (response.data?.errorMessage) {
        // setExecutedCodeErrorOutput(response.data?.body);
      }
      setIsCodeExecuting(false);
      setExpandBottomSection(true);
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
      // getReadyPyodide()
      console.error(error);
    }
  };
  // aws code runner
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
                  height={`${code.split("\n").length * 19.5 + 20}px`}
                />
                {(uiData.activityCodeRuntime === "Pyodide" || uiData.activityCodeRuntime === "Python Aws Api") &&
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
                }
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
                      onClick={() => {
                        if (uiData.activityCodeRuntime === "Pyodide") {
                          runCode()
                        }
                        else if (uiData.activityCodeRuntime === "Python Aws Api") {
                          runCodeAws()
                        }
                        else if (uiData.activityCodeRuntime === "Web-R") {
                          runWebRCode()
                        }
                      }}
                    >
                      {isCodeExecuting ? <div className="w-full flex justify-center items-center"><img className="w-6 h-6" src="/images/loading.gif" /></div> : "Execute"}
                    </button>
                  </EditTextElementWrapper>
                </div>
              </div>
              {(uiData.devmode || uiData.activityCodeRuntime === "Web-R") &&
                <div className={`${isWebRImage || uiData.devmode ? '' : 'hidden'}`}>
                  <DrawerArround>
                    <canvas id="plot-canvas" className="bg-white w-full" width="1008" height="1008"></canvas>
                  </DrawerArround>
                </div>
              }
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
                      {(typeof executedCodeOutput?.output == "string" || executedCodeOutput?.error) &&
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
                        />}
                      {executedCodeOutput?.images && executedCodeOutput?.images.length > 0 &&
                        <DrawerArround>
                          {executedCodeOutput?.images.map((img, index) => (
                            <img
                              key={index}
                              src={`${img}`}
                              alt="output"
                              className="w-full h-auto"
                            />
                          ))}
                        </DrawerArround>
                      }

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
          </div>
        </div>
      </ReactCrop>
    </div>
  );
}
