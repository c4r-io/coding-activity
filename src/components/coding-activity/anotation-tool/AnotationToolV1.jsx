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

const AnotationToolV1 = ({ children, defaultValue, onUpdate, editable, showAddOnHover }) => {
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

    const updateDefaultPosition = () => {
        const canvas = canvasRef.current;
        if (canvas && annotations && annotations?.length > 0) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const convertedAnnotationsToPercentage = annotations.map(annotation => ({
                ...annotation,
                left: annotation.left / canvasWidth * 100,
                top: annotation.top / canvasHeight * 100,
                width: annotation.width / canvasWidth * 100,
                height: annotation.height / canvasHeight * 100
            }));
            setAnnotationsPercentage(convertedAnnotationsToPercentage);
        }
    }

    const addAnnotation = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const newAnnotation = {
                id: Date.now(),
                left: 50,
                top: 50,
                width: 20,
                height: 20,
                messageBoxWidth: 270,
                messageBoxHeight: 50,
                fontSize: 16,
                innerText: 'Dummy text for annotation message.',
                dotColor: '#854ABE',
                messageBoxBgColor: '#854ABE',
                messageBoxTextColor: '#ffffff',
                messageBoxPosition: 'left',
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

    const handleResize = (id, newWidth, newHeight) => {
        setAnnotations(annotations.map(annotation => {
            if (annotation.id === id) {
                updateAnnotationPercentage(id, annotation.left, annotation.top, newWidth, newHeight);
                return {
                    ...annotation,
                    width: newWidth,
                    height: newHeight
                };
            }
            return annotation;
        }));
    };

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
                            />
                        }
                        <div className='absolute z-[1001] mt-2 translate-x-[-50%] translate-y-[-100%]'
                            style={{ left: `${annotation.left + annotation.width / 2}px`, top: `${annotation.top}px` }}
                        >
                            <div className='group/anotation'
                                onMouseOver={() => updateDefaultPosition()}
                            >
                                <div className={`${editable ? "hidden" : "group-hover:hidden block animate-pulse"} w-[15px] h-[15px] rounded-full translate-y-[8px] bg-ui-violet`}
                                    style={{ backgroundColor: annotation.messageBoxBgColor }}
                                ></div>
                                <div className={`${editable ? "" : "group-hover:opacity-100 opacity-0"} w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-ui-violet border-l-transparent border-r-transparent`}
                                    style={{ borderTopColor: annotation.messageBoxBgColor }}
                                ></div>
                                <div className={`${editable ? "" : "group-hover:opacity-100 opacity-0"} ${(annotationsPercentage[index].left + annotationsPercentage[index].width / 2) >= 50 ? "translate-x-[calc(-100%_+_20px)]" : "translate-x-[-20px]"} absolute left-1/2 top-0 translate-y-[-100%] bg-ui-violet p-2 rounded shadow-lg`}
                                >
                                    {/* <div className={`group-hover/anotation:hidden block animate-pulse w-[15px] h-[15px] rounded-full translate-y-[0px] `}
                                   style={{ backgroundColor: annotation.messageBoxBgColor }}
                                ></div>
                                <div className={`group-hover/anotation:block hidden w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent`}
                                    style={{ borderTopColor: annotation.messageBoxBgColor }}
                                ></div>
                                <div className={`group-hover/anotation:block hidden ${(annotationsPercentage[index].left + annotationsPercentage[index].width / 2) >= 50 ? "translate-x-[calc(-100%_+_20px)]" : "translate-x-[-20px]"} absolute left-1/2 top-0 translate-y-[-100%] bg-ui-violet p-2 rounded shadow-lg`}
                                > */}
                                    <div className={`absolute top-0 right-0 -translate-y-[100%] ${editable ? "" : "hidden"}`}>
                                        <EditableToolTip onRemove={removeAnotation} annotation={annotation} onUpdate={updateMessageBox} />
                                    </div>
                                    <div className='p-2 rounded whitespace-pre overflow-auto text-white'
                                        style={{ width: annotation.messageBoxWidth + "px", height: annotation.messageBoxHeight + "px", fontSize: annotation.fontSize + "px !important" }}
                                    >
                                        <EditMystMdElementWrapperForAnotation onUpdate={(e) => updateText(annotation.id, e)} text={annotationsPercentage[index].innerText}>
                                            <MystPreviewTwContainer data={annotationsPercentage[index].innerText} />
                                        </EditMystMdElementWrapperForAnotation>
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

export default AnotationToolV1;


const EditableToolTip = ({ onRemove, onUpdate, annotation }) => {
    const isUpdatedOnce = React.useRef(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [width, setWidth] = React.useState(annotation.messageBoxWidth);
    const [height, setHeight] = React.useState(annotation.messageBoxHeight);
    const [fontSize, setFontSize] = React.useState(annotation.fontSize);

    useEffect(() => {
        if (!isUpdatedOnce.current && annotation) {
            setWidth(annotation.messageBoxWidth);
            setHeight(annotation.messageBoxHeight);
            setFontSize(annotation.fontSize);
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
                                <div className='p-1 flex justify-center items-center'>
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
                                </div>
                                <div className='p-1 flex justify-center items-center'>
                                    <div>Font</div>
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
                        <button className='bg-ui-violet text-white px-2 py-1 rounded' onClick={() => setIsEditing(true)}
                            title='Edit Annotation Message Box'
                        >
                            <FaEdit />
                        </button>
                    </div>
            }
        </div>
    )
}