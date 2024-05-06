import MystPreviewTwContainer from '@/components/mystmdpreview/MystPreviewTwContainer';
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import React, { Fragment, useEffect, useState } from 'react';

function EditMystMdElementWrapper({ children, className, path, buttonEditor = false }) {
    const previewElement = React.useRef(null);
    const [heightOfPreview, setHeightOfPreview] = React.useState(40);
    const [editorFocused, setEditorFocused] = React.useState('');
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    // State to store the base64 string
    const getData = (path) => {
        return path.split(".").reduce((acc, curr) => {
            if (curr) {
                return acc[curr];
            }
        }, uiData?.uiContent)
    }
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
                    {editorFocused == "mystmd-editor-focused" ?
                        <Fragment>
                            {buttonEditor ?
                                <input className={`${className} html-editor`}
                                    autoFocus={editorFocused == "mystmd-editor-focused"}
                                    onChange={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: path, data: e.target.value } });
                                    }}
                                    defaultValue={getData(path)}
                                    onBlur={() => setEditorFocused("")}></input>
                                : <textarea className={`${className} html-editor`}
                                    style={{ height: heightOfPreview + "px" }}
                                    autoFocus={editorFocused == "mystmd-editor-focused"}
                                    onChange={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: path, data: e.target.value } });
                                    }}
                                    defaultValue={getData(path)}
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
                                        setEditorFocused("mystmd-editor-focused")
                                    }, 100);
                                }
                            }
                            }
                        >
                            <MystPreviewTwContainer data={getData(path)} />
                        </div>

                    }
                </Fragment>
                : children}
        </div>
    );
}

export default EditMystMdElementWrapper;
