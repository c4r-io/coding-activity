import React, { Fragment, useContext, useState } from "react";
import { UiDataContext } from "@/contextapi/code-executor-api/UiDataProvider";
import UploadImageWrapper from "../editors/EditUploadImageWrapper";
import EditTextElementWrapper from "../editors/EditTextElementWrapper";
import EditMystMdElementWrapper from "../editors/EditMystMdElementWrapper";
import MystPreviewTwContainer from "@/components/mystmdpreview/MystPreviewTwContainer";
import AnotationTool from "../anotation-tool/AnotationTool";
import debouncer from "@/utils/debouncer";

const TopCardUi = () => {
  const { uiData, dispatchUiData } = React.useContext(UiDataContext);
  const dispatchUiDataWithDebounce = debouncer(dispatchUiData, 400)
  const openIntoEditor = (index) => {
    if(index === -1) return;
    if(index == null) return;
    if(index === undefined) return;
    if (uiData.devmode) {
      dispatchUiData({ type: "setActivePath", payload: { path: `editorViewTopCardAnotations[${index}]`, type: "annotation" } })
    }
  }
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
                >
                  <div
                    className='text-element-container-inner-1-text'
                  >
                    <MystPreviewTwContainer data={uiData?.uiContent?.editorview?.headerTitle || ""} />
                  </div>
                </EditMystMdElementWrapper>
                {/* <EditMystMdElementWrapper
              className={`content`}
              path={"editorview.headerBodyTitle"}
            >
              <div
                className='content'
              >
                <MystPreviewTwContainer data={uiData?.uiContent?.editorview?.headerBodyTitle || ""} />
              </div>
            </EditMystMdElementWrapper>
            <EditMystMdElementWrapper
              className={`footer`}
              path={"editorview.headerFooterTitle"}
            >
              <div
                className='footer'
              >
                <MystPreviewTwContainer data={uiData?.uiContent?.editorview?.headerFooterTitle || ""} />

              </div>
            </EditMystMdElementWrapper> */}
              </div>
            </div>
          </div>
        </div>
      </AnotationTool>
    </Fragment>
  );
};

export default TopCardUi;
