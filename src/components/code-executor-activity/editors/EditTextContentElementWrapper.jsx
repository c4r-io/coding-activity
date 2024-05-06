import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import React, { Fragment, useEffect, useState } from 'react';
function EditTextContentElementWrapper({ children, className, path, buttonEditor = false }) {
    const previewElement = React.useRef(null);
    const [heightOfPreview, setHeightOfPreview] = React.useState(40);
    const [editorFocused, setEditorFocused] = React.useState('');
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    // State to store the base64 string
    const [data, setData] = useState('');

    useEffect(() => {
        const splittedPath = path.split(".");
        const nd = splittedPath.reduce((acc, curr) => {
            if (curr) {
                return acc[curr];
            }
        }, uiData?.uiContent)
        if (nd) {
            // console.log("Data: ", nd);
            setData(nd)
        }
    }, [path])

    return (
        <Fragment>
            {/* onChange={(e) => {
                               dispatchUiData({ type: 'setContent', payload: { key: path, data: e.target.value } });
                           }} */}
            {uiData.devmode ?
                <div
                    ref={previewElement}
                    className={`${className}`}
                    title={`${className}`}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onFocus={(e) => {
                    
                        dispatchUiData({ type: 'setHighlightClass', payload: className });
                    }}
                    onInput={(e) => {
                        // console.log("e.target.innerText: ", e.target.innerText);
                        dispatchUiData({ type: 'setContent', payload: { key: path, data: e.target.innerText } });
                    }}
                // dangerouslySetInnerHTML={{
                //     __html: path.split(".").reduce((acc, curr) => {
                //         if (curr) {
                //             return acc[curr];
                //         }
                //     }, uiData?.uiContent)
                // }}
                >{
                    path.split(".").reduce((acc, curr) => {
                        if (curr) {
                            return acc[curr];
                        }
                    }, uiData?.uiContent)
                }
                </div>
                : children}
        </Fragment>
    );
}

export default EditTextContentElementWrapper;
