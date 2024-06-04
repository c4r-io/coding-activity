import React, { Fragment, useContext, useState } from "react";
import { UiDataContext } from "@/contextapi/code-executor-api/UiDataProvider";
import UploadImageWrapper from "../editors/EditUploadImageWrapper";
import EditTextElementWrapper from "../editors/EditTextElementWrapper";
import EditMystMdElementWrapper from "../editors/EditMystMdElementWrapper";
import MystPreviewTwContainer from "@/components/mystmdpreview/MystPreviewTwContainer";
import AnotationTool from "../anotation-tool/AnotationTool";
import debouncer from "@/utils/debouncer";
import CustomSlider from "@/components/customElements/CustomSlider/CustomSlider";

const TopCardUi = () => {
  const { uiData, dispatchUiData } = React.useContext(UiDataContext);
  const dispatchUiDataWithDebounce = debouncer(dispatchUiData, 400)
  const openIntoEditor = (index) => {
    if (index === -1) return;
    if (index == null) return;
    if (index === undefined) return;
    if (uiData.devmode) {
      dispatchUiData({ type: "setActivePath", payload: { path: `editorViewTopCardAnotations[${index}]`, type: "annotation" } })
    }
  }
  const [value, setValue] = useState(50);

  const handleSliderChange = (newValue) => {
    setValue(newValue);
  };


  return (
    <Fragment>
      {/* <div className="p-4">
        
      <h1>Custom Slider</h1>
      <CustomSlider min={0} max={100} step={1} value={value} onChange={handleSliderChange} />
      <p>Value: {value}</p>
      </div> */}
      <AnotationTool defaultValue={uiData.uiContent?.editorViewTopCardAnotations}
        onUpdateIndex={openIntoEditor}
        onUpdate={(value) => {
          dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: "editorViewTopCardAnotations", data: value } })
        }}
        editable={uiData.devmode}
        showAddOnHover
      ><div className="code-editor-top-card-container">
          <div className="container-inner-1">
            <UploadImageWrapper
              className="card-image"
              path={"codeEditorTopCardImage.data"}
              stylePath={"codeEditorTopCardImage.styles"}
              styles={uiData?.uiContent?.codeEditorTopCardImage?.styles}
              cssContent={"cssContent.editorviewTopCard"}
            >
              <img
                className="card-image"
                src={uiData?.uiContent?.codeEditorTopCardImage?.data ? uiData?.uiContent?.codeEditorTopCardImage?.data : "/imoje-charecters/Raven-investigating.png"}
                width={400}
                height={450}
                style={{
                  width: uiData?.uiContent?.codeEditorTopCardImage?.styles?.width || 270 + "px",
                  height: uiData?.uiContent?.codeEditorTopCardImage?.styles?.height || 270 + "px",
                  top: uiData?.uiContent?.codeEditorTopCardImage?.styles?.top + "px",
                  left: uiData?.uiContent?.codeEditorTopCardImage?.styles?.left + "px",
                  transform: "rotate(" + uiData?.uiContent?.codeEditorTopCardImage?.styles?.rotateAngle + "deg)",
                }}
                alt="Raven Stop"
              />
            </UploadImageWrapper>
            <div className="text-element-container">
              <div className="text-element-container-inner-1">

                <EditMystMdElementWrapper
                  className={`text-element-container-inner-1-text`}
                  path={"editorview.headerTitle"}
                  cssContent={"cssContent.editorviewTopCard"}
                >
                  <div
                    className='text-element-container-inner-1-text'
                  >
                    <MystPreviewTwContainer data={uiData?.uiContent?.editorview?.headerTitle || ""} />
                  </div>
                </EditMystMdElementWrapper>
              </div>
            </div>
          </div>
        </div>
      </AnotationTool>
    </Fragment>
  );
};

export default TopCardUi;
