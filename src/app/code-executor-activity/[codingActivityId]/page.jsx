"use client";
import { api } from "@/utils/apibase";
import { getToken } from "@/utils/token";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/contextapi/UserProvider";
import CodeExecutorActivityView from "@/components/code-executor-activity/CodeExecutorActivityView";

const Page = ({ params }) => {
  const { userData, dispatchUserData } = useContext(UserContext);
  const [codeExecutorActivityData, setCodeExecutorActivityData] = useState({});
  const router = useRouter();
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
      setCodeExecutorActivityData(response.data.results);
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
  return (
    <div className="container mx-auto py-4 px-4 md:px-0">
      <CodeExecutorActivityView codingActivityId={params.codingActivityId} uiDataFromDb={codeExecutorActivityData} />
    </div>
  );
};
export default Page;
