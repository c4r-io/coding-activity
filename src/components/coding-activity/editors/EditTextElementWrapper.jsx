import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import debouncer from '@/utils/debouncer';
import React, { Fragment, useEffect, useState } from 'react';
function EditTextElementWrapper({ children, className, path, buttonEditor = false }) {
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
    const getDefaultData = () => {
        const splittedPath = path.split(".");
        const nd = splittedPath.reduce((acc, curr) => {
            if (curr) {
                return acc[curr];
            }
        }, uiData?.uiContent)
        return nd
    }
    const dispatchUiDataWithDebounce = debouncer(dispatchUiData, 400)
    return (
        <div>
            {uiData.devmode ?
                <Fragment>
                    {editorFocused == "chatprompt-top-headertext-editor" ?
                        <Fragment>
                            {buttonEditor ?
                                <input className={`${className} html-editor`}
                                    style={{ height: heightOfPreview + "px" }}
                                    autoFocus={editorFocused == "chatprompt-top-headertext-editor"}
                                    onChange={(e) => {
                                        dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: path, data: e.target.value } });
                                    }}
                                    defaultValue={getDefaultData()}
                                    onBlur={() => setEditorFocused("")}></input>
                                : <textarea className={`${className} html-editor`}
                                    style={{ height: heightOfPreview + "px" }}
                                    autoFocus={editorFocused == "chatprompt-top-headertext-editor"}
                                    onChange={(e) => {
                                        dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: path, data: e.target.value } });
                                    }}
                                    defaultValue={getDefaultData()}
                                    onBlur={() => setEditorFocused("")}></textarea>}
                        </Fragment>
                        :
                        <div
                            ref={previewElement}
                            className={`${className}`}
                            tabIndex={1}
                            title={`${className}`}
                            onFocus={(e) => {
                                if (uiData.devmode) {
                                    dispatchUiData({ type: 'setHighlightClass', payload: className });
                                    setHeightOfPreview(previewElement?.current?.clientHeight)
                                    setTimeout(() => {
                                        setEditorFocused("chatprompt-top-headertext-editor")
                                    }, 100);
                                }
                            }
                            }
                            dangerouslySetInnerHTML={{
                                __html: path.split(".").reduce((acc, curr) => {
                                    if (curr) {
                                        return acc[curr];
                                    }
                                }, uiData?.uiContent)
                            }}
                        >
                        </div>
                    }
                </Fragment>
                : children}
        </div>
    );
}

export default EditTextElementWrapper;
