import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const { serverUrl } = useContext(authDataContext);
  const [userData, setUserData] = useState(null);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []); 

  const value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
