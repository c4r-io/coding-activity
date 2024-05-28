import React, { Fragment } from 'react'

import { UiDataContext } from "@/contextapi/code-executor-api/UiDataProvider.jsx";
import { ChatMessagesContext } from "@/contextapi/code-executor-api/ChatMessagesProvider.jsx";
import MarkdownRenderer from './MardownRenderer.jsx';
import { useChatFeedback, useErrorAnalytics } from '@/components/hooks/ApiHooks.jsx';
import UploadImageWrapper from '../editors/EditUploadImageWrapper.jsx';
import EditTextElementWrapper from '../editors/EditTextElementWrapper.jsx';
import EditMystMdElementWrapper from '../editors/EditMystMdElementWrapper.jsx';
import MystPreviewTwContainer from '@/components/mystmdpreview/MystPreviewTwContainer.jsx';
const ChatPromptMessagesUi = ({ }) => {
    const { messages, dispatchMessages } = React.useContext(ChatMessagesContext);
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    return (
        <div className='text-white'>
            {uiData.devmode && <FollowUpAskQuestionUi />}
            {messages.messageList.map((message, index) => {
                return (
                    <div key={index}>
                        {message.role === 'user' &&
                            <UserMessageUi prompt={`${message?.content[0]?.text.split(uiData.codeRefPrompt)[0]}`} />
                        }
                        {/* {uiData.devmode && <AssistantMessageUi prompt={`${message?.content}`} />} */}
                        {message.role === 'assistant' ? uiData.chatScreenStatus != "followUpReviewAction" && messages.messageList.length - 1 == index ?
                            <FollowUpAndAssistantMessageUi prompt={`${message?.content}`} feeling={`${message?.feeling || "neutral"}`} />
                            :
                            <AssistantMessageUi prompt={`${message?.content}`} /> : ''
                        }
                    </div>
                );
            })}
            {messages.takeScreenshot && messages.image && <ScreenshotImageCard image={messages.image} />}
            {(!uiData.devmode && uiData.chatScreenStatus === 'followUpAskQuestion') && <FollowUpAskQuestionUi />}
            {(uiData.devmode || uiData.chatScreenStatus === 'followUpReviewAction') && <FollowUpReviewActionUi />}
        </div>
    )
}

export default ChatPromptMessagesUi

