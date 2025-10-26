import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => setUser(null);
  const [refreshMyCourses, setRefreshMyCourses] = useState(false);

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        refreshMyCourses,
        setRefreshMyCourses,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
