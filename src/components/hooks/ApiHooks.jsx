import React, { useContext } from 'react'
import { UserContext } from "@/contextapi/UserProvider";
import { getToken } from '@/utils/token';
import { toast } from 'react-toastify';
import { api } from '@/utils/apibase';
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';

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
const uiCOntentDefault = {
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
            "left": 572,
            "width": 150,
            "height": 211,
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
        "all": "\n:root {\n  --ui-violet: #854ABE;\n  --ui-dark: #171819;\n  --ui-card-bg: #907B9A;\n  --ui-gray-1: #C7C7C7;\n  --ui-gray-2: #828282;\n  --ui-gray-3: #4F4F4F;\n  --ui-gray-4: #404040;\n  --ui-dark-orange: #6E3822;\n  --ui-medium-violet: #532688;\n  --ui-dark-violet: #5A3A69;\n  --ui-light-blue-shade: #D9D9D9;\n  --ui-white-title: #858585;\n  --ui-white-text: #A5A5A5;\n  --ui-orange: #FF8C00;\n  --ui-purple: #cc00cc;\n  --ui-blue: #00BBFF;\n  --ui-light-blue: #b0ddff;\n  --ui-light-gray: #36393e;\n  --ui-medium-gray: #282b30;\n  --ui-dark-gray: #1e2124;\n  --ui-cloud: rgb(30, 31, 34);\n  --ui-bg: rgb(49, 51, 56);\n  --ui-ground: #000000;\n  --ui-hamburger: rgb(43, 45, 49);\n}\n\n.prose :where(h1):not(:where([class~=\"not-prose\"], [class~=\"not-prose\"] *)),\n.prose :where(h2):not(:where([class~=\"not-prose\"], [class~=\"not-prose\"] *)),\n.prose :where(h3):not(:where([class~=\"not-prose\"], [class~=\"not-prose\"] *)),\n.prose :where(h4):not(:where([class~=\"not-prose\"], [class~=\"not-prose\"] *)),\n.prose :where(h5):not(:where([class~=\"not-prose\"], [class~=\"not-prose\"] *)),\n.prose :where(h6):not(:where([class~=\"not-prose\"], [class~=\"not-prose\"] *)),\n.prose :where(strong):not(:where([class~=\"not-prose\"], [class~=\"not-prose\"] *)) {\n  color: #000000;\n}\n\n.mystmd-preview-container blockquote,\n.mystmd-preview-container dd,\n.mystmd-preview-container dl,\n.mystmd-preview-container figure,\n.mystmd-preview-container h1,\n.mystmd-preview-container h2,\n.mystmd-preview-container h3,\n.mystmd-preview-container h4,\n.mystmd-preview-container h5,\n.mystmd-preview-container h6,\n.mystmd-preview-container hr,\n.mystmd-preview-container p,\n.mystmd-preview-container pre {\n  margin: 0 !important;\n}\n\n/* code-editor-container css start */\n.code-editor-container .cropper-container{\n  width: 750px;\n}\n\n/* code-editor-container css end */\n/* code-editor-top-card-container css start */\n\n.code-editor-top-card-container {\n  padding: 12px;\n  padding-bottom: 0px;\n  filter: drop-shadow(0px 4px 0px rgb(145 123 154)) drop-shadow(0px 4px 0px rgb(83 38 136));\n}\n\n.code-editor-top-card-container .card-image {\n  width: 270px;\n  height: 270px;\n  position: absolute;\n  right: -74px;\n  top: -61px;\n  z-index: 50;\n}\n\n.code-editor-top-card-container .container-inner-1 {\n  display: flex;\n  position: relative;\n}\n\n.code-editor-top-card-container .text-element-container {\n  background-color: #ffffff;\n  border-radius: 4px;\n  color: #39303f;\n  width: calc(100% - 44px);\n  left: 0px;\n  z-index: 20;\n}\n\n.code-editor-top-card-container .text-element-container-inner-1 {\n  margin-right: 75px;\n  padding: 8px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  height: 100%;\n  position: relative;\n}\n\n.code-editor-top-card-container .text-element-container-inner-1 .text-element-container-inner-1-text {\n  font-family: \"Inter\", sans-serif;\n  text-align: center;\n}\n.code-editor-top-card-container .text-element-container-inner-1 .text-element-container-inner-1-text h1{\n  margin-bottom: 10px !important;\n}\n\n.feedback-review-like-image{\n  width: 100px;\n  height: 98px;\n}\n.feedback-review-unlike-image{\n  width: 100px;\n  height: 98px;\n}\n\n/* code-editor-top-card-container css end */\n\n/* expand button css start */\n.expand-bootom-container{\n  padding-left: 10px;\n  padding-right: 63px;\n}\n.expand-bootom-action {\n  width: 100%;\n  height: 18px;\n  margin: 0px 12px 0px 24px;\n  background-color: #854abe;\n  border-radius: 2px;\n  box-shadow: inset 0 -2px 0 0 #40235c;\n}\n\n.bootom-action-btn {\n  font-family: \"Inter\", sans-serif;\n  font-size: 12px;\n  font-weight: bold;\n  text-align: center;\n  text-shadow: 0 -1px 0 rgba(255, 255, 255, 0.24);  \n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n}\n/* expand button css end */\n\n/* chat prompt top bar css start */\n.chat-prompt-top-card-container {\n  width: 730px;\n  /* height: 190px; */\n  /* background-color: var(--ui-purple); */\n  padding-top: 23px;\n  padding-bottom: 10px;\n  filter: drop-shadow(0px 4px 0px rgb(145 123 154))\n           drop-shadow(0px 4px 0px rgb(83 38 136));\n  position: relative  ;\n}\n.chat-prompt-top-card-close-icon{\n  position: absolute ;\n  right: 0px;\n  top: 10px;\n  width: 43px;\n  height: 43px;\n}\n.chat-prompt-top-card-container-avater {\n  position: absolute;\n  height: 183px;\n  left: 4px;\n  top: 0px;\n}\n.chat-prompt-top-card-text-container {\n  margin-top: 10px;\n  margin-left: 44px;\n  margin-right: 20px;\n  height: 155px;\n  background-color: white;\n  border-radius: 4px;\n  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),\n                  0px 7px 0px 0 rgb(83 38 136); */\n}\n.chat-prompt-top-card-container-header-text-container {\n  padding-left: 211px;\n  min-height: 100px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.chat-prompt-top-card-container-header-text-container .chat-prompt-top-card-container-header-text {\n  text-align: center;\n}\n.chat-prompt-top-card-container-footer-text-container {\n  padding-left: 70px;\n  min-height: 55px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.chat-prompt-top-card-container-footer-text-container .chat-prompt-top-card-container-footer-text p {\n  font-size: 14px !important;\n}\n.chat-prompt-top-card-container-footer-text-container strong {\n  font-weight: bold;\n}\n    \n/* chat prompt top bar css end */\n\n/* chat prompt user message top bar css start */\n.chat-prompt-user-message-container {\n  width: 730px;\n  /* background-color: var(--ui-purple); */\n  padding-bottom: 10px;\n  padding-top: 10px;\n  filter: drop-shadow(0px 4px 0px rgb(145 123 154))\n           drop-shadow(0px 4px 0px rgb(83 38 136));\n}\n.chat-prompt-user-message-text-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-top: 10px;\n  margin-left: 44px;\n  margin-right: 20px;\n  background-color: white;\n  border-radius: 4px;\n  padding: 20px;\n  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),\n                  0px 7px 0px 0 rgb(83 38 136); */\n}\n.chat-prompt-user-message-container-header-text-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.chat-prompt-user-message-container-header-text {\n  font-size: 14px;\n  text-align: center;\n  font-weight: normal;\n  color: black;\n  line-height: 1.4;\n}\n.chat-prompt-user-message-container-header-text strong{\n  font-weight: bold;\n}\n.chat-prompt-user-message-container-footer-text-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.chat-prompt-user-message-container-footer-text-container pre {\n  font-size: 12px;\n  text-align: center;\n  font-weight: normal;\n  color: black;\n  line-height: 1.3;\n  font-family: \"Inter\", sans-serif;\n  white-space: break-spaces;\n}\n.chat-prompt-user-message-container-footer-text-container span {\n  font-weight: bold;\n}\n    \n/* chat prompt user message top bar css end */\n\n\n/* chat prompt assistant message top bar css start */\n.chat-prompt-assistant-message-container {\n  width: 730px;\n  /* background-color: var(--ui-purple); */\n  padding-bottom: 10px;\n  padding-top: 10px;\n  filter: drop-shadow(0px 4px 0px rgb(145 123 154))\n           drop-shadow(0px 4px 0px rgb(83 38 136));\n}\n.chat-prompt-assistant-message-text-container {\n  align-items: center;\n  margin-top: 10px;\n  margin-left: 44px;\nmargin-right: 20px;\n  background-color: white;\n  border-radius: 4px;\n  padding: 20px;\n  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),\n                  0px 7px 0px 0 rgb(83 38 136); */\n}\n.chat-prompt-assistant-message-container-header-text {\n  font-size: 14px;\n  text-align: left;\n  font-weight: normal;\n  color: black;\n  line-height: 1.4;\n}\n.chat-prompt-assistant-message-container-header-text strong{\n  font-weight: bold;\n}\n.chat-prompt-assistant-message-container-text-box {\n  background-color: #D9D9D9;\n  margin-top: 4px;\n  padding: 10px;\n  border-radius: 2px;\n  font-size: 12px;\n  text-align: left;\n  font-weight: normal;\n  color: black;\n  line-height: 1.4;\n  position: relative;\n}\n.chat-prompt-assistant-message-container-text {\n  font-size: 12px;\n  font-weight: normal;\n  color: black;\n  font-family: \"Inter\", sans-serif;\n  /* line-height: 1.3; */\n  white-space: break-spaces;\n  \n}\n    \n/* chat prompt assistant message top bar css end */\n\n\n/* chat prompt assistant message top bar css start */\n.chat-prompt-assistant-message-follow-up-container {\n  width: 730px;\n  /* background-color: var(--ui-purple); */\n  margin-top: 5px;\n  padding-top: 5px;\n  padding-bottom: 10px;\n  filter: drop-shadow(0px 4px 0px rgb(145 123 154))\n           drop-shadow(0px 4px 0px rgb(83 38 136));\n}\n.chat-prompt-assistant-message-follow-up-container-avater {\n  position: absolute;\n  height: 141px;\n  left: 22px;\n  top: 0px;\n\n}\n.chat-prompt-assistant-message-follow-up-text-container {\n  margin-top: 10px;\n  margin-left: 44px;\nmargin-right: 20px;\n  background-color: white;\n  border-radius: 4px;\n  padding: 20px;\n  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),\n                  0px 7px 0px 0 rgb(83 38 136); */\n}\n.chat-prompt-assistant-message-follow-up-content {\n  padding-left: 90px;\n}\n.chat-prompt-assistant-message-follow-up-container-header-text {\n  font-size: 14px;\n  text-align: left;\n  font-weight: normal;\n  color: black;\n  line-height: 1.4;\n}\n.chat-prompt-assistant-message-follow-up-container-header-text strong {\n  font-weight: bold;\n}\n.chat-prompt-assistant-message-follow-up-text-box {\n  background-color: #D9D9D9;\n  margin-top: 4px;\n  padding: 10px;\n  border-radius: 2px;\n  min-height: 70px;\n  font-size: 12px;\n  text-align: left;\n  font-weight: normal;\n  color: black;\n  line-height: 1.4;\n  position: relative;\n}\n.chat-prompt-assistant-message-follow-up-text-box-triangle{\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-right: 20px solid #D9D9D9;\n  border-bottom: 10px solid transparent;\n  border-top: 10px solid transparent;\n  margin-top: -10px;\n  margin-left: 0px;\n  left: -18px;\n  top: 60px;\n}\n.chat-prompt-assistant-message-follow-up-assistant-text{\n  font-size: 12px;\n  font-weight: normal;\n  color: black;\n  font-family: \"Inter\", sans-serif;\n  line-height: 1.6;\n  white-space: break-spaces;\n}\n/* chat prompt assistant message top bar css end */\n\n\n/* chat prompt ask-followup-question top bar css start */\n.chat-prompt-ask-followup-question-container {\n  width: 730px;\n  padding-bottom: 10px;\n  padding-top: 10px;\n  filter: drop-shadow(0px 4px 0px rgb(145 123 154))\n           drop-shadow(0px 4px 0px rgb(83 38 136));\n  position: relative;\n}\n.chat-prompt-ask-followup-question-container-triangle{\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-right: 10px solid transparent;\n  border-bottom: 10px solid #D9D9D9;\n  border-left: 10px solid transparent;\n  margin-top: 10px;\n  margin-left: 0px;\n  left: 50%;\n  top: 0%;\n}\n.chat-prompt-ask-followup-question-text-container {\n  align-items: center;\n  margin-top: 10px;\n  margin-left: 44px;\nmargin-right: 20px;\n  background-color: #D9D9D9;\n  border-radius: 4px;\n  padding: 20px;\n  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),\n                  0px 7px 0px 0 rgb(83 38 136); */\n}\n.chat-prompt-ask-followup-question-container-input-text-container{\n  padding-top: 10px;\n}\n.chat-prompt-ask-followup-premade-question-container {\n  display: flex;\n  align-items: center;\n}\n.chat-prompt-ask-followup-premade-question-list-container{\n  width: calc(100% - 40px);\n  padding-left: 20px;\n  padding-right: 20px;\n}\n.chat-prompt-ask-followup-premade-question-list {\n  margin: -10px;\n  display: flex;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n}\n.chat-prompt-ask-followup-premade-single-question {\n  padding: 10px;\n  white-space: nowrap;\n}\n.chat-prompt-ask-followup-premade-question-btn{\n  background-color: #907b9a;\n  padding: 5px 14px;\n  font-size: 14px;\n  font-weight: bold;\n  border-radius: 10px;\n  color: white;\n}\n.premade-question-scroller-action-btn{\n  width: 20px;\n  height: 20px;\n}\n.chat-prompt-ask-followup-question-container-header-text {\n  font-size: 14px;\n  text-align: left;\n  font-weight: normal;\n  color: black;\n  line-height: 1.4;\n}\n.chat-prompt-ask-followup-question-container-header-text strong{\n  font-weight: bold;\n}\n.chat-prompt-ask-followup-question-container-text-input {\n  background-color: #828282;\n  width: 100%;\n  margin-top: 4px;\n  padding: 10px;\n  border-radius: 2px;\n  font-size: 14px;\n  text-align: left;\n  font-weight: normal;\n  color: black;\n  line-height: 1.4;\n  position: relative;\n}\n.ask-followup-action-container{\n  padding-top: 10px ;\n}\n.ask-followup-button{\n  padding: 10px 58px;\n  width: 100%;\n  font-size: 14px !important;\n  border-radius: 2px;\n}\n.chat-prompt-ask-followup-question-container-text {\n  font-size: 12px;\n  font-weight: normal;\n  color: black;\n  font-family: \"Inter\", sans-serif;\n  /* line-height: 1.3; */\n  white-space: wrap;\n}\n    \n/* chat prompt ask-followup-question top bar css end */\n\n\n/* chat prompt user review-action top bar css start */\n.chat-prompt-user-review-action-container {\n  width: 730px;\n  /* background-color: var(--ui-purple); */\n  padding-bottom: 10px;\n  padding-top: 10px;\n  filter: drop-shadow(0px 4px 0px rgb(145 123 154))\n           drop-shadow(0px 4px 0px rgb(83 38 136));\n}\n.chat-prompt-user-review-action-text-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-top: 10px;\n  margin-left: 44px;\nmargin-right: 20px;\n  background-color: white;\n  border-radius: 4px;\n  padding: 20px;\n  /* box-shadow: 0px 4px 0px 0 rgb(145 123 154),\n                  0px 7px 0px 0 rgb(83 38 136); */\n}\n.chat-prompt-user-review-action-container-header-text-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.chat-prompt-user-review-action-container-header-text {\n  font-size: 14px;\n  text-align: center;\n  font-weight: normal;\n  color: black;\n  line-height: 1.4;\n  min-width: 365px;;\n}\n.chat-prompt-user-review-action-container-header-text strong{\n  font-weight: bold;\n}\n.chat-prompt-user-review-action-container-buttons {\n  padding-top: 30px;\n  padding-bottom: 20px;\n  width: 365px;\n  margin-left: auto;\n  margin-right: auto;\n  position: relative;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n    \n/* chat prompt user review-action top bar css end */\n\n\n.chat-prompt-user-screenshot-container{\n  width: 730px;\n  /* background-color: var(--ui-purple); */\n  padding-bottom: 10px;\n  padding-top: 10px;\n  padding-left:45px ;\n  padding-right:20px ;\n  filter: drop-shadow(0px 4px 0px rgb(145 123 154))\n           drop-shadow(0px 4px 0px rgb(83 38 136));\n}\n.chat-prompt-user-screenshot-image{\n  padding: 20px;\n  border-radius: 4px;\n  background-color: white;\n  display: flex;\n  justify-content: center;    \n}\n.chat-prompt-user-screenshot-image img{\n  width: auto;\n  height: auto;\n  max-height: 300px;\n  border-radius: 4px;\n}\n/* chat prompt follow up buttons css start */\n.follow-up-button-section{\n  margin-top: 20px;\n}\n.follow-up-buttons{\n  display: flex;\n  justify-content: space-between;\n  margin: -10px;\n}\n.button-container{\n  padding: 10px;\n}\n.button-container .btn{\n  width: 100%;\n  padding: 10px 15px;\n  white-space: nowrap;\n  font-size: 12px !important;\n  border-radius: 2px;\n}\n.button-container .btn-big-x-padding{\n  padding: 10px 58px;\n}\n.button-container.auto-audjust-width{\n  flex:auto;\n}\n/* chat prompt follow up buttons css end */\n\n/* speachial buttons settings start */\n.buttons .generative .clicked {\n  background-color: #5a3a69;\n  color: #ffffff;\n  -webkit-text-stroke: 3px #000000;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons .generative .unclicked {\n  background-color: #854abe;\n  color: #ffffff;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons .progressive .clicked {\n  background-color: #6e2e14;\n  color: #0e0f0f;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons .progressive .unclicked {\n  background-color: #dd8b3c;\n  color: #6e2e14;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons .back .unclicked {\n  background-color: #854abe;\n  color: #39303f;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons .passive .unclicked {\n  background-color: #907b9a;\n  color: #ffffff;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons .back .clicked {\n  background-color: #562e7c;\n  color: #0e0f0f;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons .passive .clicked {\n  background-color: #55495b;\n  color: #0e0f0f;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n.buttons .danger .clicked {\n  background-color: #d13636;\n  color: #ffffff;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n.buttons .danger .unclicked {\n  background-color: #FF4545;\n  color: #ffffff;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n/* speachial buttons settings end */\n\n.buttons.generative.clicked,\n.buttons .generative .clicked {\n  background-color: #5a3a69;\n  color: #ffffff;\n  -webkit-text-stroke: 3px #000000;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons.generative.unclicked,\n.buttons .generative .unclicked {\n  background-color: #854abe;\n  color: #ffffff;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons.progressive.clicked,\n.buttons .progressive .clicked {\n  background-color: #6e2e14;\n  color: #0e0f0f;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons.progressive.unclicked,\n.buttons .progressive .unclicked {\n  background-color: #dd8b3c;\n  color: #6e2e14;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons.back.unclicked,\n.buttons .back .unclicked {\n  background-color: #854abe;\n  color: #39303f;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons.passive.unclicked,\n.buttons .passive .unclicked {\n  background-color: #907b9a;\n  color: #ffffff;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons.back.clicked,\n.buttons .back .clicked {\n  background-color: #562e7c;\n  color: #0e0f0f;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.buttons.passive.clicked,\n.buttons .passive .clicked\n {\n  background-color: #55495b;\n  color: #0e0f0f;\n  font-family: \"Inter\", sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}\n\n.codeoutput-bg{\nbackground-color: #242525;\n}\n#codeoutput-bg svg{\n  width: 100%;\n  height: 100%;\n}\n\n\n.drawer-view-plot-left-label-visible {\n  width: 105px;\n  padding: 2.5px;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 100%;\n  margin-left: 1.25rem;\n}\n.drawer-view-plot-left-label-hidden {\n  margin-left: 1.25rem;\n  display: none;\n}\n.drawer-view-plot-right-label-visible {\n  margin-right: 1.25rem;\n  width: 105px;\n  padding: 2.5px;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 100%;\n}\n.drawer-view-plot-right-label-hidden {\n  margin-right: 1.25rem;\n  display: none;\n}\n.drawer-view-plot-bottom-label {\n  text-wrap: wrap;\n  text-align: center;\n  padding: 0.5rem;\n}"
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
export const useChatFeedback = () => {
    const [loading, setLoading] = React.useState(false);
    const send = async (data, callbackSuccess, callbackError) => {
        const authUserExist = localStorage.getItem('auth-user');
        const authUser = authUserExist ? JSON.parse(authUserExist) : null;
        const config = {
            method: "post",
            url: "/api/chat-feedback",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data:{
                ...data,
                user: authUser._id
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
        const authUserExist = localStorage.getItem('auth-user');
        const authUser = authUserExist ? JSON.parse(authUserExist) : null;
        if (authUser) {
            data['user'] = authUser._id;
            data['time'] = Date.now();
            data['codingActivity'] = uiData._id;
            const authUserAnalyticsSessionExist = sessionStorage.getItem('auth-user-analytics-session');
            if (authUserAnalyticsSessionExist) {
                data['session'] = authUserAnalyticsSessionExist;
            }
        } else {
            return;
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
            sessionStorage.setItem('auth-user-analytics-session', response.data._id)
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