const UserMessageUi = ({ prompt }) => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);

    return (
        <div className='chat-prompt-user-message-container'>
            <div className='chat-prompt-user-message-text-container'>
                <div>
                    <div className='chat-prompt-user-message-container-header-text-container'>
                        {/* <EditTextElementWrapper
                            className={`chat-prompt-user-message-container-header-text`}
                            path={"chatprompt.userMessageTitle"}
                        >
                            <h3
                                className='chat-prompt-user-message-container-header-text'
                                dangerouslySetInnerHTML={{ __html: uiData?.uiContent?.chatprompt?.userMessageTitle }}
                            >
                            </h3>
                        </EditTextElementWrapper> */}
                        <EditMystMdElementWrapper
                            className={`chat-prompt-user-message-container-header-text`}
                            path={"chatprompt.userMessageTitle"}
                        >
                            <div
                                className='chat-prompt-user-message-container-header-text'
                            >
                                <MystPreviewTwContainer data={uiData?.uiContent?.chatprompt?.userMessageTitle || ""} />
                            </div>
                        </EditMystMdElementWrapper>
                    </div>
                    <div className='chat-prompt-user-message-container-footer-text-container'>

                        <pre className='chat-prompt-user-message-container-footer-text'>
                            {prompt}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
const AssistantMessageUi = ({ prompt }) => {
    // console.log(prompt)
    // convert the markdown to html
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);

    return (

        <div className='chat-prompt-assistant-message-container'>
            <div className='chat-prompt-assistant-message-text-container'>
                <div>
                    <div className='chat-prompt-assistant-message-container-header-text-container'>
                        {/* <EditTextElementWrapper
                            className={`chat-prompt-assistant-message-container-header-text`}
                            path={"chatprompt.assistantMessageHeaderTitle"}
                        >
                            <h3
                                className='chat-prompt-assistant-message-container-header-text'
                                dangerouslySetInnerHTML={{ __html: uiData?.uiContent?.chatprompt?.assistantMessageHeaderTitle }}
                            >
                            </h3>
                        </EditTextElementWrapper> */}
                        <EditMystMdElementWrapper
                            className={`chat-prompt-assistant-message-container-header-text`}
                            path={"chatprompt.assistantMessageHeaderTitle"}
                        >
                            <div
                                className='chat-prompt-assistant-message-container-header-text'
                            >
                                <MystPreviewTwContainer data={uiData?.uiContent?.chatprompt?.assistantMessageHeaderTitle || ""} />
                            </div>
                        </EditMystMdElementWrapper>
                    </div>
                    <div className='chat-prompt-assistant-message-container-text-box'>
                        <div className='chat-prompt-assistant-message-container-text'>
                            <MarkdownRenderer markdownText={prompt} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const FollowUpAndAssistantMessageUi = ({ prompt, feeling }) => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    // remove fullstop from feeling if it exists and convert it to lowercase
    feeling = feeling.replace(/\./g, '').toLowerCase();

    const ravenImage = {
        neutral: "/images/raven/neutral.png",
        supportive: "/images/raven/neutral.png",
        warning: "/images/raven/warning.png",
        concerned: "/images/raven/warning.png",
        delighted: "/images/raven/shining.png",
        amazed: "/images/raven/shining.png",
        complicated: "/images/raven/magnifying.png",
        'potentially frustrating': "/images/raven/coffee.png",
    }
    return (

        <div className='chat-prompt-assistant-message-follow-up-container'>
            <img className='chat-prompt-assistant-message-follow-up-container-avater' src={ravenImage[feeling]} alt="Avatar" />
            {/* <img className='chat-prompt-assistant-message-follow-up-container-avater' src="/imoje-charecters/raven-prof.png" alt="Avatar" /> */}
            <div className='chat-prompt-assistant-message-follow-up-text-container'>
                <div className='chat-prompt-assistant-message-follow-up-content'>

                    {/* <EditTextElementWrapper
                        className={`chat-prompt-assistant-message-follow-up-container-header-text`}
                        path={"chatprompt.chatprompotFollowUpTitle"}
                    >
                        <h3
                            className='chat-prompt-assistant-message-follow-up-container-header-text'
                            dangerouslySetInnerHTML={{ __html: uiData?.uiContent?.chatprompt?.chatprompotFollowUpTitle.replace("{feeling}", feeling) }}
                        >
                        </h3>
                    </EditTextElementWrapper> */}
                    <EditMystMdElementWrapper
                        className={`chat-prompt-assistant-message-follow-up-container-header-text`}
                        path={"chatprompt.chatprompotFollowUpTitle"}
                    >
                        <div
                            className='chat-prompt-assistant-message-follow-up-container-header-text'
                        >
                            <MystPreviewTwContainer data={uiData?.uiContent?.chatprompt?.chatprompotFollowUpTitle || ""} />
                        </div>
                    </EditMystMdElementWrapper>
                    <div className='chat-prompt-assistant-message-follow-up-text-box'>
                        <div className='chat-prompt-assistant-message-follow-up-text-box-triangle'></div>
                        <div className='chat-prompt-assistant-message-follow-up-assistant-text'>
                            <MarkdownRenderer markdownText={prompt} />
                        </div>
                    </div>
                </div>
                {(uiData.devmode || uiData.chatScreenStatus !== 'followUpAskQuestion') &&
                    <div className='follow-up-button-section'>
                        <div className='buttons follow-up-buttons'>
                            <div className='danger button-container'>
                                <EditTextElementWrapper
                                    className={`unclicked btn`}
                                    path={"chatprompt.followupReportBtn"}
                                    buttonEditor={true}
                                >
                                    <button className='unclicked btn'
                                        onClick={() => {
                                            dispatchUiData({ type: 'setOpenReportUi', payload: true });
                                        }}
                                    >{uiData?.uiContent?.chatprompt?.followupReportBtn}</button>
                                </EditTextElementWrapper>
                            </div>
                            <div className='passive button-container auto-audjust-width'>
                                <EditTextElementWrapper
                                    className={`unclicked btn btn-big-x-padding`}
                                    path={"chatprompt.followupSatisfiedBtn"}
                                    buttonEditor={true}
                                >
                                    <button className='unclicked btn btn-big-x-padding'
                                        onClick={() => {
                                            dispatchUiData({ type: 'setChatScreenStatus', payload: 'followUpReviewAction' });
                                        }}
                                    >{uiData?.uiContent?.chatprompt?.followupSatisfiedBtn}</button>
                                </EditTextElementWrapper>

                            </div>
                            <div className='progressive button-container auto-audjust-width'>

                                <EditTextElementWrapper
                                    className={`unclicked btn btn-big-x-padding`}
                                    path={"chatprompt.followupAskMoreBtn"}
                                    buttonEditor={true}
                                >
                                    <button className='unclicked btn btn-big-x-padding'
                                        onClick={() => {
                                            dispatchUiData({ type: 'setChatScreenStatus', payload: 'followUpAskQuestion' });
                                        }}
                                    >{uiData?.uiContent?.chatprompt?.followupAskMoreBtn}</button>
                                </EditTextElementWrapper>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
const FollowUpAskQuestionUi = () => {
    const errorAnalytics = useErrorAnalytics();
    const predefineQuestionListRef = React.useRef(null);
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const [editorFocused, setEditorFocused] = React.useState('');
    const [prompt, setPrompt] = React.useState("");
    const { messages, dispatchMessages } = React.useContext(ChatMessagesContext);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const code = "code"
    const submitHandler = async () => {
        setIsLoading(true);
        const msg = messages.messageList.length <= 3 ? uiData.codeRefPrompt + "\n " + uiData?.uiContent?.defaults?.code : ''
        const systemPrompt = {
            role: "system",
            content: [
                { type: "text", text: uiData.systemPrompt },
            ],
        }
        const newMessage = {
            role: "user",
            content: [
                { type: "text", text: prompt + "\n " + msg },
            ],
        };
        if (messages?.image) {
            newMessage.content.push({
                type: "image_url",
                image_url: {
                    url: messages?.image,
                },
            })
        }
        const model = {}
        if (uiData.gptModel) {
            model.gptModel = uiData.gptModel;
        }
        try {
            // remove feeling key from messages if it exists

            const newMessageList = messages.messageList.map((message) => {
                if (message?.feeling) {
                    delete message.feeling;
                }
                return message;
            });
            const messagesFormated = [...newMessageList, newMessage]
            messagesFormated.unshift(systemPrompt)
            // const messagesFormated = [...messages.messageList, newMessage]
            const url = 'https://author-dashboard-theta.vercel.app/api/chatgpt/gpt_4_vision_preview';
            // const url = 'http://localhost:3030/api/chatgpt/gpt_4_vision_preview';
            const request = await fetch(url, {
                method: 'POST',
                headers: { // multipart form data
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify({ messages: messagesFormated, ...model })
            });
            const response = await request.json();

            // fetch again asking the api about how he is feeling about his reply and add the feeling to the response message, make sure the api reponse with this kywords only "neutral" or "supportive" or "warning" or "concerned" or "delighted" or "amazed" or "complicated" or "potentially frustrating" so that I can show related emoji based on the response
            const feelingRequest = await fetch('https://author-dashboard-theta.vercel.app/api/chatgpt/gpt_4_vision_preview', {
                method: 'POST',
                headers: { // multipart form data
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify({
                    messages: [...messagesFormated, { role: "assistant", content: response?.message?.content }, {
                        role: "user",
                        content: [
                            { type: "text", text: "How do you feel about your response? please answer with one word only among 'neutral', 'supportive', 'warning', 'concerned', 'delighted', 'amazed', 'complicated', 'potentially frustrating'" },
                        ],
                    }]
                }),
            });
            const feelingResponse = await feelingRequest.json();
            console.log(feelingResponse, "feelingResponse");

            setResponseMessage({ ...response?.message, feeling: feelingResponse?.message?.content });

            // add the feeling to the response message with a keyword "feeling" so that I can show related emoji based on the response
            // response.message.feeling = feelingResponse?.message?.content;


            dispatchMessages({ type: "setMessage", payload: [newMessage, { ...response?.message, feeling: feelingResponse?.message?.content }] });
            dispatchMessages({ type: "setTakeScreenshot", payload: false });
            dispatchMessages({ type: "setImage", payload: "" });
            dispatchUiData({ type: 'setChatScreenStatus', payload: '' })
            console.log(response);

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            errorAnalytics.send({
                issueCode: 5002,
                issueType: "GPT API Error",
                description: typeof(error) == 'string' ? error : JSON.stringify(error),
            })
        }

    };

    const scrollLeft = () => {
        predefineQuestionListRef.current.scrollLeft -= 200;
    }
    const scrollRight = () => {
        predefineQuestionListRef.current.scrollLeft += 200;
    }
    return (

        <div className='chat-prompt-ask-followup-question-container'>
            <div className='chat-prompt-ask-followup-question-container-triangle'></div>
            <div className='chat-prompt-ask-followup-question-text-container'>
                <div>
                    <div className='chat-prompt-ask-followup-premade-question-container'>
                        <button className='premade-question-scroller-action-btn'
                            onClick={scrollLeft}
                        >
                            <img src='/images/left-arrow.svg' />
                        </button>
                        <div className='chat-prompt-ask-followup-premade-question-list-container'>
                            {uiData.devmode ?
                                <Fragment>
                                    {editorFocused == "predefineQuestionList" ?

                                        <Fragment>
                                            <StringArrayInput
                                                defaultValues={uiData?.uiContent?.chatprompt?.predefineQuestionList}
                                                onUpdate={(e) => {
                                                    dispatchUiData({ type: 'setContent', payload: { key: 'chatprompt.predefineQuestionList', data: e } });
                                                }}
                                            />
                                            <button className='bg-green-700 px-8 py-1 w-full text-base rounded-sm' onClick={() => setEditorFocused("")}>Done</button>
                                        </Fragment>

                                        :
                                        <div className='chat-prompt-ask-followup-premade-question-list'
                                            ref={predefineQuestionListRef}
                                            tabIndex={1}
                                            title=".chat-prompt-ask-followup-premade-question-list"
                                            onFocus={(e) => setEditorFocused("predefineQuestionList")}
                                        >
                                            {uiData?.uiContent?.chatprompt?.predefineQuestionList.map((question, index) => {
                                                return (
                                                    <div key={index} className='chat-prompt-ask-followup-premade-single-question'
                                                    >
                                                        <button className='chat-prompt-ask-followup-premade-question-btn'>{question}</button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    }
                                </Fragment>
                                :
                                <div ref={predefineQuestionListRef} className='chat-prompt-ask-followup-premade-question-list'>
                                    {uiData?.uiContent?.chatprompt?.predefineQuestionList.map((question, index) => {
                                        return (
                                            <div key={index} className='chat-prompt-ask-followup-premade-single-question'
                                                onClick={() => { setPrompt(question) }}
                                            >
                                                <button className='chat-prompt-ask-followup-premade-question-btn'>{question}</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            }

                        </div>
                        <button className='premade-question-scroller-action-btn'
                            onClick={() => {
                                scrollRight();
                            }}
                        >
                            <img src='/images/right-arrow.svg' />
                        </button>
                    </div>
                    <div className='chat-prompt-ask-followup-question-container-input-text-container'>

                        <input className='chat-prompt-ask-followup-question-container-text-input'
                            type='text'
                            value={prompt}
                            placeholder='...'
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    <div className='buttons ask-followup-action-container'>
                        <div className='progressive'
                            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        >
                            <EditTextElementWrapper
                                className={`unclicked ask-followup-button text-center`}
                                path={"chatprompt.followupAskCustomQuestionBtn"}
                                buttonEditor={true}
                            >
                                <button className={`unclicked ask-followup-button`}
                                    style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                                    onClick={() => {
                                        submitHandler();
                                    }}
                                >
                                    {isLoading ?
                                        <div style={{ display: 'flex', justifyContent: "center" }}>
                                            <img style={{ width: "24px" }} src='/images/loading.gif' />
                                        </div>
                                        : uiData?.uiContent?.chatprompt?.followupAskCustomQuestionBtn}
                                </button>
                            </EditTextElementWrapper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const FollowUpReviewActionUi = () => {
    const errorAnalytics = useErrorAnalytics();
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const chatFeedbackHook = useChatFeedback();
    const handleLike = () => {
        if (uiData.devmode) {
            return;
        }
        chatFeedbackHook.send({
            feedback: "liked",
            codingActivity: uiData.codingActivityId,
        },
            () => {
                // success
                dispatchUiData({ type: 'setScreen', payload: 'editor' });
            },
            (error) => {
                errorAnalytics.send({
                    issueCode: 5003,
                    issueType: "Feedback API Error",
                    description: typeof(error) == 'string' ? error : JSON.stringify(error),
                })
            }
        )
    }
    const handleDisLike = () => {
        if (uiData.devmode) {
            return;
        }
        chatFeedbackHook.send({
            feedback: "disliked",
            codingActivity: uiData.codingActivityId,
        },
            () => {
                // success
                dispatchUiData({ type: 'setScreen', payload: 'editor' });
            },
            (error) => {
                errorAnalytics.send({
                    issueCode: 5003,
                    issueType: "Feedback API Error",
                    description: typeof(error) == 'string' ? error : JSON.stringify(error),
                })
            }
        )
    }
    return (

        <div className='chat-prompt-user-review-action-container'>
            <div className='chat-prompt-user-review-action-text-container'>
                <div>
                    <div className='chat-prompt-user-review-action-container-header-text-container'>
                        {/* <EditTextElementWrapper
                            className={`chat-prompt-user-review-action-container-header-text`}
                            path={"chatprompt.followUpReviewTitle"}
                        >
                            <h3
                                className='chat-prompt-user-review-action-container-header-text'
                                dangerouslySetInnerHTML={{ __html: uiData?.uiContent?.chatprompt?.followUpReviewTitle }}
                            >
                            </h3>
                        </EditTextElementWrapper> */}
                        <EditMystMdElementWrapper
                            className={`chat-prompt-user-review-action-container-header-text`}
                            path={"chatprompt.followUpReviewTitle"}
                        >
                            <div
                                className='chat-prompt-user-review-action-container-header-text'
                            >
                                <MystPreviewTwContainer data={uiData?.uiContent?.chatprompt?.followUpReviewTitle || ""} />
                            </div>
                        </EditMystMdElementWrapper>
                    </div>
                    <div className='chat-prompt-user-review-action-container-buttons'>
                        <button
                            onClick={handleDisLike}
                        ><UploadImageWrapper
                            className="feedback-review-like-image"
                            path={"feedbackReviewLikeImage.data"}

                        >
                                <img className='feedback-review-like-image'
                                    src={uiData?.uiContent?.feedbackReviewLikeImage?.data ? uiData?.uiContent?.feedbackReviewLikeImage?.data : "/imoje-charecters/un-like-image.png"}
                                    alt="Avatar" />
                                {/* <img src='/imoje-charecters/un-like-image.png' /> */}
                            </UploadImageWrapper>
                        </button>
                        <button
                            onClick={handleLike}
                        >
                            <UploadImageWrapper
                                className="feedback-review-unlike-image"
                                path={"feedbackReviewUnLikeImage.data"}
                            >
                                <img className='feedback-review-unlike-image'
                                    src={uiData?.uiContent?.feedbackReviewUnLikeImage?.data ? uiData?.uiContent?.feedbackReviewUnLikeImage?.data : "/imoje-charecters/like-image.png"}
                                    alt="Avatar"

                                />
                                {/* <img src='/imoje-charecters/like-image.png' /> */}
                            </UploadImageWrapper>

                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
const ScreenshotImageCard = ({ image }) => {
    return (

        <div className='chat-prompt-user-screenshot-container'>
            <div className='chat-prompt-user-screenshot-image'>
                <img src={image} alt='screenshot' />
            </div>
        </div>
    )
}

const StringArrayInput = ({ defaultValues, onUpdate, blurHandler, label }) => {
    const [newString, setNewString] = React.useState('');
    const [stringList, setStringsList] = React.useState(defaultValues);
    const addNewString = (e) => {
        const cAns = [...stringList, newString.toString()];
        setStringsList(cAns);
        onUpdate(cAns);
        setNewString('');
    };
    const removeOneString = (index) => {
        const incAns = JSON.parse(JSON.stringify(stringList));
        incAns.splice(index, 1);
        setStringsList(incAns);
        onUpdate(incAns);
    };
    React.useEffect(() => {
        setStringsList(defaultValues);
    }, [defaultValues]);
    return (
        <div tabIndex={1} onBlur={blurHandler}>
            <div className="mb-2 relative">
                <label htmlFor="add_new_incorrect_answer" className="field_label">
                    {' '}
                    {label}
                </label>
                <input
                    type="text"
                    id="add_new_incorrect_answer"
                    className="field_input"
                    placeholder={label}
                    value={newString}
                    onInput={(e) => setNewString(e.target.value)}
                />
                <button className="add_button" onClick={() => addNewString()}>
                    Add
                </button>
            </div>
            <div className="field_group">
                <div className="-m-1 flex flex-wrap w-full">
                    {stringList?.map((newString, index) => (
                        <div className="p-1" key={index}>
                            <div className="rounded-md bg-gray-500 text-white flex justify-between mb-2">
                                <div className="px-2 py-1">
                                    {index + 1}. {newString}
                                </div>
                                <button
                                    className="remove_button"
                                    onClick={() => removeOneString(index)}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};