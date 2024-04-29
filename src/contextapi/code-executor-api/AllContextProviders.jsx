"use client";
import { UiDataProvider } from "./UiDataProvider";
import { UserContextProvider } from "./UserProvider";
import { ChatMessagesProvider } from "./ChatMessagesProvider";

export const AllContextProviders = ({ children }) => {
  return (
    <UserContextProvider>
      <ChatMessagesProvider>
        <UiDataProvider>{children}</UiDataProvider>
      </ChatMessagesProvider>
    </UserContextProvider>
  );
};
