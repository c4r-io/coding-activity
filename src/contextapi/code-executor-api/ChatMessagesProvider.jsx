import { createContext, useReducer } from "react";
export const ChatMessagesContext = createContext();

export const ChatMessagesProvider = ({ children }) => {

  function reducer(state, action) {
    switch (action.type) {
      case "setMessage": {
        const previousMessages = state.messageList;
        return {
          ...state,
          messageList: [...previousMessages, ...action.payload],
        };
      }
      case "setMessageDevMode": {
        return {
          ...state,
          messageList: [ ...action.payload],
        };
      }
      case "clearMessage": {
        return {
          ...state,
          messageList: [],
        };
      }
      case "setImage": {
        return {
          ...state,
          image: action.payload,
        };
      }
      case "setTakeScreenshot": {
        return {
          ...state,
          takeScreenshot: action.payload,
        };
      }
      case "setCode": {
        return {
          ...state,
          code: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  }
  const [messages, dispatchMessages] = useReducer(reducer, {
    messageList: [],
    image: null,
    takeScreenshot: false,
    screen: 'editor',
    code: ''
  });
  return (
    <ChatMessagesContext.Provider value={{ messages, dispatchMessages }}>
      {children}
    </ChatMessagesContext.Provider>
  );
};
