import React from 'react'
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';

const CustomCssInjector = () => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    return (
        <style dangerouslySetInnerHTML={{__html: uiData?.uiContent?.cssdata?.all}}>
        </style>
    )
}

export default CustomCssInjector