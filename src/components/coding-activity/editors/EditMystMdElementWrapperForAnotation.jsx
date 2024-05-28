import MystPreviewTwContainer from '@/components/mystmdpreview/MystPreviewTwContainer';
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import debouncer from '@/utils/debouncer';
import React, { Fragment, useEffect, useState } from 'react';

function EditMystMdElementWrapperForAnotation({ className, children, onUpdate, text, buttonEditor = false }) {
    const previewElement = React.useRef(null);
    const [heightOfPreview, setHeightOfPreview] = React.useState(40);
    const [editorFocused, setEditorFocused] = React.useState('');
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);

    return (
        <div>
            {uiData.devmode ?
                <Fragment>
                    {editorFocused == "mystmd-editor-focused" ?
                        <Fragment>
                            <textarea className={`${className} html-editor !text-left w-[250px]`}
                                style={{ height: heightOfPreview + "px" }}
                                autoFocus={editorFocused == "mystmd-editor-focused"}
                                onChange={(e) => {
                                    onUpdate(e.target.value)
                                }}
                                defaultValue={text}
                                onBlur={() => setEditorFocused("")}></textarea>
                        </Fragment>
                        :
                        <div
                            ref={previewElement}
                            className={`${className}`}
                            tabIndex={1}
                            title={`${className}`}
                            onFocus={(e) => {
                                if (uiData.devmode) {
                                    setHeightOfPreview(previewElement?.current?.clientHeight)
                                    setTimeout(() => {
                                        setEditorFocused("mystmd-editor-focused")
                                    }, 100);
                                }
                            }
                            }
                        >
                            <MystPreviewTwContainer data={text} />
                        </div>

                    }
                </Fragment>
                : children}
        </div>
    );
}

export default EditMystMdElementWrapperForAnotation;
