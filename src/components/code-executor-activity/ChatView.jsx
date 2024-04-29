import React from 'react'
import ChatPromptTopCardUi from './cards/ChatPromptTopCardUi'
import ChatPromptMessagesUi from './cards/ChatPromptMessagesUi'

const ChatView = () => {
  return (
    <div>
        <ChatPromptTopCardUi/>
        <ChatPromptMessagesUi/>
    </div>
  )
}

export default ChatView