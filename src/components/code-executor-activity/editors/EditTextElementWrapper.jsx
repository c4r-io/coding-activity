import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import React, { Fragment, useEffect, useState } from 'react';
function EditTextElementWrapper({ children, className, path, buttonEditor = false }) {
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
        <div>
            {uiData.devmode ?
                <Fragment>
                    {editorFocused == "chatprompt-top-headertext-editor" ?
                        <Fragment>
                            {buttonEditor ?
                                <input className={`${className} html-editor`}
                                    autoFocus={editorFocused == "chatprompt-top-headertext-editor"}
                                    onChange={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: path, data: e.target.value } });
                                    }}
                                    defaultValue={data}
                                    onBlur={() => setEditorFocused("")}></input>
                                : <textarea className={`${className} html-editor`}

                                    autoFocus={editorFocused == "chatprompt-top-headertext-editor"}
                                    onChange={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: path, data: e.target.value } });
                                    }}
                                    defaultValue={data}
                                    onBlur={() => setEditorFocused("")}></textarea>}
                        </Fragment>
                        :
                        <div
                            className={`${className}`}
                            tabIndex={1}
                            title={`${className}`}
                            onFocus={(e) => {
                                if (uiData.devmode) {
                                    setEditorFocused("chatprompt-top-headertext-editor")
                                }
                            }
                            }
                            dangerouslySetInnerHTML={{ __html: path.split(".").reduce((acc, curr) => {
                                if (curr) {
                                    return acc[curr];
                                }
                            }, uiData?.uiContent) }}
                        >
                        </div>
                    }
                </Fragment>
                : children}
        </div>
    );
}

export default EditTextElementWrapper;
