import { createContext } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch } from "react-redux";
import { setLoggedOut } from "../redux/actions/authActions";
import { showSnackbar } from "../redux/actions/snackbarActions";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const url = process.env.REACT_APP_API_URL;
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const dispatch = useDispatch();

  const postUserForLogin = async (username, password) => {
    try {
      const response = await fetch(
        `${url}/login`,
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

      const parsedResponse = response.json()
      return parsedResponse;
    } catch (error) {
      dispatch(showSnackbar("An error occurred while logging in", "error"));
      console.error("There was an error logging in:", error);
    }
  };

  const postNewUser = async (user) => {
    try {
      const response = await fetch(`${url}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      const parsedResponse = response.json()
      return parsedResponse;
    } catch (error) {
      dispatch(showSnackbar("An error occurred while registering", "error"));
      console.error("An error occurred while registering:", error);
    }
  };

  const postGoogleUser = async (codeResponse) => {
    const response = await fetch(`${url}/google/login`, {
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
    return parsedResponse;
  };

  const verifyAuthentication = async () => {
    try {
      const response = await fetch(`${url}/verify`, {
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
        dispatch(setLoggedOut());
      }
    } catch (error) {
      console.error("There was an error verifying the token:", error);
    }
  };

  const postLogout = async () => {
    try {
      const response = await fetch(`${url}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return response;
    } catch (error) {
      console.error("There was an error logging out:", error);
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