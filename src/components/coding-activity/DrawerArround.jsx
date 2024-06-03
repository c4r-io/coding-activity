import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import ResizableRect from "react-resizable-rotatable-draggable";
import React, { useEffect } from 'react';
import debouncer from '@/utils/debouncer';
import AnotationTool from './anotation-tool/AnotationTool';

const DrawerArround = ({ children }) => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const dispatchUiDataWithDebounce = debouncer(dispatchUiData, 400)
    const openIntoEditor = (index) => {
        if(index === -1) return;
        if(index == null) return;
        if(index === undefined) return;
        if (uiData.devmode) {
          dispatchUiData({ type: "setActivePath", payload: { path: `pyodideCanvasAnotations[${index}]`, type: "annotation" } })
        }
      }
    
      return (
        <div className='w-full relative'>
            <AnotationTool defaultValue={uiData.uiContent.pyodideCanvasAnotations}
            onUpdateIndex={openIntoEditor}
                onUpdate={(value) => {
                    dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: "pyodideCanvasAnotations", data: value } })
                }}
                editable={uiData.devmode}
                showAddOnHover
            >
                {children}
            </AnotationTool>
        </div>
    );
};

export default DrawerArround;
