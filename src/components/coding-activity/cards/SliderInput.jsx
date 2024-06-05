import CustomListSlider from '@/components/customElements/CustomSlider/CustomListSlider';
import CustomSlider from '@/components/customElements/CustomSlider/CustomSlider';
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import React from 'react'

const SliderInput = ({ path }) => {

  const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const handleSliderChange = (newValue) => {
        dispatchUiData({ type: 'setContent', payload: { key: `${path}.value`, data: newValue } })
    };
    const getDefaultData = React.useCallback(() => {
        const splittedPath = path?.split(".");
        const nd = splittedPath.reduce((acc, curr) => {
            if (curr) {
                if (curr.includes('[')) {
                    const index = curr.split('[')[1].split(']')[0]
                    if(curr.split('[').length > 1){
                        return acc?.[curr.split('[')[0]][index]
                    }
                }
                return acc?.[curr];
            }
            return acc;
        }, uiData?.uiContent)
        return typeof nd === 'object' ? nd : {};
    }, [path, uiData?.uiContent])
    return (
        <div>
            <div className="p-4">
                {
                    getDefaultData()?.sliderType !== 'options' ?
                        <CustomSlider min={getDefaultData()?.min} max={getDefaultData()?.max} step={getDefaultData()?.step} value={getDefaultData()?.value} onChange={handleSliderChange} >
                            <p>Value: {getDefaultData()?.value}</p>
                        </CustomSlider>
                        :
                        <CustomListSlider value={getDefaultData()?.value} options={getDefaultData()?.options} onChange={handleSliderChange} >
                            <p>Value: {getDefaultData()?.value}</p>
                        </CustomListSlider>
                }
            </div>
        </div>
    )
}

export default SliderInput