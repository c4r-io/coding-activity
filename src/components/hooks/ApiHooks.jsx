import React, { useContext } from 'react'
import { UserContext } from "@/contextapi/UserProvider";
import { getToken } from '@/utils/token';
import { toast } from 'react-toastify';
import { api } from '@/utils/apibase';

export const useDeleteByIds = (url) => {
    const { dispatchUserData } = useContext(UserContext);
    const [loading, setLoading] = React.useState(false);
    const deleteByIds = async (ids, callbackSuccess, callbackError) => {
        dispatchUserData({ type: "checkLogin" });
        const config = {
            method: "delete",
            url: url,
            headers: {
                Authorization: `Bearer ${getToken("token")}`,
            },
            data: {
                ids
            }
        };
        setLoading(true);
        try {
            const response = await api.request(config);
            setLoading(false);
            if (callbackSuccess) {
                callbackSuccess(response.data)
            }
        } catch (error) {
            setLoading(false);
            if (error?.response?.status == 401) {
                toast.error(error.response.data.message + ". Login to try again.", {
                    position: "top-center",
                });
            } else {
                toast.error(error.message, {
                    position: "top-center",
                });
            }
            if (callbackError) {
                callbackError(error)
            }
            console.error(error);
        }
    };
    return {
        deleteByIds,
        loading
    }
}
export const useCreateDefault = (url, data) => {
    const { dispatchUserData } = useContext(UserContext);
    const [loading, setLoading] = React.useState(false);
    const create = async (callbackSuccess, callbackError) => {
        dispatchUserData({ type: "checkLogin" });
        const config = {
            method: "post",
            url: url,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken("token")}`,
            },
            data
        };
        setLoading(true);
        try {
            const response = await api.request(config);
            setLoading(false);
            toast.success("Sample Created Successfully!", {
                position: "top-center",
            });
            if (callbackSuccess) {
                callbackSuccess(response.data)
            }
        } catch (error) {
            if (error?.response?.status == 401) {
                toast.error(error.response.data.message + ". Login to try again.", {
                    position: "top-center",
                });
            } else {
                toast.error(error.message, {
                    position: "top-center",
                });
            }
            if (callbackError) {
                callbackError(error)
            }
            console.error(error);
            setLoading(false);
        }
    };
    return {
        create,
        loading
    }
}

export const useUpdateUiContents = () => {
    const { dispatchUserData } = useContext(UserContext);
    const [loading, setLoading] = React.useState(false);
    const update = async (url,data,callbackSuccess, callbackError) => {
        dispatchUserData({ type: "checkLogin" });
        const config = {
            method: "put",
            url: url,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getToken("token")}`,
            },
            data
        };
        setLoading(true);
        try {
            const response = await api.request(config);
            setLoading(false);
            toast.success("Updated Successfully!", {
                position: "top-center",
            });
            if (callbackSuccess) {
                callbackSuccess(response.data)
            }
        } catch (error) {
            if (error?.response?.status == 401) {
                toast.error(error.response.data.message + ". Login to try again.", {
                    position: "top-center",
                });
            } else {
                toast.error(error.message, {
                    position: "top-center",
                });
            }
            if (callbackError) {
                callbackError(error)
            }
            console.error(error);
            setLoading(false);
        }
    };
    return {
        update,
        loading
    }
}
export const useChatFeedback = () => {
    const [loading, setLoading] = React.useState(false);
    const send = async (data,callbackSuccess, callbackError) => {
        const config = {
            method: "post",
            url: "/api/chat-feedback",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data
        };
        setLoading(true);
        try {
            const response = await api.request(config);
            setLoading(false);
            toast.success("Updated Successfully!", {
                position: "top-center",
            });
            if (callbackSuccess) {
                callbackSuccess(response.data)
            }
        } catch (error) {
            if (error?.response?.status == 401) {
                toast.error(error.response.data.message + ". Login to try again.", {
                    position: "top-center",
                });
            } else {
                toast.error(error.message, {
                    position: "top-center",
                });
            }
            if (callbackError) {
                callbackError(error)
            }
            console.error(error);
            setLoading(false);
        }
    };
    return {
        send,
        loading
    }
}
