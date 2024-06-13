"use client";
import { api } from "@/utils/apibase";
import { getToken } from "@/utils/token";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/contextapi/UserProvider";
import CodeExecutorDevelopmentView from "@/components/coding-activity/CodeExecutorDevelopmentView";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import * as changeCase from "change-case";
import LayoutComponent from '@/components/customLayouts/LayoutComponent'; // Ensure this path is correct
import { IoMdMenu } from 'react-icons/io';
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';
import { AllContextProviders } from "@/contextapi/code-executor-api/AllContextProviders";
import SidebarContentEditor from "@/components/coding-activity/editors/SidebarContentEditor";
import UpdateCustomizedDataButton from "@/components/coding-activity/UpdateCustomizedDataButton";
import { CgArrowsHAlt } from "react-icons/cg";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
const Page = ({ params }) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(prev => !prev);
  const toggleRightSidebar = () => setIsRightSidebarOpen(prev => !prev);

  const { userData, dispatchUserData } = useContext(UserContext);
  const router = useRouter();
  const [editAdditionalInfo, setEditAdditionalInfo] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activityTitle, setActivityTitle] = useState(null);
  const [gptModel, setGptModel] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState(null);
  const [codeRefPrompt, setCodeRefPrompt] = useState(null);
  const [activityDefaultCode, setActivityDefaultCode] = useState(null);
  const [activityCodeExecutor, setActivityCodeExecutor] = useState(null);
  const [activityCodeRuntime, setActivityCodeRuntime] = useState(null);
  const [deleteList, setDeleteList] = useState([]);
  const [codingActivityListResponse, setCodingActivityListResponse] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const getVideoClipList = async () => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "GET",
      url: "/api/coding-activity/" + params.codingActivityId,
      headers: {
        Authorization: `Bearer ${getToken("token")}`,
      },
    };
    try {
      const response = await api.request(config);
      setCodingActivityListResponse(response.data.results);
      setGptModel(response.data?.results?.gptModel);
      console.log("response", response.data.results);
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
        router.push("/dashboard");
        return;
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      router.push("/dashboard/coding-activity");
      console.error(error);
    }
  };
  useEffect(() => {
    getVideoClipList();
  }, [params.codingActivityId]);
  useEffect(() => {
    setCodingActivityListResponse(state => {
      return {
        ...state,
        activityCodeRuntime: activityCodeRuntime
      }

    });
  }, [activityCodeRuntime])
  const [gptModelList, setGptModelList] = useState([]);
  const getGPTModels = async () => {
    const origin = location.origin
    const url = `${origin}/api/chatgpt/gpt_4_vision_preview`;
    // const url = 'http://localhost:3030/api/chatgpt/gpt_4_vision_preview';
    const modelsFromSessionStorage = sessionStorage.getItem('gptModels');
    if (modelsFromSessionStorage) {
      const models = JSON.parse(modelsFromSessionStorage);
      setGptModelList(models);
      return;
    }
    try {
      const request = await fetch(url, {
        method: 'GET',
        headers: { // multipart form data
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await request.json();
      console.log("gpt models", response.data);
      if (response?.body?.data) {
        setGptModelList(response.body.data);
        sessionStorage.setItem('gptModels', JSON.stringify(response.body.data));
      } else {
        setGptModelList(response.data);
        sessionStorage.setItem('gptModels', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getGPTModels();
  }, [])
  function extractQueryParam(url, param) {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);
    return searchParams.get(param);
  }

  // update user data
  // content type form data
  const updateInfo = async (e) => {
    dispatchUserData({ type: "checkLogin" });
    const data = {};
    if (gptModel && codingActivityListResponse?.gptModel !== gptModel) {
      data.gptModel = gptModel;
    }
    if (codeRefPrompt && codingActivityListResponse?.codeRefPrompt !== codeRefPrompt) {
      data.codeRefPrompt = codeRefPrompt;
    }
    if (systemPrompt && codingActivityListResponse?.systemPrompt !== systemPrompt) {
      data.systemPrompt = systemPrompt;
    }
    if (activityTitle && codingActivityListResponse?.activityTitle !== activityTitle) {
      data.activityTitle = activityTitle;
    }
    if (activityDefaultCode && codingActivityListResponse?.activityDefaultCode !== activityDefaultCode) {
      data.activityDefaultCode = activityDefaultCode;
    }
    if (activityCodeExecutor && codingActivityListResponse?.activityCodeExecutor !== activityCodeExecutor) {
      data.activityCodeExecutor = activityCodeExecutor;
    }
    if (activityCodeRuntime) {
      data.activityCodeRuntime = activityCodeRuntime;
    }
    if (Object.keys(data).length <= 0) {
      return;
    }
    setUpdateLoading(true);
    const config = {
      method: "put",
      url: "/api/coding-activity/" + params.codingActivityId,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken("token")}`,
      },
      // bodyObject
      data,
    };
    try {
      const response = await api.request(config);
      getVideoClipList();
      setUpdateLoading(false);
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
        // router.push('/');
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      setUpdateLoading(false);
      console.error(error);
    }
  };
  const handleFileChange = (e) => {
    const selectedfile = e.target.files[0]
    if (selectedfile.size > 1 * 1024 * 1024) {
      toast.error("File is too large, Max size is 1 MB", {
        position: "top-center",
      })
      setThumbnail(null);
    } else {
      setThumbnail(e.target.files[0])

    }
  }
  return (
    <AllContextProviders>
      <LayoutComponent
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
      >
        <LayoutComponent.Header>
          <div className="w-full h-full flex items-center">
            <div className=' flex justify-between content-center items-center -m-1 p-1 w-full h-full text-white text-lg'>
              <div className="p-1">
                <button className="p-1 bg-gray-200/10" onClick={toggleLeftSidebar}>
                  {isLeftSidebarOpen ? <IoMdMenu /> : <RiMenuUnfoldLine />}
                </button>
              </div>
              <div className="p-1 flex-1 ">
                <div className="flex items-center">
                  <div className="flex items-center -m-0.5 text-white text-lg">
                    <div className="p-0.5">
                      <button className="bg-gray-200/10 p-1">
                        <CgArrowsHAlt />
                      </button>
                    </div>
                    <div className="p-0.5">
                      <button className="bg-gray-200/10 p-1">
                        <BiSolidMessageRoundedDots />
                      </button>
                    </div>
                  </div>
                  <Link href={`/coding-activity/${params.codingActivityId}`}>
                    <button className="text-white bg-cyan-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >Preview</button>
                  </Link>
                  <div>
                    <button
                      className={`${editAdditionalInfo ? "hidden" : "block"} text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
                      onClick={() => setEditAdditionalInfo(true)}
                    >Settings</button>
                  </div>
                  <UpdateCustomizedDataButton />
                </div>
              </div>
              <div className="p-1">
                <button className="p-1 bg-gray-200/10" onClick={toggleRightSidebar}>
                  {isRightSidebarOpen ? <IoMdMenu /> : <RiMenuFoldLine />}
                </button>
              </div>
            </div>
          </div>
        </LayoutComponent.Header>
        <LayoutComponent.LeftSidebar>
          <div className="p-1 w-full h-full bg-gray-800 text-white">
            <Sidebar />
          </div>
        </LayoutComponent.LeftSidebar>
        <LayoutComponent.RightSidebar>
          <div className="p-2 w-full h-full bg-gray-800 text-white">
            <SidebarContentEditor />
          </div>
        </LayoutComponent.RightSidebar>
        <LayoutComponent.Main>
          <div className="p-1 bg-gray-700  h-full">
            <div className="p-2 border-2 border-dashed rounded-lg border-gray-600 flex justify-center h-full overflow-auto">
              <div className="min-w-[750px]">
                <div>
                  <div className={`${!editAdditionalInfo ? "hidden" : "block"} `}>
                    <div className="mb-6">
                      <label
                        htmlFor="activityTitle"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        {" "}
                        Activity Title
                      </label>
                      <input
                        type="text"
                        id="activityTitle"
                        className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
                        placeholder="Activity Title"
                        defaultValue={codingActivityListResponse?.activityTitle}
                        onInput={(e) => setActivityTitle(e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="activityCodeRuntime"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Select a Runtime option {activityCodeRuntime}
                      </label>
                      <select
                        value={codingActivityListResponse?.activityCodeRuntime}
                        onChange={(e) => setActivityCodeRuntime(e.target.value)}
                        id="activityCodeRuntime"
                        className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>Choose a Runtime</option>
                        <option value="Pyodide">Pyodide</option>
                        <option value="Python Aws Api">Python Aws Api</option>
                        <option value="Web-R">Web-R</option>
                      </select>
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="gptModel"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        {" "}
                        Gpt Model
                      </label>
                      <select
                        value={gptModel || ""}
                        onChange={(e) => setGptModel(e.target.value)}
                        id="gptModel"
                        className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>Choose a Model</option>
                        {gptModelList.map((model, index) => {
                          return <option key={index} value={model.id}>{changeCase.capitalCase(model.id)}</option>
                        })}
                      </select>

                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="codeRefPrompt"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        {" "}
                        Code Ref Prompt
                      </label>
                      <textarea
                        id="codeRefPrompt"
                        className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
                        placeholder="System prompt"
                        defaultValue={codingActivityListResponse?.codeRefPrompt}
                        onInput={(e) => setCodeRefPrompt(e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="systemPrompt"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        {" "}
                        System Prompt
                      </label>
                      <textarea
                        id="systemPrompt"
                        className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
                        placeholder="System prompt"
                        defaultValue={codingActivityListResponse?.systemPrompt}
                        onInput={(e) => setSystemPrompt(e.target.value)}
                      />
                    </div>
                    <div>
                      <button
                        onClick={updateInfo}
                        className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        {updateLoading ? "Updating..." : "Update Additional Info"}
                      </button>
                      <button
                        className="text-white bg-gradient-to-r from-red-500 to-yellow-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        onClick={() => setEditAdditionalInfo(false)}
                      >Close additional Info</button>
                    </div>
                  </div>
                  <CodeExecutorDevelopmentView codingActivityId={params.codingActivityId} uiDataFromDb={codingActivityListResponse} >

                  </CodeExecutorDevelopmentView>
                </div>
              </div>
            </div>
          </div>
        </LayoutComponent.Main>
      </LayoutComponent>
    </AllContextProviders>

  );
};
export default Page;
