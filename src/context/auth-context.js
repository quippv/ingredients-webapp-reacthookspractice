import React, { useState } from "react";

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {},
});

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authHandler = () => {
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{ isAuth: isAuthenticated, login: authHandler }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
