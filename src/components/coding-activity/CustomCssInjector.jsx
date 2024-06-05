import React from 'react'
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';

const CustomCssInjector = () => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    function getNestedValues(obj) {
        let values = ["/* this is custom css */"];
    
        function extractValues(o) {
            for (let key in o) {
                if (o.hasOwnProperty(key)) {
                    if (typeof o[key] === 'object' && o[key] !== null) {
                        extractValues(o[key]);
                    } else {
                        values.push(o[key]);
                    }
                }
            }
        }
    
        extractValues(obj);
        const joinedValues = values.join(' \n');
        return joinedValues;
    }
    return (
        <div>
        <style dangerouslySetInnerHTML={{__html: uiData?.uiContent?.cssdata?.all}}>
        </style>
        {/* <style dangerouslySetInnerHTML={{__html: getNestedValues(uiData?.uiContent?.cssContent)}}>
        </style> */}
        </div>
    )
}

export default CustomCssInjector