import React, { useEffect } from 'react'
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import { ChatMessagesContext } from '@/contextapi/code-executor-api/ChatMessagesProvider';
import UploadImageWrapper from '../editors/EditUploadImageWrapper';
import EditTextElementWrapper from '../editors/EditTextElementWrapper';
import EditMystMdElementWrapper from '../editors/EditMystMdElementWrapper';
import MystPreviewTwContainer from '@/components/mystmdpreview/MystPreviewTwContainer';
import debouncer from '@/utils/debouncer';
import AnotationTool from '../anotation-tool/AnotationTool';
const ChatPromptTopCardUi = ({ headerText }) => {
    const [editorFocused, setEditorFocused] = React.useState('');
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const { messages, dispatchMessages } = React.useContext(ChatMessagesContext);
    const handleCloseChatPrompt = () => {
        dispatchUiData({ type: 'setScreen', payload: 'editor' });
        dispatchMessages({ type: "setTakeScreenshot", payload: false });
    }
    const dispatchUiDataWithDebounce = debouncer(dispatchUiData, 400)
  const openIntoEditor = (index) => {
    if(index === -1) return;
    if(index == null) return;
    if(index === undefined) return;
    if (uiData.devmode) {
      dispatchUiData({ type: "setActivePath", payload: { path: `chatPromptTopCardUiAnotations[${index}]`, type: "annotation" } })
    }
  }
    return (
        <div>
            <AnotationTool defaultValue={uiData.uiContent?.chatPromptTopCardUiAnotations}
                onUpdate={(value) => {
                    dispatchUiDataWithDebounce({ type: 'setContent', payload: { key: "chatPromptTopCardUiAnotations", data: value } })
                }}
                editable={uiData.devmode}
                showAddOnHover
        onUpdateIndex={openIntoEditor}
            >
                <div className='chat-prompt-top-card-container'>
                    <button className='chat-prompt-top-card-close-icon'
                        onClick={handleCloseChatPrompt}
                    >
                        <img src='/images/close-icon.svg' alt='close-icon' />
                    </button>
                    <UploadImageWrapper
                        className="chat-prompt-top-card-container-avater"
                        path={"chatPromptTopCardAvater.data"}
                        stylePath={"chatPromptTopCardAvater.styles"}
                        styles={uiData?.uiContent?.chatPromptTopCardAvater?.styles}
                    >
                        <img className='chat-prompt-top-card-container-avater'
                            src={uiData?.uiContent?.chatPromptTopCardAvater?.data ? uiData?.uiContent?.chatPromptTopCardAvater?.data : "/imoje-charecters/raven-rigorous.png"}
                            alt="Avatar"
                            style={{
                                width: uiData?.uiContent?.chatPromptTopCardAvater?.styles?.width || 270 + "px",
                                height: uiData?.uiContent?.chatPromptTopCardAvater?.styles?.height || 270 + "px",
                                top: uiData?.uiContent?.chatPromptTopCardAvater?.styles?.top + "px",
                                left: uiData?.uiContent?.chatPromptTopCardAvater?.styles?.left + "px",
                                transform: "rotate(" + uiData?.uiContent?.chatPromptTopCardAvater?.styles?.rotateAngle + "deg)",
                            }}
                        />
                    </UploadImageWrapper>
                    <div className='chat-prompt-top-card-text-container'>
                        <div className='chat-prompt-top-card-container-header-text-container'>
                            <EditMystMdElementWrapper
                                className={`chat-prompt-top-card-container-header-text`}
                                path={"chatprompt.headerElement"}
                            >
                                <div
                                    className='chat-prompt-top-card-container-header-text'
                                >
                                    <MystPreviewTwContainer data={uiData?.uiContent?.chatprompt?.headerElement || ""} />
                                </div>

                            </EditMystMdElementWrapper>
                        </div>
                        <div className='chat-prompt-top-card-container-footer-text-container relative'>
                            <EditMystMdElementWrapper
                                className={`chat-prompt-top-card-container-footer-text`}
                                path={"chatprompt.footerElement"}
                            >
                                <div
                                    className='chat-prompt-top-card-container-footer-text'
                                >
                                    <MystPreviewTwContainer data={uiData?.uiContent?.chatprompt?.footerElement || ""} />
                                </div>
                            </EditMystMdElementWrapper>
                        </div>
                    </div>
                </div>
            </AnotationTool>
        </div>
    )
}

export default ChatPromptTopCardUi