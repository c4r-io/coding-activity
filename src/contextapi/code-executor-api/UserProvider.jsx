import { createContext, useReducer } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  function reducer(state, action) {
    switch (action.type) {
      case "login": {
        return {
          ...state,
          userInfo: action.userInfo,
        };
      }
      case "checkLogin": {
        const authuser = localStorage.getItem("auth-user");
        // console.log("Checking", JSON.parse(authuser), state);
        if (authuser) {
          return {
            ...state,
            userInfo: JSON.parse(authuser),
          };
        } else {
        }
      }
      case "logout": {
        localStorage.removeItem("auth-user");
        return {
          ...state,
          userInfo: null,
        };
      }
      default: {
        return state;
      }
    }
  }
  const [userData, dispatchUserData] = useReducer(reducer, {
    userInfo: null,
  });
  return (
    <UserContext.Provider value={{ userData, dispatchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
