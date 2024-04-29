'use client';
import { UserContextProvider } from './UserProvider';
export const AllContextProviders = ({ children }) => {
  return <UserContextProvider>{children}</UserContextProvider>;
};
