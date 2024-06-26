import React, { Fragment, useContext, useState } from "react";
import { UiDataContext } from "@/contextapi/code-executor-api/UiDataProvider";
import UploadImageWrapper from "../editors/EditUploadImageWrapper";
import EditTextElementWrapper from "../editors/EditTextElementWrapper";
import EditMystMdElementWrapper from "../editors/EditMystMdElementWrapper";
import MystPreviewTwContainer from "@/components/mystmdpreview/MystPreviewTwContainer";
import AnotationTool from "../anotation-tool/AnotationTool";
import debouncer from "@/utils/debouncer";
import CustomSlider from "@/components/customElements/CustomSlider/CustomSlider";
import CustomListSlider from "@/components/customElements/CustomSlider/CustomListSlider";

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
  const [setData, setSetData] = useState("")
  React.useEffect(() => {
    // if (uiData.devmode) {
    //   dispatchUiData({ type: 'setOpenReportUi', payload: true })
    // }
    let updatedCode = uiData?.uiContent?.editorview?.headerTitle
    if (Array.isArray(uiData?.uiContent?.slider?.codeEditorSlider)) {
      for (const iterator of uiData?.uiContent?.slider?.codeEditorSlider) {
        updatedCode = updatedCode.replaceAll(`{${iterator?.label}}`, iterator.value)
        // console.log("updatedCode2",updatedCode.includes(`{${iterator?.label}}`),`{${iterator?.label}}`,iterator.value)
      }
    }
    // console.log("updatedCode2", updatedCode)
    setSetData(updatedCode || "")
  }, [uiData.devmode, uiData?.uiContent?.editorview?.headerTitle, uiData?.uiContent?.slider?.codeEditorSlider])
  return (
    <Fragment>
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
                    <MystPreviewTwContainer data={setData || ""} />
                    asdf
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
