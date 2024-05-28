import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import ResizableRect from "react-resizable-rotatable-draggable";
import React, { useEffect } from 'react';

const DrawerArround = ({ children, prevAnnotationsPercentage = [] }) => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const canvasRef = React.useRef(null);
    const [annotations, setAnnotations] = React.useState([]);
    const [annotationsPercentage, setAnnotationsPercentage] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [showMessage, setShowMessage] = React.useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && prevAnnotationsPercentage.length > 0) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const convertedAnnotations = prevAnnotationsPercentage.map(annotation => ({
                ...annotation,
                left: annotation.left * canvasWidth / 100,
                top: annotation.top * canvasHeight / 100,
                width: annotation.width * canvasWidth / 100,
                height: annotation.height * canvasHeight / 100
            }));
            setAnnotations(convertedAnnotations);
            setAnnotationsPercentage(prevAnnotationsPercentage);
        }
    }, [prevAnnotationsPercentage]);

    const addAnnotation = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = canvas;
            const newAnnotationPercentage = {
                id: Date.now(),
                left: 5,
                top: 5,
                width: 5,
                height: 5
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
        }
    };

    const removeSelected = () => {
        if (selected !== null) {
            setAnnotations(annotations.filter(annotation => annotation.id !== selected));
            setAnnotationsPercentage(annotationsPercentage.filter(annotation => annotation.id !== selected));
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
            setAnnotationsPercentage(annotationsPercentage.map(annotation => {
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
            }));
        }
    };

    return (
        <div className='w-full relative'>
            <div className='absolute top-0 left-0 z-[100]'>
                <button className='bg-blue-500 text-white px-2 py-1 rounded' onClick={addAnnotation}>
                    Add annotation
                </button>
                {selected !== null &&
                    <button className='bg-blue-500 text-white px-2 py-1 rounded' onClick={removeSelected}>
                        Remove selected
                    </button>}
            </div>
            <div className='w-full relative' ref={canvasRef}>
                {children}
                {annotations.map((annotation,index) => (
                    <div key={annotation.id} >
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
                        <div className='absolute z-[101] mt-2 translate-x-[-50%] translate-y-[-100%]'
                            style={{ left: `${annotationsPercentage[index].left + annotationsPercentage[index].width / 2}%` , top: `${annotationsPercentage[index].top}%` }}
                        >
                            <div className='w-0 h-0 border-l-8 border-r-8 border-t-8 border-t-ui-violet border-l-transparent border-r-transparent'></div>
                            <div className={` ${(annotationsPercentage[index].left + annotationsPercentage[index].width / 2) >=50 ? "translate-x-[calc(-100%_+_20px)]":"translate-x-[-20px]"} absolute left-1/2 top-0 translate-y-[-100%] bg-ui-violet p-2 rounded shadow-lg`}>
                                <div className='p-2 rounde whitespace-pre overflow-auto max-w-[300px]'>
                                    <p>Dummy text for annotation message.Dummy text for annotation message.Dummy text for annotation message.</p>
                                    <p>Dummy text for annotation message.{}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DrawerArround;
