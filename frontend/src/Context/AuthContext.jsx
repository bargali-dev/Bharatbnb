import React, { createContext, useState } from "react";

export const authDataContext = createContext();

const AuthContext = ({ children }) => {
  let [loading,setLoading] = useState(false)

  const serverUrl = "https://bharat-backend-44yj.onrender.com";

  const value = {
    serverUrl,
    loading,
    setLoading
  };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
};

export default AuthContext;
