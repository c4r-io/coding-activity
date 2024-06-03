import MystPreviewTwContainer from '@/components/mystmdpreview/MystPreviewTwContainer';
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import debouncer from '@/utils/debouncer';
import React, { Fragment, useEffect, useState } from 'react';

function EditMystMdElementWrapper({ children, className, path, buttonEditor = false }) {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    // State to store the base64 string
    const handleClick = (event) => {
        if (event.ctrlKey || event.metaKey) {
        if (uiData.devmode) {
            event.stopPropagation()
            openIntoEditor();
        }
        }
    };

    const openIntoEditor = () => {
        if (uiData.devmode) {
            dispatchUiData({ type: "setActivePath", payload: {path, type:"text"}  })
        }
    }
    return (
        <div
            onClick={handleClick}
            onClickCapture={handleClick}
        >
            {children}
        </div>
    );
}
function EditMystMdElementWrapperBackup({ children, className, path, buttonEditor = false }) {
    const previewElement = React.useRef(null);
    const [heightOfPreview, setHeightOfPreview] = React.useState(40);
    const [editorFocused, setEditorFocused] = React.useState('');
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    // State to store the base64 string
    const getDefaultData = () => {
        const splittedPath = path.split(".");
        const nd = splittedPath.reduce((acc, curr) => {
            if (curr) {
                return acc?.[curr];
            }
            return acc;
        }, uiData?.uiContent)
        return nd
    }
    const dispatchUiDataWithDebounce = debouncer(dispatchUiData, 400)
    useEffect(() => {
        if (uiData.devmode) {
            dispatchUiData({ type: "setActivePath", payload: path })
        }
    }, [editorFocused])
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
                                        dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: path, data: e.target.value } })
                                    }}
                                    defaultValue={getDefaultData()}
                                    onBlur={() => setEditorFocused("")}></input>
                                : <textarea className={`${className} html-editor`}
                                    style={{ height: heightOfPreview + "px" }}
                                    autoFocus={editorFocused == "mystmd-editor-focused"}
                                    onChange={(e) => {
                                        dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: path, data: e.target.value } })
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
                                        setEditorFocused("mystmd-editor-focused")
                                    }, 100);
                                }
                            }
                            }
                        >
                            <MystPreviewTwContainer data={getDefaultData()} />
                        </div>

                    }
                </Fragment>
                : children}
        </div>
    );
}

export default EditMystMdElementWrapper;
