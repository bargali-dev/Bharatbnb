import React, { createContext, useState } from "react";

export const authDataContext = createContext();

const AuthContext = ({ children }) => {
  let [loading,setLoading] = useState(false)

  const serverUrl = "http://localhost:8000";

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
