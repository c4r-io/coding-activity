import React, { useEffect } from 'react'
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
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                updateHandler();
                event.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [updateHandler])
    return (
        <div className=''>
            <button
            className={`px-4 py-2 bg-blue-500 text-white rounded-md mb-4 ${updateUiContentHook.loading ? "cursor-not-allowed pointer-events-none" : ""}`}
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