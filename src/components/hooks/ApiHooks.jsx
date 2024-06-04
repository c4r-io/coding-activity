import React, { useContext } from 'react'
import { UserContext } from "@/contextapi/UserProvider";
import { getToken } from '@/utils/token';
import { toast } from 'react-toastify';
import { api } from '@/utils/apibase';
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from '@/lib/UAParser';
export const useDeleteByIds = (url) => {
  const { dispatchUserData } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const deleteByIds = async (ids, callbackSuccess, callbackError) => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "delete",
      url: url,
      headers: {
        Authorization: `Bearer ${getToken("token")}`,
      },
      data: {
        ids
      }
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      setLoading(false);
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
    }
  };
  return {
    deleteByIds,
    loading
  }
}
export const uiCOntentDefault = {
  canvasAnotations: [],
  "chatprompt": {
    "headerElement": "# Office Hours \n\n # are in!",
    "footerElement": "Everyone needs help sometimes! Rigorous Raven is here to \\\n help. **Click on the part of the activity you need help with.**",
    "userMessageTitle": "**You** asked:",
    "assistantMessageHeaderTitle": "**Rigorous Raven** says:",
    "chatprompotFollowUpTitle": "**Rigorous Raven** says:",
    "followupReportBtn": "Report",
    "followupSatisfiedBtn": "Thanks, That's all!",
    "followupAskMoreBtn": "Ask Follow-Up",
    "followupAskCustomQuestionBtn": "Ask Regorous Raven",
    "followUpReviewTitle": "**Thank you for asking for help** Did you find this useful?",
    "predefineQuestionList": [
      "What dose this do?",
      "Teach me more!",
      "Show an example?",
      "sdfsdf",
      "sadfsdfsdf"
    ],
    "sample": ""
  },
  "editorview": {
    "headerTitle": "# Let’s visualize block randomization\n\nBlock randomization is as simple as hitting a button! Free software packages such as **blockrand**, **randomizR**, or **psych** in R can block randomize your study.\n\\\nBut what is happening under the hood? Hit “Run” on this R code to see a visualization of a block randomized study with 4 treatments.",
    "headerBodyTitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "headerFooterTitle": "### Custom footer",
    "editorPep8Btn": "PEP8",
    "editorNeedHelpBtn": "I need help with this!",
    "editorActionBtn": "Execute",
    "editorActionAttachScreenshot": "Attach Screenshot",
    "editorActionSubmitAttachment": "Submit",
    "sample": "",
    "plotLeftLabel": "This axis shows you how many blocks into which your patients have been randomized",
    "plotBottomLabel": "This axis shows you the sequence of the treatments within each block",
    "plotRightLabel": "This legend shows a different color for each treatment"
  },
  "codeEditorTopCardImage": {
    "data": null,
    "styles": {
      "top": -2,
      "left": 595,
      "width": 127,
      "height": 179,
      "rotateAngle": 0
    }
  },
  "chatPromptTopCardAvater": {
    "styles": {
      "top": 19,
      "left": 24,
      "width": 207,
      "height": 162,
      "rotateAngle": 0
    }
  },
  "feedbackReviewUnLikeImage": {
    "styles": {
      "top": -47,
      "left": 139,
      "width": 110,
      "height": 94,
      "rotateAngle": 0
    }
  },
  "feedbackReviewLikeImage": {
    "styles": {
      "top": -29,
      "left": 100,
      "width": 200,
      "height": 173,
      "rotateAngle": 0
    }
  },
  "defaults": {
    "code": "print(\"hello from default!\")"
  },
  "cssdata": {
    "all": `
:root {
  --ui-violet: #854ABE;
  --ui-dark: #171819;
  --ui-card-bg: #907B9A;
  --ui-gray-1: #C7C7C7;
  --ui-gray-2: #828282;
  --ui-gray-3: #4F4F4F;
  --ui-gray-4: #404040;
  --ui-dark-orange: #6E3822;
  --ui-medium-violet: #532688;
  --ui-dark-violet: #5A3A69;
  --ui-light-blue-shade: #D9D9D9;
  --ui-white-title: #858585;
  --ui-white-text: #A5A5A5;
  --ui-orange: #FF8C00;
  --ui-purple: #cc00cc;
  --ui-blue: #00BBFF;
  --ui-light-blue: #b0ddff;
  --ui-light-gray: #36393e;
  --ui-medium-gray: #282b30;
  --ui-dark-gray: #1e2124;
  --ui-cloud: rgb(30, 31, 34);
  --ui-bg: rgb(49, 51, 56);
  --ui-ground: #000000;
  --ui-hamburger: rgb(43, 45, 49);
}

.prose :where(h1):not(:where([class~="not-prose"], [class~="not-prose"] *)),
.prose :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)),
.prose :where(h3):not(:where([class~="not-prose"], [class~="not-prose"] *)),
.prose :where(h4):not(:where([class~="not-prose"], [class~="not-prose"] *)),
.prose :where(h5):not(:where([class~="not-prose"], [class~="not-prose"] *)),
.prose :where(h6):not(:where([class~="not-prose"], [class~="not-prose"] *)),
.prose :where(strong):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
  color: #000000;
}

.mystmd-preview-container blockquote,
.mystmd-preview-container dd,
.mystmd-preview-container dl,
.mystmd-preview-container figure,
.mystmd-preview-container h1,
.mystmd-preview-container h2,
.mystmd-preview-container h3,
.mystmd-preview-container h4,
.mystmd-preview-container h5,
.mystmd-preview-container h6,
.mystmd-preview-container hr,
.mystmd-preview-container p,
.mystmd-preview-container pre {
  margin: 0 !important;
  color: #000000;
}

/* code-editor-container css start */
.code-editor-container .cropper-container{
  width: 750px;
}

/* code-editor-container css end */
/* code-editor-top-card-container css start */

.code-editor-top-card-container {
  padding: 12px;
  padding-bottom: 0px;
  filter: drop-shadow(0px 4px 0px rgb(145 123 154)) drop-shadow(0px 4px 0px rgb(83 38 136));
}

.code-editor-top-card-container .card-image {
  width: 127px;
  height: 179px;
  position: absolute;
  top: -2px;
  left: 595px;
  z-index: 50;
}

.code-editor-top-card-container .container-inner-1 {
  display: flex;
  position: relative;
}

.code-editor-top-card-container .text-element-container {
  background-color: #ffffff;
  border-radius: 4px;
  color: #39303f;
  width: calc(100% - 44px);
  left: 0px;
  z-index: 20;
}

.code-editor-top-card-container .text-element-container-inner-1 {
  margin-right: 75px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
}

.code-editor-top-card-container .text-element-container-inner-1 .text-element-container-inner-1-text {
  font-family: "Inter", sans-serif;
  text-align: center;
}
.code-editor-top-card-container .text-element-container-inner-1 .text-element-container-inner-1-text h1{
  margin-bottom: 10px !important;
}

.feedback-review-like-image{
  width: 100px;
  height: 98px;
}
.feedback-review-unlike-image{
  width: 100px;
  height: 98px;
}

/* code-editor-top-card-container css end */

.drawer-view-plot-left-label-visible {
  width: 105px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  padding: 2px;
  height: 100%;
}
.drawer-view-plot-left-label-hidden{
  margin-left: 20px;
  display: none;
}
.drawer-view-plot-right-label-visible {
  width: 105px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  padding: 2px;
  height: 100%;
}
.drawer-view-plot-right-label-hidden{
  margin-right: 20px;
  display: none;
}
.drawer-view-plot-bottom-label {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  height: 100%;
}
.drawer-view-plot-bottom-label {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  height: 100%;
}

/* expand button css start */
.expand-bootom-container{
  padding-left: 10px;
  padding-right: 63px;
}
.expand-bootom-action {
  width: 100%;
  height: 18px;
  margin: 0px 12px 0px 24px;
  background-color: #854abe;
  border-radius: 2px;
  box-shadow: inset 0 -2px 0 0 #40235c;
}

.bootom-action-btn {
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 -1px 0 rgba(255, 255, 255, 0.24);  
  display: flex;
  justify-content: space-between;
  width: 100%;
}
/* expand button css end */

/* chat prompt top bar css start */
.chat-prompt-top-card-container {
  width: 100%;
  /* height: 190px; */
  /* background-color: var(--ui-purple); */
  padding-top: 23px;
  padding-bottom: 10px;
  filter: drop-shadow(0px 4px 0px rgb(145 123 154))
            drop-shadow(0px 4px 0px rgb(83 38 136));
  position: relative  ;
}
.chat-prompt-top-card-close-icon{
  position: absolute ;
  right: 0px;
  top: 10px;
  width: 43px;
  height: 43px;
}
.chat-prompt-top-card-container-avater {
  position: absolute;
  height: 183px;
  left: 4px;
  top: 0px;
}
.chat-prompt-top-card-text-container {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  height: 155px;
  background-color: white;
  border-radius: 4px;
  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),
                  0px 7px 0px 0 rgb(83 38 136); */
}
.chat-prompt-top-card-container-header-text-container {
  padding-left: 211px;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-prompt-top-card-container-header-text-container .chat-prompt-top-card-container-header-text {
  text-align: center;
}
.chat-prompt-top-card-container-footer-text-container {
  padding-left: 70px;
  min-height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-prompt-top-card-container-footer-text-container .chat-prompt-top-card-container-footer-text p {
  font-size: 14px !important;
}
.chat-prompt-top-card-container-footer-text-container strong {
  font-weight: bold;
}
    
/* chat prompt top bar css end */

/* chat prompt user message top bar css start */
.chat-prompt-user-message-container {
  width: 100%;
  /* background-color: var(--ui-purple); */
  padding-bottom: 10px;
  padding-top: 10px;
  filter: drop-shadow(0px 4px 0px rgb(145 123 154))
            drop-shadow(0px 4px 0px rgb(83 38 136));
}
.chat-prompt-user-message-text-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),
                  0px 7px 0px 0 rgb(83 38 136); */
}
.chat-prompt-user-message-container-header-text-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-prompt-user-message-container-header-text {
  font-size: 14px;
  text-align: center;
  font-weight: normal;
  color: black;
  line-height: 1.4;
}
.chat-prompt-user-message-container-header-text strong{
  font-weight: bold;
}
.chat-prompt-user-message-container-footer-text-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-prompt-user-message-container-footer-text-container pre {
  font-size: 12px;
  text-align: center;
  font-weight: normal;
  color: black;
  line-height: 1.3;
  font-family: "Inter", sans-serif;
  white-space: break-spaces;
}
.chat-prompt-user-message-container-footer-text-container span {
  font-weight: bold;
}
    
/* chat prompt user message top bar css end */


/* chat prompt assistant message top bar css start */
.chat-prompt-assistant-message-container {
  width: 100%;
  /* background-color: var(--ui-purple); */
  padding-bottom: 10px;
  padding-top: 10px;
  filter: drop-shadow(0px 4px 0px rgb(145 123 154))
            drop-shadow(0px 4px 0px rgb(83 38 136));
}
.chat-prompt-assistant-message-text-container {
  align-items: center;
  margin-top: 10px;
  margin-left: 20px;
margin-right: 20px;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),
                  0px 7px 0px 0 rgb(83 38 136); */
}
.chat-prompt-assistant-message-container-header-text {
  font-size: 14px;
  text-align: left;
  font-weight: normal;
  color: black;
  line-height: 1.4;
}
.chat-prompt-assistant-message-container-header-text strong{
  font-weight: bold;
}
.chat-prompt-assistant-message-container-text-box {
  background-color: #D9D9D9;
  margin-top: 4px;
  padding: 10px;
  border-radius: 2px;
  font-size: 12px;
  text-align: left;
  font-weight: normal;
  color: black;
  line-height: 1.4;
  position: relative;
}
.chat-prompt-assistant-message-container-text {
  font-size: 12px;
  font-weight: normal;
  color: black;
  font-family: "Inter", sans-serif;
  /* line-height: 1.3; */
  white-space: break-spaces;
  
}
    
/* chat prompt assistant message top bar css end */


/* chat prompt assistant message top bar css start */
.chat-prompt-assistant-message-follow-up-container {
  width: 100%;
  /* background-color: var(--ui-purple); */
  margin-top: 5px;
  padding-top: 5px;
  padding-bottom: 10px;
  filter: drop-shadow(0px 4px 0px rgb(145 123 154))
            drop-shadow(0px 4px 0px rgb(83 38 136));
}
.chat-prompt-assistant-message-follow-up-container-avater {
  position: absolute;
  height: 141px;
  left: 22px;
  top: 0px;

}
.chat-prompt-assistant-message-follow-up-text-container {
  margin-top: 10px;
  margin-left: 20px;
margin-right: 20px;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),
                  0px 7px 0px 0 rgb(83 38 136); */
}
.chat-prompt-assistant-message-follow-up-content {
  padding-left: 90px;
}
.chat-prompt-assistant-message-follow-up-container-header-text {
  font-size: 14px;
  text-align: left;
  font-weight: normal;
  color: black;
  line-height: 1.4;
}
.chat-prompt-assistant-message-follow-up-container-header-text strong {
  font-weight: bold;
}
.chat-prompt-assistant-message-follow-up-text-box {
  background-color: #D9D9D9;
  margin-top: 4px;
  padding: 10px;
  border-radius: 2px;
  min-height: 70px;
  font-size: 12px;
  text-align: left;
  font-weight: normal;
  color: black;
  line-height: 1.4;
  position: relative;
}
.chat-prompt-assistant-message-follow-up-text-box-triangle{
  position: absolute;
  width: 0;
  height: 0;
  border-right: 20px solid #D9D9D9;
  border-bottom: 10px solid transparent;
  border-top: 10px solid transparent;
  margin-top: -10px;
  margin-left: 0px;
  left: -18px;
  top: 60px;
}
.chat-prompt-assistant-message-follow-up-assistant-text{
  font-size: 12px;
  font-weight: normal;
  color: black;
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  white-space: break-spaces;
}
/* chat prompt assistant message top bar css end */


/* chat prompt ask-followup-question top bar css start */
.chat-prompt-ask-followup-question-container {
  width: 100%;
  padding-bottom: 10px;
  padding-top: 10px;
  filter: drop-shadow(0px 4px 0px rgb(145 123 154))
            drop-shadow(0px 4px 0px rgb(83 38 136));
  position: relative;
}
.chat-prompt-ask-followup-question-container-triangle{
  position: absolute;
  width: 0;
  height: 0;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #D9D9D9;
  border-left: 10px solid transparent;
  margin-top: 10px;
  margin-left: 0px;
  left: 50%;
  top: 0%;
}
.chat-prompt-ask-followup-question-text-container {
  align-items: center;
  margin-top: 10px;
  margin-left: 20px;
margin-right: 20px;
  background-color: #D9D9D9;
  border-radius: 4px;
  padding: 20px;
  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),
                  0px 7px 0px 0 rgb(83 38 136); */
}
.chat-prompt-ask-followup-question-container-input-text-container{
  padding-top: 10px;
}
.chat-prompt-ask-followup-premade-question-container {
  display: flex;
  align-items: center;
}
.chat-prompt-ask-followup-premade-question-list-container{
  width: calc(100% - 40px);
  padding-left: 20px;
  padding-right: 20px;
}
.chat-prompt-ask-followup-premade-question-list {
  margin: -10px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.chat-prompt-ask-followup-premade-single-question {
  padding: 10px;
  white-space: nowrap;
}
.chat-prompt-ask-followup-premade-question-btn{
  background-color: #907b9a;
  padding: 5px 14px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 10px;
  color: white;
}
.premade-question-scroller-action-btn{
  width: 20px;
  height: 20px;
}
.chat-prompt-ask-followup-question-container-header-text {
  font-size: 14px;
  text-align: left;
  font-weight: normal;
  color: black;
  line-height: 1.4;
}
.chat-prompt-ask-followup-question-container-header-text strong{
  font-weight: bold;
}
.chat-prompt-ask-followup-question-container-text-input {
  background-color: #828282;
  width: 100%;
  margin-top: 4px;
  padding: 10px;
  border-radius: 2px;
  font-size: 14px;
  text-align: left;
  font-weight: normal;
  color: black;
  line-height: 1.4;
  position: relative;
}
.ask-followup-action-container{
  padding-top: 10px ;
}
.ask-followup-button{
  padding: 10px 58px;
  width: 100%;
  font-size: 14px !important;
  border-radius: 2px;
}
.chat-prompt-ask-followup-question-container-text {
  font-size: 12px;
  font-weight: normal;
  color: black;
  font-family: "Inter", sans-serif;
  /* line-height: 1.3; */
  white-space: wrap;
}
    
/* chat prompt ask-followup-question top bar css end */


/* chat prompt user review-action top bar css start */
.chat-prompt-user-review-action-container {
  width: 100%;
  /* background-color: var(--ui-purple); */
  padding-bottom: 10px;
  padding-top: 10px;
  filter: drop-shadow(0px 4px 0px rgb(145 123 154))
            drop-shadow(0px 4px 0px rgb(83 38 136));
}
.chat-prompt-user-review-action-text-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-left: 20px;
margin-right: 20px;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),
                  0px 7px 0px 0 rgb(83 38 136); */
}
.chat-prompt-user-review-action-container-header-text-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-prompt-user-review-action-container-header-text {
  font-size: 14px;
  text-align: center;
  font-weight: normal;
  color: black;
  line-height: 1.4;
  min-width: 365px;;
}
.chat-prompt-user-review-action-container-header-text strong{
  font-weight: bold;
}
.chat-prompt-user-review-action-container-buttons {
  padding-top: 30px;
  padding-bottom: 20px;
  width: 365px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

    
/* chat prompt user review-action top bar css end */


.chat-prompt-user-screenshot-container{
  width: 100%;
  /* background-color: var(--ui-purple); */
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left:20px ;
  padding-right:20px ;
  filter: drop-shadow(0px 4px 0px rgb(145 123 154))
            drop-shadow(0px 4px 0px rgb(83 38 136));
}
.chat-prompt-user-screenshot-image{
  padding: 20px;
  border-radius: 4px;
  background-color: white;
  display: flex;
  justify-content: center;    
}
.chat-prompt-user-screenshot-image img{
  width: auto;
  height: auto;
  max-height: 300px;
  border-radius: 4px;
}
/* chat prompt follow up buttons css start */
.follow-up-button-section{
  margin-top: 20px;
}
.follow-up-buttons{
  display: flex;
  justify-content: space-between;
  margin: -10px;
}
.button-container{
  padding: 10px;
}
.button-container .btn{
  width: 100%;
  padding: 10px 15px;
  white-space: nowrap;
  font-size: 12px !important;
  border-radius: 2px;
}
.button-container .btn-big-x-padding{
  padding: 10px 58px;
}
.button-container.auto-audjust-width{
  flex:auto;
}
/* chat prompt follow up buttons css end */

/* speachial buttons settings start */
.buttons .generative .clicked {
  background-color: #5a3a69;
  color: #ffffff;
  -webkit-text-stroke: 3px #000000;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons .generative .unclicked {
  background-color: #854abe;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons .progressive .clicked {
  background-color: #6e2e14;
  color: #0e0f0f;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons .progressive .unclicked {
  background-color: #dd8b3c;
  color: #6e2e14;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons .back .unclicked {
  background-color: #854abe;
  color: #39303f;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons .passive .unclicked {
  background-color: #907b9a;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons .back .clicked {
  background-color: #562e7c;
  color: #0e0f0f;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons .passive .clicked {
  background-color: #55495b;
  color: #0e0f0f;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}
.buttons .danger .clicked {
  background-color: #d13636;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}
.buttons .danger .unclicked {
  background-color: #FF4545;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}
/* speachial buttons settings end */

.buttons.generative.clicked,
.buttons .generative .clicked {
  background-color: #5a3a69;
  color: #ffffff;
  -webkit-text-stroke: 3px #000000;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons.generative.unclicked,
.buttons .generative .unclicked {
  background-color: #854abe;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons.progressive.clicked,
.buttons .progressive .clicked {
  background-color: #6e2e14;
  color: #0e0f0f;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons.progressive.unclicked,
.buttons .progressive .unclicked {
  background-color: #dd8b3c;
  color: #6e2e14;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons.back.unclicked,
.buttons .back .unclicked {
  background-color: #854abe;
  color: #39303f;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons.passive.unclicked,
.buttons .passive .unclicked {
  background-color: #907b9a;
  color: #ffffff;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons.back.clicked,
.buttons .back .clicked {
  background-color: #562e7c;
  color: #0e0f0f;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.buttons.passive.clicked,
.buttons .passive .clicked
  {
  background-color: #55495b;
  color: #0e0f0f;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: bold;
}

.codeoutput-bg{
background-color: #242525;
}
#codeoutput-bg svg{
  width: 100%;
  height: 100%;
}
        
  `
  }
};
export const useCreateDefault = (url, data) => {
  const { dispatchUserData } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const create = async (callbackSuccess, callbackError) => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken("token")}`,
      },
      data: {
        ...data,
        uiContent: uiCOntentDefault
      }
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    create,
    loading
  }
}
export const useCreateChild = () => {
  const { dispatchUserData } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const create = async (id, callbackSuccess, callbackError) => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "post",
      url: `/api/coding-activity/${id}/child-activity`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken("token")}`,
      },
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    create,
    loading
  }
}
export const useResetChild = () => {
  const { dispatchUserData } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const reset = async (id, parentActivity, callbackSuccess, callbackError) => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "post",
      url: `/api/coding-activity/${id}/reset`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken("token")}`,
      }, data: {
        parentActivity
      }
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    reset,
    loading
  }
}

export const useUpdateUiContents = () => {
  const { dispatchUserData } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const update = async (url, data, callbackSuccess, callbackError) => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "put",
      url: url,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken("token")}`,
      },
      data
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    update,
    loading
  }
}
export const useUploadImage = () => {
  const { dispatchUserData } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const upload = async (data, callbackSuccess, callbackError) => {
    dispatchUserData({ type: "checkLogin" });
    const config = {
      method: "post",
      url: "/api/upload",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken("token")}`,
      },
      data
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  const remove = async (data=[], callbackSuccess, callbackError) => {
    dispatchUserData({ type: "checkLogin" });
    if(data.length == 0){
      return;
    }
    const config = {
      method: "delete",
      url: "/api/upload",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken("token")}`,
      },
      data:{
        imageIds: data
      }
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    upload,
    remove,
    loading
  }
}
export const useChatFeedback = () => {
  const [loading, setLoading] = React.useState(false);
  const send = async (data, callbackSuccess, callbackError) => {
    const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
    if (!clientAnalyticsSessionExist) {
      return
    }
    const config = {
      method: "put",
      url: "/api/analytics/"+clientAnalyticsSessionExist,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        ...data,
      }
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    send,
    loading
  }
}
export const useAnalytics = () => {
  const { uiData } = React.useContext(UiDataContext);
  const [loading, setLoading] = React.useState(false);
  const send = async (callbackSuccess, callbackError) => {
    const data = {}
    data['time'] = Date.now();
    data['sessionStartTime'] = Date.now();
    data['codingActivity'] = uiData._id;
    const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
    if (clientAnalyticsSessionExist) {
      data['session'] = clientAnalyticsSessionExist;
    }
    const config = {
      method: "post",
      url: "/api/analytics",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      sessionStorage.setItem('client-analytics-session-id', response.data._id)
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      // if (error?.response?.status == 401) {
      //   toast.error(error.response.data.message + ". Login to try again.", {
      //     position: "top-center",
      //   });
      // } else {
      //   toast.error(error.message, {
      //     position: "top-center",
      //   });
      // }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    send,
    loading
  }
}
export const useInitClientAnalytics = () => {
  const { uiData } = React.useContext(UiDataContext);
  const [loading, setLoading] = React.useState(false);
  const uaparser = UAParser()
  const create = async (callbackSuccess, callbackError) => {
    if (!uiData._id) {
      if (callbackError) {
        callbackError({ message: "Ui data not found" })
      }
      return;
    }
    const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
    if (clientAnalyticsSessionExist) {
      return
    }
    const data = {}
    data.time = Date.now();
    data.sessionStartTime = Date.now();
    data.codingActivity = uiData._id;
    const uidIdExist = localStorage.getItem('analytics-uid-id');
    if (uidIdExist) {
      data['uid'] = uidIdExist;
    } else {
      const uidId = uuidv4();
      localStorage.setItem('analytics-uid-id', uidId);
      data['uid'] = uidId;
    }
    if (uaparser) {
      data['device'] = uaparser.os.name
      data['deviceVersion'] = uaparser.os.version
      data['browser'] = uaparser.browser.name
      data['browserVersion'] = uaparser.browser.major
      data['screenWidth'] = window.innerWidth
      data['screenHeight'] = window.innerHeight
    }
    const config = {
      method: "post",
      url: "/api/analytics",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      sessionStorage.setItem('client-analytics-session-id', response.data._id)
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    create,
    loading
  }
}

export const useIssueAnalytics = () => {
  const { uiData } = React.useContext(UiDataContext);
  const [loading, setLoading] = React.useState(false);
  const send = async (e, callbackSuccess, callbackError) => {
    const data = { ...e }
    // acceptable data
    // { errorCode
    // issueType
    // description }
    data['codingActivity'] = uiData._id;
    const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
    if (clientAnalyticsSessionExist) {
      data['analytics'] = clientAnalyticsSessionExist;
    }else{
      return
    }
    // const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
    // if (clientAnalyticsSessionExist) {
    //   data['session'] = clientAnalyticsSessionExist;
    // }
    const config = {
      method: "put",
      // url: "/api/code-executor-issue-list",
      url: "/api/analytics/"+clientAnalyticsSessionExist,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    send,
    loading
  }
}
export const useErrorAnalytics = () => {
  const { uiData } = React.useContext(UiDataContext);
  const [loading, setLoading] = React.useState(false);
  const send = async (e, callbackSuccess, callbackError) => {
    const data = { ...e }
    // acceptable data
    // { errorCode
    // issueType
    // description }
    data['codingActivity'] = uiData._id;
    const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
    if (clientAnalyticsSessionExist) {
      data['analytics'] = clientAnalyticsSessionExist;
    }else{
      return;
    }
    // const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
    // if (clientAnalyticsSessionExist) {
    //   data['session'] = clientAnalyticsSessionExist;
    // }
    const config = {
      method: "put",
      // url: "/api/code-executor-issue-list",
      url: "/api/analytics/"+clientAnalyticsSessionExist,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data
    };
    setLoading(true);
    try {
      const response = await api.request(config);
      setLoading(false);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
      setLoading(false);
    }
  };
  return {
    send,
    loading
  }
}