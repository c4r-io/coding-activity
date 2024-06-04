import React from 'react';
import { useDebounceEffect } from '../useDebounceEffect';

export const useReduUndu = (callback) => {
    const [mainStack, setMainStack] = React.useState({});
    const [undoStack, setUndoStack] = React.useState([]);
    const [redoStack, setRedoStack] = React.useState([]);
    const [isUndoing, setIsUndoing] = React.useState(false);
    const [isRedoing, setIsRedoing] = React.useState(false);

    const undo = React.useCallback(() => {
        if (undoStack.length > 0) {
            setIsUndoing(true);
            const previousContent = undoStack[undoStack.length - 1];
            setUndoStack(prev => prev.slice(0, -1));
            setRedoStack(prev => [...prev, mainStack]);
            setMainStack(JSON.parse(JSON.stringify(previousContent)));
            callback(JSON.parse(JSON.stringify(previousContent)));
        }
    }, [undoStack, mainStack, callback]);

    const redo = React.useCallback(() => {
        if (redoStack.length > 0) {
            setIsRedoing(true);
            const nextContent = redoStack[redoStack.length - 1];
            setRedoStack(prev => prev.slice(0, -1));
            setUndoStack(prev => [...prev, mainStack]);
            setMainStack(JSON.parse(JSON.stringify(nextContent)));
            callback(JSON.parse(JSON.stringify(nextContent)));
        }
    }, [redoStack, mainStack, callback]);

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
                if (event.shiftKey) {
                    redo();
                } else {
                    undo();
                }
                event.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [undo, redo]);

    useDebounceEffect(() => {
        if (!(isRedoing || isUndoing)) {
            if (JSON.stringify(mainStack) !== JSON.stringify(undoStack[undoStack.length - 1])) {
                setUndoStack(prev => {
                    if (prev.length > 20) {
                        return [...prev.slice(1), JSON.parse(JSON.stringify(mainStack))];
                    }
                    return [...prev, JSON.parse(JSON.stringify(mainStack))];
                });
                setRedoStack([]);
            }
        }
        if (isRedoing) {
            setIsRedoing(false);
        }
        if (isUndoing) {
            setIsUndoing(false);
        }
    }, 600, [mainStack]);

    const updateMainStack = (data) => {
        setMainStack(JSON.parse(JSON.stringify(data)));
    };

    return { updateMainStack };
};
