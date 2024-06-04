import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import React, { Fragment, useState } from 'react';
import { MdCloudUpload } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import ResizableRect from "react-resizable-rotatable-draggable";
import { useUploadImage } from '@/components/hooks/ApiHooks';
function UploadImageWrapper({ children, className,cssContent, path, stylePath, styles }) {
    const [editorFocused, setEditorFocused] = React.useState('');
    const alreadyUpdated = React.useRef(false);
    const uploadImageHook = useUploadImage();
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const [resisable, setResisable] = useState(false);
    const [left, setLeft] = useState(622);
    const [top, setTop] = useState(10);
    const [width, setWidth] = useState(270);
    const [height, setHeight] = useState(270);
    const [rotateAngle, setRotateAngle] = useState(0);
    React.useEffect(() => {
        if (styles
            && alreadyUpdated.current <= 2
        ) {
            alreadyUpdated.current += 1;
            setLeft(styles?.left || 0)
            setTop(styles?.top || 0)
            setWidth(styles?.width || 200)
            setHeight(styles?.height || 200)
            setRotateAngle(styles?.rotateAngle || 0)
        }

    }, [styles])

    // State to store the base64 string
    const [base64Image, setBase64Image] = useState('');
    // Function to convert image to base64
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const prev = path.split(".").reduce((acc, curr) => {
                if (curr) {
                    return acc[curr];
                }
            }, uiData?.uiContent)

            const data = new FormData();
            if (prev && prev.startsWith("/api/public")) {
                const prevId = prev.split("/").pop();
                data.append('imageId', prevId);
            }
            data.append('image', file);
            await uploadImageHook.upload(data, (d) => {
                // success callback
                console.log("uploaded data: ", d)
                // const reader = new FileReader();
                // reader.onload = (e) => {
                //     const base64String = e.target.result;
                //     setBase64Image(base64String);
                //     console.log("Base64 Image String: ", path, base64String);
                //     dispatchUiData({ type: 'setContent', payload: { key: path, data: base64String } });
                // };
                // reader.readAsDataURL(file);
                dispatchUiData({ type: 'setContent', payload: { key: path, data: `/api/public/${d._id}` } });
                setEditorFocused("")
            }, (e) => {
                // error callback
                console.log("error: ", e)
            });

        }
    };

    const handleStyleEditWithDebounce = () => {
        if (stylePath) {
            dispatchUiData({
                type: 'setContent', payload: {
                    key: stylePath, data: {
                        top: Number(top),
                        left: Number(left),
                        width: Number(width),
                        height: Number(height),
                        rotateAngle: Number(rotateAngle),

                    }
                }
            });
        }
    }
    const handleResize = (style, isShiftKey, type) => {
        // type is a string and it shows which resize-handler you clicked
        // e.g. if you clicked top-right handler, then type is 'tr'
        let { top, left, width, height } = style;
        top = Math.round(top);
        left = Math.round(left);
        width = Math.round(width);
        height = Math.round(height);
        setWidth(width);
        setHeight(height);
        setTop(top);
        setLeft(left);
        handleStyleEditWithDebounce()
    };

    const handleRotate = (angle) => {
        setRotateAngle(angle);
        handleStyleEditWithDebounce()
    };

    const handleDrag = (deltaX, deltaY) => {
        setLeft(left => left + deltaX);
        setTop(top => top + deltaY);
        handleStyleEditWithDebounce()
    };
    // State to store the base64 string
    const handleClick = (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.stopPropagation()
            openIntoEditor();
            if (stylePath && !resisable) {
                setResisable(state => !state)
            }
        }
    };

    const openIntoEditor = () => {
        if (uiData.devmode) {
            dispatchUiData({ type: "setActivePath", payload: { path, type: "image",cssContent: cssContent ? cssContent :"global" } })
        }
    }
    return (
        <div
            onClick={handleClick}
            onClickCapture={handleClick}
        >

            {uiData.devmode ?
                <Fragment>
                    <div
                        tabIndex={1}
                        title={`${className}`}
                        onBlur={() => {
                            setResisable(false)
                        }}
                        style={stylePath ? {
                            position: "absolute",
                            left: 0 + "px",
                            top: 0 + "px",
                            width: 100 + "%",
                            height: 100 + "%",
                        } : {}}
                    >
                        {children}
                        {resisable &&
                            <div
                                className={`${resisable ? '' : 'hidden'}`}
                                style={{
                                    zIndex: 10000,
                                    position: "absolute",
                                    left: 0 + "px",
                                    top: 0 + "px",
                                    width: 100 + "%",
                                    height: 100 + "%",
                                }}
                            >
                                <ResizableRect
                                    left={left}
                                    top={top}
                                    width={width}
                                    height={height}
                                    rotateAngle={rotateAngle}
                                    zoomable="n, w, s, e, nw, ne, se, sw"
                                    onRotate={
                                        handleRotate}
                                    onResize={
                                        handleResize}
                                    onDrag={
                                        handleDrag}
                                >
                                </ResizableRect>
                            </div>
                        }
                    </div>
                </Fragment> : children
            }
        </div>
    );
}
function UploadImageWrapperBackup({ children, className, path, stylePath, styles }) {
    const [editorFocused, setEditorFocused] = React.useState('');
    const alreadyUpdated = React.useRef(false);
    const uploadImageHook = useUploadImage();
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const [resisable, setResisable] = useState(false);
    const [left, setLeft] = useState(622);
    const [top, setTop] = useState(10);
    const [width, setWidth] = useState(270);
    const [height, setHeight] = useState(270);
    const [rotateAngle, setRotateAngle] = useState(0);
    React.useEffect(() => {
        if (styles
            && alreadyUpdated.current <= 2
        ) {
            alreadyUpdated.current += 1;
            setLeft(styles?.left || 0)
            setTop(styles?.top || 0)
            setWidth(styles?.width || 200)
            setHeight(styles?.height || 200)
            setRotateAngle(styles?.rotateAngle || 0)
        }

    }, [styles])

    // State to store the base64 string
    const [base64Image, setBase64Image] = useState('');
    // Function to convert image to base64
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const prev = path.split(".").reduce((acc, curr) => {
                if (curr) {
                    return acc[curr];
                }
            }, uiData?.uiContent)

            const data = new FormData();
            if (prev && prev.startsWith("/api/public")) {
                const prevId = prev.split("/").pop();
                data.append('imageId', prevId);
            }
            data.append('image', file);
            await uploadImageHook.upload(data, (d) => {
                // success callback
                console.log("uploaded data: ", d)
                // const reader = new FileReader();
                // reader.onload = (e) => {
                //     const base64String = e.target.result;
                //     setBase64Image(base64String);
                //     console.log("Base64 Image String: ", path, base64String);
                //     dispatchUiData({ type: 'setContent', payload: { key: path, data: base64String } });
                // };
                // reader.readAsDataURL(file);
                dispatchUiData({ type: 'setContent', payload: { key: path, data: `/api/public/${d._id}` } });
                setEditorFocused("")
            }, (e) => {
                // error callback
                console.log("error: ", e)
            });

        }
    };
    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const handleStyleEditWithDebounce = () => {
        if (stylePath) {
            dispatchUiData({
                type: 'setContent', payload: {
                    key: stylePath, data: {
                        top: Number(top),
                        left: Number(left),
                        width: Number(width),
                        height: Number(height),
                        rotateAngle: Number(rotateAngle),

                    }
                }
            });
        }
    }
    const handleResize = (style, isShiftKey, type) => {
        // type is a string and it shows which resize-handler you clicked
        // e.g. if you clicked top-right handler, then type is 'tr'
        let { top, left, width, height } = style;
        top = Math.round(top);
        left = Math.round(left);
        width = Math.round(width);
        height = Math.round(height);
        setWidth(width);
        setHeight(height);
        setTop(top);
        setLeft(left);
        handleStyleEditWithDebounce()
    };

    const handleRotate = (angle) => {
        setRotateAngle(angle);
        handleStyleEditWithDebounce()
    };

    const handleDrag = (deltaX, deltaY) => {
        setLeft(left => left + deltaX);
        setTop(top => top + deltaY);
        handleStyleEditWithDebounce()
    };
    return (
        <div>

            {uiData.devmode ?
                <Fragment>
                    {editorFocused == "chatprompt-user-message-headertext-editor" ?
                        <div tabIndex={1} className={`${className} html-upload-editor relative`}
                            style={styles ? {
                                width: styles?.width || 270 + "px",
                                height: styles?.height || 270 + "px",
                                top: styles?.top + "px",
                                left: styles?.left + "px",
                                transform: "rotate(" + styles?.rotateAngle + "deg)",
                            } : {}}
                        >
                            <div className='w-full h-full absolute top-0 left-0 z-50 flex justify-center items-center text-3xl'>
                                <div className=''>
                                    <button className=''
                                        onClick={(e) => {
                                            setEditorFocused("")
                                        }}
                                    >
                                        <IoCloseCircle />
                                    </button>
                                    <div className='relative'>
                                        <input className='w-full opacity-0 h-full absolute top-0 left-0 z-40' type="file" accept="image/*" onChange={handleFileChange}
                                        />
                                        <MdCloudUpload />
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div
                            tabIndex={1}
                            title={`${className}`}
                            onClick={() => {
                                if (stylePath && !resisable) {
                                    setResisable(state => !state)
                                }
                                dispatchUiData({ type: 'setHighlightClass', payload: className });
                            }}
                            onBlur={() => {
                                setResisable(false)
                            }}
                            onDoubleClick={() => {
                                if (uiData.devmode) {
                                    setEditorFocused("chatprompt-user-message-headertext-editor")
                                    setResisable(false)
                                }
                                dispatchUiData({ type: 'setHighlightClass', payload: className });
                            }}
                            // onFocus={(e) => {
                            //     if (uiData.devmode) {
                            //         setEditorFocused("chatprompt-user-message-headertext-editor")
                            //     }
                            // }}

                            // style={{
                            //     width: width + "px",
                            //     height: height + "px",
                            //     top: top + "px",
                            //     left: left + "px",
                            //     transform: "rotate(" + rotateAngle + "deg)",
                            // }}
                            style={stylePath ? {
                                position: "absolute",
                                left: 0 + "px",
                                top: 0 + "px",
                                width: 100 + "%",
                                height: 100 + "%",
                            } : {}}
                        >
                            {children}
                            {resisable &&
                                <div
                                    className={`${resisable ? '' : 'hidden'}`}
                                    style={{
                                        zIndex: 10000,
                                        position: "absolute",
                                        left: 0 + "px",
                                        top: 0 + "px",
                                        width: 100 + "%",
                                        height: 100 + "%",
                                    }}
                                >
                                    <ResizableRect
                                        left={left}
                                        top={top}
                                        width={width}
                                        height={height}
                                        rotateAngle={rotateAngle}
                                        zoomable="n, w, s, e, nw, ne, se, sw"
                                        onRotate={
                                            handleRotate}
                                        onResize={
                                            handleResize}
                                        onDrag={
                                            handleDrag}
                                    >
                                    </ResizableRect>
                                </div>
                            }
                        </div>
                    }
                </Fragment> : children
            }
        </div>
    );
}

export default UploadImageWrapper;
