"use client";
import { api } from "@/utils/apibase";
import { getToken } from "@/utils/token";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/contextapi/UserProvider";
import CodeExecutorAppView from "@/components/code-executor-activity/CodeExecutorAppView";
import Link from "next/link";
const Page = ({ params }) => {
  const { userData, dispatchUserData } = useContext(UserContext);
  const router = useRouter();
  const [editAdditionalInfo, setEditAdditionalInfo] = useState(false);
  const [activityTitle, setActivityTitle] = useState(null);
  const [activityDefaultCode, setActivityDefaultCode] = useState(null);
  const [activityCodeExecutor, setActivityCodeExecutor] = useState(null);
  const [activityCodeRuntime, setActivityCodeRuntime] = useState(null);
  const [deleteList, setDeleteList] = useState([]);
  const [videoClipListResponse, setVideoClipListResponse] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const getVideoClipList = async () => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "GET",
      url: "/api/code-executor-activity/" + params.codingActivityId,
      headers: {
        Authorization: `Bearer ${getToken("token")}`,
      },
    };
    try {
      const response = await api.request(config);
      setVideoClipListResponse(response.data.results);
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
      router.push("/dashboard/code-executor-activity");
      console.error(error);
    }
  };
  useEffect(() => {
    getVideoClipList();
  }, [params.codingActivityId]);
  useEffect(() => {
    setVideoClipListResponse(state=>{
      return {
        ...state,
        activityCodeRuntime: activityCodeRuntime
      }
    
    });
  },[activityCodeRuntime])
  function extractQueryParam(url, param) {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);
    return searchParams.get(param);
  }

  // update user data
  // content type form data
  const updateUser = async (e) => {
    dispatchUserData({ type: "checkLogin" });
    const data = {};
    if (activityTitle && videoClipListResponse?.activityTitle !== activityTitle) {
      data.activityTitle = activityTitle;
    }
    if (activityDefaultCode && videoClipListResponse?.activityDefaultCode !== activityDefaultCode) {
      data.activityDefaultCode = activityDefaultCode;
    }
    if (activityCodeExecutor && videoClipListResponse?.activityCodeExecutor !== activityCodeExecutor) {
      data.activityCodeExecutor = activityCodeExecutor;
    }
    if (activityCodeRuntime) {
      data.activityCodeRuntime = activityCodeRuntime;
    }
    if (Object.keys(data).length <= 0) {
      toast.error(
        "Empty Form Submission Not Allowed, Try after changing data.",
        {
          position: "top-center",
        }
      );
      return;
    }
    const config = {
      method: "put",
      url: "/api/code-executor-activity/" + params.codingActivityId,
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
      toast.success("Updated Successfully!", {
        position: "top-center",
      });
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
    <div className="container mx-auto py-4 px-4 md:px-0">
      <div className=" mb-4 ">
        <Link href={"/dashboard/code-executor-activity/"}>
          <button className="me-2 px-4 py-2 bg-yellow-500 text-white rounded-md mb-4 "
          >Go back</button>
        </Link>
        <Link href={`/dashboard/code-executor-activity/${params.codingActivityId}/code-executor-issue-list`}>
          <button className="me-2 px-4 py-2 bg-yellow-500 text-white rounded-md mb-4 "
          >Issue List</button>
        </Link>
        <Link href={`/dashboard/code-executor-activity/${params.codingActivityId}/chat-feedback`}>
          <button className="me-2 px-4 py-2 bg-yellow-500 text-white rounded-md mb-4 "
          >Feedback List</button>
        </Link>
        <Link href={`/code-executor-activity/${params.codingActivityId}`}>
          <button className="me-2 px-4 py-2 bg-violet-500 text-white rounded-md mb-4 "
          >Preview</button>
        </Link>
      </div>
      <button

        className={`${editAdditionalInfo ? "hidden" : "block"} text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
        onClick={() => setEditAdditionalInfo(true)}
      >Edit additional Info</button>
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
            defaultValue={videoClipListResponse?.activityTitle}
            onInput={(e) => setActivityTitle(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="activityCodeExecutor"
            className="block mb-2 text-sm font-medium text-white"
          >
            {" "}
            Activity Code Executor
          </label>
          <input
            type="text"
            id="activityCodeExecutor"
            className="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm-light"
            placeholder="Activity Code Executor"
            defaultValue={videoClipListResponse?.activityCodeExecutor}
            onInput={(e) => setActivityCodeExecutor(e.target.value)}
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
            value={videoClipListResponse?.activityCodeRuntime}
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
        <div>
          <button
            onClick={updateUser}
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Update Additional Info
          </button>
          <button
            className="text-white bg-gradient-to-r from-red-500 to-yellow-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => setEditAdditionalInfo(false)}
          >Close additional Info</button>
        </div>
      </div>
      <CodeExecutorAppView codingActivityId={params.codingActivityId} uiDataFromDb={videoClipListResponse} />
    </div>
  );
};
export default Page;
