import { createContext, useState } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';

export const AuthContext = createContext();
const url = "http://localhost:8000/";

export const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const postUserForLogin = async (username, password) => {
    const response = await fetch(
      url + `login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    return response.json();
  };

  const postNewUser = async (user) => {
    const response = await fetch(url + `register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to register");
    }

    return response.json();
  };

  const postGoogleUser = async (codeResponse) => {
    const response = await fetch(url + `google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codeResponse }),
    });

    if (!response.ok) {
      throw new Error("Failed to login with Google");
    }

    const data = await response.json();
    if (data && data.token) {
      return data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        postUserForLogin,
        postNewUser,
        postGoogleUser,
      }}
    >
      <GoogleOAuthProvider clientId={clientId}>
        {props.children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};