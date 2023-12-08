import { createContext } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch } from "react-redux";
import { setLoggedOut } from "../redux/actions/authActions";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const url = process.env.REACT_APP_API_URL;
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const dispatch = useDispatch();

  const postUserForLogin = async (username, password) => {
    const response = await fetch(
      url + `login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to login");
    }
    const parsedResponse = response.json()
    console.log(parsedResponse)
    return parsedResponse;
  };

  const postNewUser = async (user) => {
    const response = await fetch(url + `register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to register");
    }

    const parsedResponse = response.json()
    console.log(parsedResponse)
    return parsedResponse;
  };

  const postGoogleUser = async (codeResponse) => {
    const response = await fetch(url + `google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ codeResponse }),
    });

    if (!response.ok) {
      throw new Error("Failed to login with Google");
    }
    const parsedResponse = response.json()
    console.log(parsedResponse)
    return parsedResponse;
  };

  const verifyAuthentication = async () => {
    try {
      const response = await fetch(url + `verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.status === 200) {
        const parsedResponse = await response.json()
        dispatch({ type: "SET_LOGGED_IN", payload: true });
        dispatch({ type: "SET_USER_DATA", payload: parsedResponse });
      } else {
        dispatch(setLoggedOut(false));
      }
    } catch (error) {
      console.error("There was an error verifying the token:", error);
    }
  };

  const postLogout = async () => {
    try {
      const response = await fetch(url + `logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return response;
    } catch (error) {
      console.error("There was an error logging out:", error);
      dispatch(setLoggedOut(false));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        postUserForLogin,
        postNewUser,
        postGoogleUser,
        verifyAuthentication,
        postLogout,
      }}
    >
      <GoogleOAuthProvider clientId={clientId}>
        {props.children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};