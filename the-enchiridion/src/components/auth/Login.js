import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { setLoggedIn, setUserData } from "../../redux/actions/authActions";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState({ username: false, password: false });
  const { postUserForLogin, postGoogleUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const url = process.env.REACT_APP_URL;

  const handleLogin = (e) => {
    e.preventDefault();

    try {
      postUserForLogin(username, password).then((response) => {
        if (response && response.id) {
          dispatch(setLoggedIn(true));
          dispatch(setUserData({ id: response.id }));
          dispatch(showSnackbar("Logged in successfully", "success"));
          navigate("/");
        } else {
          dispatch(showSnackbar("Invalid login credentials", "error"));
        }
      });
    } catch (error) {
      dispatch(showSnackbar("An error occurred while logging in", "error"));
    }
  };

  const handleFocus = (field, isFocused) => {
    setFocused({ ...focused, [field]: isFocused });
  };

  const isFocusedOrFilled = (field, value) => {
    return focused[field] || value
      ? "transform -translate-y-[1.15rem] scale-[0.8] text-primary"
      : "";
  };

  const handleGoogleAuth = useCallback(
    async (code) => {
      try {
        const response = await postGoogleUser(code);
        if (response && response.id) {
          dispatch(setLoggedIn(true));
          dispatch(setUserData({ id: response.id }));
          dispatch(showSnackbar("Logged in successfully", "success"));
          navigate("/");
        } else {
          dispatch(showSnackbar("Invalid login credentials", "error"));
        }
      } catch (err) {
        dispatch(showSnackbar("An error occurred while logging in", "error"));
      }
    },
    [dispatch, navigate, postGoogleUser]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleGoogleAuth(code);
    }
  }, [handleGoogleAuth]);

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: `${url}/login`,
  });

  return (
    <>
      <main>
        <section className="flex h-screen justify-center items-center">
          <form
            className="flex flex-col mx-auto my-8 border-2 border-none rounded-lg shadow-md p-4 backdrop-blur-sm"
            onSubmit={handleLogin}
          >
            <h3 className="relative mb-3 text-sm">Please sign in to</h3>
            <h1 className="relative mb-6 text-4xl font-bold">The Enchiridion</h1>
            <div className="relative mb-6 group">
              <input
                name="username"
                type="text"
                className="input-field"
                placeholder="fmertens"
                onChange={(evt) => setUsername(evt.target.value)}
                onFocus={() => handleFocus("username", true)}
                onBlur={(evt) =>
                  handleFocus("username", evt.target.value !== "")
                }
              />
              <label
                className={`input-label ${isFocusedOrFilled(
                  "username",
                  username
                )} motion-reduce:transition-none`}
              >
                Username
              </label>
            </div>
            <div className="relative mb-6">
              <input
                name="password"
                type="password"
                className="input-field"
                onChange={(evt) => setPassword(evt.target.value)}
                onFocus={() => handleFocus("password", true)}
                onBlur={(evt) =>
                  handleFocus("password", evt.target.value !== "")
                }
              />
              <label
                className={`input-label ${isFocusedOrFilled(
                  "password",
                  password
                )} motion-reduce:transition-none`}
              >
                Password
              </label>
            </div>
            <button
              type="submit"
              className={
                !username || !password
                  ? "button-primary-disabled my-2"
                  : "button-primary my-2"
              }
              disabled={!username || !password}
              onClick={handleLogin}
            >
              Login
            </button>
            <div className="my-2 text-sm text-center" to="/register">
              Not a user yet? &thinsp;
              <Link
                className="text-primary font-semibold"
                to="/register"
              >
              Sign up
              </Link>
            </div>
            <div className="divider my-2" />
            <button
              type="button"
              className="flex justify-center items-center py-2 px-4 backdrop-blur-md bg-white/30 font-semibold rounded-md border"
              onClick={loginWithGoogle}
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"></path><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"></path><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"></path><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z"></path></svg>
              <p className="ml-2">Sign in with Google</p>
            </button>
          </form>
        </section>
      </main>
    </>
  );
};
