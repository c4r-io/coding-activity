import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import ResizableRect from "react-resizable-rotatable-draggable";
import React, { useEffect } from 'react';
import debouncer from '@/utils/debouncer';
import EditMystMdElementWrapperForAnotation from './editors/EditMystMdElementWrapperForAnotation';
import MystPreviewTwContainer from '../mystmdpreview/MystPreviewTwContainer';
import { useSearchParams } from 'next/navigation';

const DrawerArround = ({ children }) => {
    const searchParams = useSearchParams();
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const canvasRef = React.useRef(null);
    const alreadyUpdateRef = React.useRef(false);
    const [annotations, setAnnotations] = React.useState([]);
    const [annotationsPercentage, setAnnotationsPercentage] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [showMessage, setShowMessage] = React.useState(null);

    const dispatchUiDataWithDebounce = debouncer(dispatchUiData, 400)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && uiData?.uiContent?.canvasAnotations && uiData?.uiContent?.canvasAnotations?.length > 0 && !alreadyUpdateRef.current) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const convertedAnnotations = uiData?.uiContent?.canvasAnotations.map(annotation => ({
                ...annotation,
                left: annotation.left * canvasWidth / 100,
                top: annotation.top * canvasHeight / 100,
                width: annotation.width * canvasWidth / 100,
                height: annotation.height * canvasHeight / 100
            }));
            setAnnotations(convertedAnnotations);
            setAnnotationsPercentage(uiData?.uiContent?.canvasAnotations);
            alreadyUpdateRef.current = true;
        }
    }, [uiData?.uiContent?.canvasAnotations]);

    const addAnnotation = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const newAnnotationPercentage = {
                id: Date.now(),
                left: 5,
                top: 5,
                width: 5,
                height: 5,
                innerText: '1 Dummy text for annotation message.'
            };
            const newAnnotation = {
                ...newAnnotationPercentage,
                left: newAnnotationPercentage.left * canvasWidth / 100,
                top: newAnnotationPercentage.top * canvasHeight / 100,
                width: newAnnotationPercentage.width * canvasWidth / 100,
                height: newAnnotationPercentage.height * canvasHeight / 100
            };
            setAnnotations([...annotations, newAnnotation]);
            setAnnotationsPercentage([...annotationsPercentage, newAnnotationPercentage]);
            dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: "canvasAnotations", data: [...annotationsPercentage, newAnnotationPercentage] } })

        }
    };

    const removeSelected = () => {
        if (selected !== null) {
            setAnnotations(annotations.filter(annotation => annotation.id !== selected));
            const modified = annotationsPercentage.filter(annotation => annotation.id !== selected)
            dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: "canvasAnotations", data: modified } })
            setAnnotationsPercentage(modified);
            setSelected(null);
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
            })
            setAnnotationsPercentage(modifiedAnnotationsPercentage);
            dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: "canvasAnotations", data: modifiedAnnotationsPercentage } })
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
            })
            const modifiedAnnotationsPercentage = annotationsPercentage.map(annotation => {
                if (annotation.id === id) {
                    return {
                        ...annotation,
                        innerText: text
                    };
                }
                return annotation;
            })
            setAnnotations(modifiedAnnotations);
            setAnnotationsPercentage(modifiedAnnotationsPercentage);
            dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: "canvasAnotations", data: modifiedAnnotationsPercentage } })
        }
    }

    return (
        <div className='w-full relative'>
            {
                uiData.devmode &&
                <div className='absolute top-0 left-0 z-[100]'>
                    <button className='bg-blue-500 text-white px-2 py-1 rounded' onClick={addAnnotation}>
                        Add annotation
                    </button>
                    {selected !== null &&
                        <button className='bg-blue-500 text-white px-2 py-1 rounded' onClick={removeSelected}>
                            Remove selected
                        </button>}
                </div>
            }
            <div className='w-full relative ' ref={canvasRef}>
                {children}
                {annotations.map((annotation, index) => (
                    <div key={annotation.id} >

                        {
                            uiData.devmode &&
                            <ResizableRect
                                left={annotation.left}
                                top={annotation.top}
                                width={annotation.width}
                                height={annotation.height}
                                onDrag={(deltaX, deltaY) => {
                                    handleDrag(annotation.id, deltaX, deltaY)
                                    setSelected(annotation.id);
                                    setShowMessage(annotation.id);
                                }}
                            />
                        }
                        <div className='absolute z-[101] mt-2 translate-x-[-50%] translate-y-[-100%]'
                            style={{ left: `${annotationsPercentage[index].left + annotationsPercentage[index].width / 2}%`, top: `${annotationsPercentage[index].top}%` }}
                        >
                            <div className='group'>
                                <div className={`${uiData.devmode ? "hidden" : "group-hover:hidden block animate-pulse"} w-[15px] h-[15px] rounded-full translate-y-[8px] bg-ui-violet`}></div>
                                <div className={`${uiData.devmode ? "" : "group-hover:opacity-100 opacity-0"} w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-ui-violet border-l-transparent border-r-transparent`}></div>
                                <div className={`${uiData.devmode ? "" : "group-hover:opacity-100 opacity-0"} ${(annotationsPercentage[index].left + annotationsPercentage[index].width / 2) >= 50 ? "translate-x-[calc(-100%_+_20px)]" : "translate-x-[-20px]"} absolute left-1/2 top-0 translate-y-[-100%] bg-ui-violet p-2 rounded shadow-lg`}>
                                    <div className='p-2 rounde whitespace-pre overflow-auto max-w-[250px] text-white'>
                                        <EditMystMdElementWrapperForAnotation className={`!w-[250px]`} onUpdate={(e) => updateText(annotation.id, e)} text={annotationsPercentage[index].innerText}>
                                            <MystPreviewTwContainer data={annotationsPercentage[index].innerText} />
                                        </EditMystMdElementWrapperForAnotation>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className='hidden absolute z-[1000] left-0 top-0 pointer-events-none'>
                    <svg width={640} height={640} xmlns="http://www.w3.org/2000/svg">
                        {/* Background */}
                        <rect width="100%" height="100%" fill="#ffffff00" />
                        {/* Grid lines */}
                        <g stroke="#cccccc" strokeWidth={1}>
                            {/* Vertical lines */}
                            <line x1={80} y1={0} x2={80} y2={640} />
                            <line x1={160} y1={0} x2={160} y2={640} />
                            <line x1={240} y1={0} x2={240} y2={640} />
                            <line x1={320} y1={0} x2={320} y2={640} />
                            <line x1={400} y1={0} x2={400} y2={640} />
                            <line x1={480} y1={0} x2={480} y2={640} />
                            <line x1={560} y1={0} x2={560} y2={640} />
                            {/* Horizontal lines */}
                            <line x1={0} y1={80} x2={640} y2={80} />
                            <line x1={0} y1={160} x2={640} y2={160} />
                            <line x1={0} y1={240} x2={640} y2={240} />
                            <line x1={0} y1={320} x2={640} y2={320} />
                            <line x1={0} y1={400} x2={640} y2={400} />
                            <line x1={0} y1={480} x2={640} y2={480} />
                            <line x1={0} y1={560} x2={640} y2={560} />
                        </g>
                        {/* Axes */}
                        <g stroke="#000000" strokeWidth={2}>
                            {/* X-axis */}
                            <line x1={0} y1={640} x2={640} y2={640} />
                            {/* Y-axis */}
                            <line x1={0} y1={0} x2={0} y2={640} />
                        </g>
                    </svg>

                </div>
            </div>
        </div>
    );
};

export default DrawerArround;
