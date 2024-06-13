import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import ResizableRect from "react-resizable-rotatable-draggable";
import React, { useEffect } from 'react';
import debouncer from '@/utils/debouncer';
import MystPreviewTwContainer from '../../mystmdpreview/MystPreviewTwContainer';
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { useDebounceEffect } from '@/components/hooks/useDebounceEffect';

const AnotationTool = ({ children, defaultValue=[], onUpdate, onUpdateIndex, editable, showAddOnHover }) => {
    const canvasRef = React.useRef(null);
    const alreadyUpdateRef = React.useRef(false);
    const [annotations, setAnnotations] = React.useState([]);
    const [annotationsPercentage, setAnnotationsPercentage] = React.useState([]);
    const updateWithDebounce = debouncer(onUpdate, 400);
    useDebounceEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && defaultValue && Array.isArray(defaultValue)) {
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
        }
    }, 600, [defaultValue]);

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
    const handleClick = (event, index) => {
        if (event.ctrlKey || event.metaKey) {
            event.stopPropagation()
            onUpdateIndex(index)
        }
    };
    return (
        <div className='w-full relative group/anotationcanvas'
        >
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
                    <div key={annotation.id}
                        onClick={(event) => {
                            if (onUpdateIndex) {
                                handleClick(event, index)
                                console.log("index", index)
                            }
                        }}
                    >
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
                                    onClick={() => {
                                        if (editable) {
                                            toggleNotation(annotation.id)
                                        }
                                    }
                                    }
                                    onMouseOver={() => handleShowTooltip(index)}
                                    onMouseLeave={() => handleHideTooltip(index)}
                                ></div>
                                <div className={`${editable ? "" : `${showTooltip[index] ? "opacity-100" : "opacity-0 pointer-events-none"}`}  rounded shadow-lg`}
                                    style={{ fontSize: annotation.fontSize + "px", backgroundColor: annotation.messageBoxBgColor }}
                                    onMouseOver={() => handleShowTooltip(index)}
                                    onMouseLeave={() => handleHideTooltip(index)}
                                >
                                    <div className='p-2 rounded whitespace-pre overflow-auto annotation-tool-text-container'
                                        style={{ width: (annotation.messageBoxWidth - 10) + "px", height: (annotation.messageBoxHeight - 18) + "px", fontSize: annotation.fontSize + "px !important" }}
                                    >
                                        <div
                                            style={{ transform: `scale(${annotation.fontSize / 16})`, transformOrigin: `top left` }}
                                        >
                                            {/* <EditMystMdElementWrapperForAnotation onUpdate={(e) => updateText(annotation.id, e)} text={annotationsPercentage[index].innerText}> */}
                                            <MystPreviewTwContainer data={annotationsPercentage[index].innerText} />
                                            {/* </EditMystMdElementWrapperForAnotation> */}
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
