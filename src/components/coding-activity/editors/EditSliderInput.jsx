import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import React, { Fragment, useEffect, useState } from 'react';

function EditSliderInput({ children, sliderType, path }) {
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
            dispatchUiData({ type: "setActivePath", payload: {path, type:"sliderinput", sliderType}  })
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

export default EditSliderInput;
