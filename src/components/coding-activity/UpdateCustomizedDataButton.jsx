import React from 'react'
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import { useUpdateUiContents } from '../hooks/ApiHooks';

const UpdateCustomizedDataButton = () => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const updateUiContentHook = useUpdateUiContents()
    const updateHandler = () => {
        const url = window.location.href;
        const id = url.split("/").pop();
        const apisavePath = `/api/coding-activity/${id}`
        const data = {uiContent: JSON.stringify(uiData.uiContent)}
        updateUiContentHook.update(apisavePath,data)
    }
    return (
        <div className=''>
            <button
            className='px-4 py-2 bg-blue-500 text-white rounded-md mb-4'
                onClick={() => {
                    updateHandler()
                }}
            >
                {updateUiContentHook.loading ? 
                <img src="/images/loading.gif" alt="loading" className="w-6 h-6" />
                :"Save"}
            </button>
        </div>
    )
}

export default UpdateCustomizedDataButton