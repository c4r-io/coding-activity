import React, { useEffect } from 'react'
import CodeEditorView from './CodeEditorView'
import ChatView from "./ChatView.jsx";
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider.jsx';
import { ChatMessagesContext } from '@/contextapi/code-executor-api/ChatMessagesProvider';
import ActivityTrackerPopup from './ActivityTrackerPopup';

// default preview message for devmode
const devModeMessages = [
  // {
  //   role: 'system',
  //   content: [{ text: 'You are a helpful assistant.' }]
  // },
  {
    role: 'user',
    content: [{ text: 'What is an iterator?' }]
  },
  {
    role: 'assistant',
    content: "An iterator is an object that allows you to iterate over collections of data, such as lists, tuples, dictionaries, and sets. \n\n In our code, this iterator blah blah blah the ding dong to bazoinks the filler text, etc."
  },
  {
    role: 'user',
    content: [{ text: 'What is an iterator?' }]
  },
  {
    role: 'assistant',
    content: "An iterator is an object that allows you to iterate over collections of data, such as lists, tuples, dictionaries, and sets. \n\n In our code, this iterator blah blah blah the ding dong to bazoinks the filler text, etc."
  }
]
const MainView = ({ devmode, codingActivityId, uiDataFromDb }) => {
  const { messages, dispatchMessages } = React.useContext(ChatMessagesContext);
  const { uiData, dispatchUiData } = React.useContext(UiDataContext);
  // onchange of uiData.screen to chat, scroll to bottom of chat in this window screen
  useEffect(() => {
    if (uiDataFromDb) {
      console.log('uiDataFromDb', uiDataFromDb)
      if (uiDataFromDb?.uiContent) {
        setTimeout(() => {
          dispatchUiData({ type: 'setUiContent', payload: uiDataFromDb });
        }, 200)
      }
      if (uiDataFromDb?.activityDefaultCode) {
        // delay added because previous data is dating at same time
        setTimeout(() => {
          dispatchUiData({ type: 'setActivityDefaultCode', payload: uiDataFromDb?.activityDefaultCode });
        }, 400)
      }
    }
    if (codingActivityId) {
      // delay added because previous data is dating at same time
      setTimeout(() => {
        dispatchUiData({ type: 'setActivityId', payload: codingActivityId });
      }, 600)
    }
    // if (devmode) {
    //   dispatchMessages({ type: 'setMessageDevMode', payload: [...devModeMessages] });
    // }
    dispatchUiData({ type: 'setDevmode', payload: devmode });
  }, [devmode, uiDataFromDb, codingActivityId])
  React.useEffect(() => {
    if (uiData.screen === 'chat') {
      // scroll to bottom of this screen
      window.scrollTo(0, document.body.scrollHeight);

    }
  }, [uiData.screen])

 
    return (
      <div>
        <div style={{ display: `block` }} className='relative'>
          <ActivityTrackerPopup />
          <CodeEditorView />
        </div>
      </div>
    )
  
}

export default MainView