import React, { useContext, useState } from "react";
import { UiDataContext } from "@/contextapi/code-executor-api/UiDataProvider";
import UploadImageWrapper from "../editors/EditUploadImageWrapper";
import EditTextElementWrapper from "../editors/EditTextElementWrapper";
import EditMystMdElementWrapper from "../editors/EditMystMdElementWrapper";
import MystPreviewTwContainer from "@/components/mystmdpreview/MystPreviewTwContainer";

const TopCardUi = () => {
  const { uiData, dispatchUiData } = React.useContext(UiDataContext);
  const [editorFocused, setEditorFocused] = React.useState('');

  const question = "hello";
  const [answerShow, setAnswerShow] = useState(false);
  const toggleAnswerShow = () => {
    setAnswerShow(!answerShow);
  };
  return (
    <div className="code-editor-top-card-container">
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
              width: uiData?.uiContent?.codeEditorTopCardImage?.styles?.width  || 270 + "px",
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
  );
};

export default TopCardUi;
