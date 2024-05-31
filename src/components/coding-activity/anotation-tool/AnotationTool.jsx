import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import ResizableRect from "react-resizable-rotatable-draggable";
import React, { useEffect } from 'react';
import debouncer from '@/utils/debouncer';
import EditMystMdElementWrapperForAnotation from '../editors/EditMystMdElementWrapperForAnotation';
import MystPreviewTwContainer from '../../mystmdpreview/MystPreviewTwContainer';
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidMessageRoundedDots } from "react-icons/bi";

const AnotationTool = ({ children, defaultValue, onUpdate, editable, showAddOnHover }) => {
    const canvasRef = React.useRef(null);
    const alreadyUpdateRef = React.useRef(false);
    const [annotations, setAnnotations] = React.useState([]);
    const [annotationsPercentage, setAnnotationsPercentage] = React.useState([]);

    const updateWithDebounce = debouncer(onUpdate, 400);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && defaultValue && defaultValue?.length > 0 && !alreadyUpdateRef.current) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const convertedAnnotationsToPercentage = defaultValue.map(annotation => ({
                ...annotation,
                left: annotation.left / canvasWidth * 100,
                top: annotation.top / canvasHeight * 100,
                width: annotation.width / canvasWidth * 100,
                height: annotation.height / canvasHeight * 100
            }));
            setAnnotations(defaultValue);
            setAnnotationsPercentage(convertedAnnotationsToPercentage);
            alreadyUpdateRef.current = true;
        }
    }, [defaultValue]);

    const addAnnotation = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const newAnnotation = {
                id: Date.now(),
                left: 50,
                top: 50,
                width: 285,
                height: 66,
                messageBoxWidth: 285,
                messageBoxHeight: 66,
                fontSize: 16,
                innerText: 'Dummy text for annotation message.',
                dotColor: '#854ABE',
                messageBoxBgColor: '#854ABE',
                messageBoxTextColor: '#ffffff',
                notationPosition: 'left',
            };
            const newAnnotationPercentage = {
                ...newAnnotation,
                left: newAnnotation.left / canvasWidth * 100,
                top: newAnnotation.top / canvasHeight * 100,
                width: newAnnotation.width / canvasWidth * 100,
                height: newAnnotation.height / canvasHeight * 100
            };
            const updatedAnotation = [...annotations, newAnnotation];
            const updatedAnotationPercentage = [...annotationsPercentage, newAnnotationPercentage];
            setAnnotations(updatedAnotation);
            setAnnotationsPercentage(updatedAnotationPercentage);
            updateWithDebounce(updatedAnotation)
        }
    };

    const removeAnotation = (id) => {
        if (id !== null) {
            const filteredAnotation = annotations.filter(annotation => annotation.id !== id)
            setAnnotations(filteredAnotation);
            const filteredAnnotationsPercentage = annotationsPercentage.filter(annotation => annotation.id !== id)
            setAnnotationsPercentage(filteredAnnotationsPercentage);
            updateWithDebounce(filteredAnotation)
        }
    };

    const handleDrag = (id, deltaX, deltaY) => {
        setAnnotations(annotations.map(annotation => {
            if (annotation.id === id) {
                const newLeft = annotation.left + deltaX;
                const newTop = annotation.top + deltaY;
                updateAnnotationPercentage(id, newLeft, newTop, annotation.width, annotation.height);
                return {
                    ...annotation,
                    left: newLeft,
                    top: newTop
                };
            }
            return annotation;
        }));
    };

    const handleResize = (id, style, isShiftKey, type) => {
        let { top, left, width, height } = style;
        setAnnotations(annotations.map(annotation => {
            if (annotation.id === id) {
                const newLeft = left;
                const newTop = top;
                const newWidth = width;
                const newHeight = height;
                updateAnnotationPercentage(id, newLeft, newTop, newWidth, newHeight);
                return {
                    ...annotation,
                    left: newLeft,
                    top: newTop,
                    width: newWidth,
                    height: newHeight,
                    messageBoxHeight: newHeight,
                    messageBoxWidth: newWidth
                };
            }
            return annotation;
        }));
    }

    const updateAnnotationPercentage = (id, left, top, width, height) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const modifiedAnnotationsPercentage = annotationsPercentage.map(annotation => {
                if (annotation.id === id) {
                    return {
                        ...annotation,
                        left: left / canvasWidth * 100,
                        top: top / canvasHeight * 100,
                        width: width / canvasWidth * 100,
                        height: height / canvasHeight * 100
                    };
                }
                return annotation;
            });
            setAnnotationsPercentage(modifiedAnnotationsPercentage);
            const modifiedAnnotations = annotations.map(annotation => {
                if (annotation.id === id) {
                    return {
                        ...annotation,
                        left: left,
                        top: top,
                        width: width,
                        height: height
                    };
                }
                return annotation;
            });
            updateWithDebounce(modifiedAnnotations);
        }
    };

    const updateText = (id, text) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const modifiedAnnotations = annotations.map(annotation => {
                if (annotation.id === id) {
                    return {
                        ...annotation,
                        innerText: text
                    };
                }
                return annotation;
            });
            const modifiedAnnotationsPercentage = annotationsPercentage.map(annotation => {
                if (annotation.id === id) {
                    return {
                        ...annotation,
                        innerText: text
                    };
                }
                return annotation;
            });
            setAnnotations(modifiedAnnotations);
            setAnnotationsPercentage(modifiedAnnotationsPercentage);
            updateWithDebounce(modifiedAnnotations);
        }
    };
    const updateMessageBox = (annotation) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const modifiedAnnotations = annotations.map(ann => {
                if (ann.id === annotation.id) {
                    return {
                        ...ann,
                        messageBoxHeight: annotation.messageBoxHeight,
                        messageBoxWidth: annotation.messageBoxWidth,
                        messageBoxBgColor: annotation.messageBoxBgColor,
                        messageBoxTextColor: annotation.messageBoxTextColor,
                        fontSize: annotation.fontSize
                    };
                }
                return ann;
            });
            const modifiedAnnotationsPercentage = annotationsPercentage.map(ann => {
                if (ann.id === annotation.id) {
                    return {
                        ...ann,
                        messageBoxHeight: annotation.messageBoxHeight,
                        messageBoxWidth: annotation.messageBoxWidth,
                        fontSize: annotation.fontSize
                    };
                }
                return ann;
            });
            setAnnotations(modifiedAnnotations);
            setAnnotationsPercentage(modifiedAnnotationsPercentage);
            updateWithDebounce(modifiedAnnotations);
        }
    }
    const toggleNotation = (id) => {
        const modifiedAnnotations = annotations.map(annotation => {
            if (annotation.id === id) {
                return {
                    ...annotation,
                    notationPosition: annotation.notationPosition == 'left' ? 'right' : 'left'
                };
            }
            return annotation;
        });
        setAnnotations(modifiedAnnotations);
        updateWithDebounce(modifiedAnnotations);
    }
    const [showTooltip, setShowTooltip] = React.useState([]);
    const handleShowTooltip = (index) => {
        const modfied = []
        modfied[index] = true;
        setShowTooltip(modfied)
    }
    const handleHideTooltip = (index) => {
        setShowTooltip((state, i) => false)
    }
    return (
        <div className='w-full relative group/anotationcanvas'>
            {
                editable &&
                <div className={`absolute top-0 left-0 z-[100] ${showAddOnHover ? "group-hover/anotationcanvas:block hidden" : "block"}`}>
                    <button className='bg-ui-violet text-white px-2 py-1 rounded' onClick={addAnnotation}>
                        <BiSolidMessageRoundedDots />
                    </button>
                </div>
            }
            <div className='w-full relative' ref={canvasRef}>
                {children}
                {annotations.map((annotation, index) => (
                    <div key={annotation.id}>
                        {
                            editable &&
                            <ResizableRect
                                left={annotation.left}
                                top={annotation.top}
                                width={annotation.width}
                                height={annotation.height}
                                onDrag={(deltaX, deltaY) => {
                                    handleDrag(annotation.id, deltaX, deltaY)
                                }}
                                onResize={(style, isShiftKey, type) => {
                                    handleResize(annotation.id, style, isShiftKey, type)
                                }
                                }
                                zoomable="n, w, s, e, nw, ne, se, sw"
                            />
                        }
                        <div className='absolute z-[1001] m-[5px]'
                            style={{ left: `${annotation.left}px`, top: `${annotation.top}px`, color: annotation.messageBoxTextColor }}
                        >
                            <div className='group/anotation'
                            >
                                <div className={`${editable ? "hidden" : `${showTooltip[index] ? "hidden" : "block animate-pulse"}`} ${annotation?.notationPosition == "left" ? "absolute left-2 -bottom-2" : "absolute right-2 -bottom-2"} w-3 h-3 rounded-full bg-ui-violet`}
                                    style={{ backgroundColor: annotation.messageBoxBgColor }}
                                    onMouseOver={() => handleShowTooltip(index)}
                                // onMouseLeave={() => handleHideTooltip(index)}
                                ></div>
                                <div className={`${editable ? "" : `${showTooltip[index] ? "opacity-100" : "opacity-0"}`} ${annotation?.notationPosition == "left" ? "absolute left-2 -bottom-2" : "absolute right-2 -bottom-2"} w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-ui-violet border-l-transparent border-r-transparent`}
                                    style={{ borderTopColor: annotation.messageBoxBgColor }}
                                    onClick={() =>
                                        editable && toggleNotation(annotation.id)
                                    }
                                    onMouseOver={() => handleShowTooltip(index)}
                                    onMouseLeave={() => handleHideTooltip(index)}
                                ></div>
                                <div className={`${editable ? "" : `${showTooltip[index] ? "opacity-100" : "opacity-0 pointer-events-none"}`}  rounded shadow-lg`}
                                    style={{ fontSize: annotation.fontSize + "px",backgroundColor: annotation.messageBoxBgColor  }}
                                    onMouseOver={() => handleShowTooltip(index)}
                                    onMouseLeave={() => handleHideTooltip(index)}
                                >
                                    <div className={`absolute top-0 right-0 -translate-y-[100%] ${editable ? "" : "hidden"}`}>
                                        <EditableToolTip onRemove={removeAnotation} annotation={annotation} onUpdate={updateMessageBox} />
                                    </div>
                                    <div className='p-2 rounded whitespace-pre overflow-auto annotation-tool-text-container'
                                        style={{ width: (annotation.messageBoxWidth - 10) + "px", height: (annotation.messageBoxHeight - 18) + "px", fontSize: annotation.fontSize + "px !important" }}
                                    >
                                        <div
                                            style={{ transform: `scale(${annotation.fontSize / 16})`, transformOrigin: `top left` }}
                                        >
                                            <EditMystMdElementWrapperForAnotation onUpdate={(e) => updateText(annotation.id, e)} text={annotationsPercentage[index].innerText}>
                                                <MystPreviewTwContainer data={annotationsPercentage[index].innerText} />
                                            </EditMystMdElementWrapperForAnotation>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default AnotationTool;


const EditableToolTip = ({ onRemove, onUpdate, annotation }) => {
    const isUpdatedOnce = React.useRef(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [width, setWidth] = React.useState(annotation.messageBoxWidth);
    const [height, setHeight] = React.useState(annotation.messageBoxHeight);
    const [fontSize, setFontSize] = React.useState(annotation.fontSize);
    const [messageBoxBgColor, setMessageBoxBgColor] = React.useState(annotation.messageBoxBgColor);
    const [messageBoxTextColor, setMessageBoxTextColor] = React.useState(annotation.messageBoxTextColor);

    useEffect(() => {
        if (!isUpdatedOnce.current && annotation) {
            setWidth(annotation.messageBoxWidth);
            setHeight(annotation.messageBoxHeight);
            setFontSize(annotation.fontSize);
            setMessageBoxBgColor(annotation.messageBoxBgColor);
            setMessageBoxTextColor(annotation.messageBoxTextColor);
            isUpdatedOnce.current = true;
        }
    }, [annotation])
    const updateWidth = (e) => {
        setWidth(e);
        onUpdate({ ...annotation, messageBoxWidth: e });
    }
    const updateHeight = (e) => {
        setHeight(e);
        onUpdate({ ...annotation, messageBoxHeight: e });
    }
    const updateBgColor = (e) => {
        setMessageBoxBgColor(e);
        onUpdate({ ...annotation, messageBoxBgColor: e });
    }
    const updateColor = (e) => {
        setMessageBoxTextColor(e);
        onUpdate({ ...annotation, messageBoxTextColor: e });
    }
    const updateFontSize = (e) => {
        setFontSize(e);
        onUpdate({ ...annotation, fontSize: e });
    }
    return (
        <div className='flex -m-1'>

            {
                isEditing ?
                    <div className='p-1'>
                        <div className='bg-white border border-gray-500 rounded-md p-1'>
                            <div className='pb-1'>
                                <div className='flex -m-0.5 wrap justify-end'>
                                    <div className='p-0.5 flex'>
                                        <button className='bg-red-500 text-white px-1 py-1 rounded-full text-xs' onClick={() => onRemove(annotation.id)}
                                            title='Delete'
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                    <div className='p-0.5 flex'>
                                        <button className='bg-orange-300 text-white px-1 py-1 rounded-full text-xs' onClick={() => setIsEditing(false)}
                                            title='Close'
                                        >
                                            <IoCloseCircleSharp />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='flex -m-1 wrap text-xs'>
                                {/* <div className='p-1 flex justify-center items-center'>
                                    <div>W</div>
                                    <input className='ml-1 bg-gray-300 text-black px-2 py-1 rounded w-14'
                                        type='number'
                                        value={width}
                                        onChange={(e) => updateWidth(e.target.value)}

                                    >
                                    </input>
                                </div>
                                <div className='p-1 flex justify-center items-center'>
                                    <div>H</div>
                                    <input className='ml-1 bg-gray-300 text-black px-2 py-1 rounded w-14'
                                        type='number'
                                        value={height}
                                        onChange={(e) => updateHeight(e.target.value)}
                                    >
                                    </input>
                                </div> */}
                                <div className='p-1 flex justify-center items-center  text-black'>
                                    <div>Text </div>
                                    <input className='ml-1 rounded w-14'
                                        type='color'
                                        value={messageBoxTextColor}
                                        onChange={(e) => updateColor(e.target.value)}
                                    >
                                    </input>
                                </div>
                                <div className='p-1 flex justify-center items-center  text-black'>
                                    <div>BG</div>
                                    <input className='ml-1 rounded w-14'
                                        type='color'
                                        value={messageBoxBgColor}
                                        onChange={(e) => updateBgColor(e.target.value)}
                                    >
                                    </input>
                                </div>
                                <div className='p-1 flex justify-center items-center  text-black'>
                                    <div>Font Scale</div>
                                    <input className='ml-1 bg-gray-300 text-black px-2 py-1 rounded w-14'
                                        type='number'
                                        value={fontSize}
                                        onChange={(e) => updateFontSize(e.target.value)}
                                    >
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='p-1'>
                        <button className=' px-2 py-1 rounded' onClick={() => setIsEditing(true)}
                        style={{backgroundColor: annotation.messageBoxBgColor, color: annotation.messageBoxTextColor}}
                            title='Edit Annotation Message Box'
                        >
                            <FaEdit />
                        </button>
                    </div>
            }
        </div>
    )
}