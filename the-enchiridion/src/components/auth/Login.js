import React, { useContext, useState, useEffect } from "react";
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

  const handleLogin = (e) => {
    e.preventDefault();

    try {
      postUserForLogin(username, password).then((response) => {
        if (response && response.id) {
          console.log(response)
          dispatch(setLoggedIn(true));
          dispatch(setUserData(response.id));
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      postGoogleUser(code)
        .then((response) => {
          if (response && response.id) {
            console.log(response)
            dispatch(setLoggedIn(true));
            dispatch(setUserData(response.id));
            dispatch(showSnackbar("Logged in successfully", "success"));
            navigate("/");
          } else {
            dispatch(showSnackbar("Invalid login credentials", "error"));
          }
        })
        .catch((err) => {
          dispatch(showSnackbar("An error occurred while logging in", "error"));
          console.log(err);
        });
    }
  }, []);
  

  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: 'http://localhost:3000/login',
  });

  return (
    <>
      <main>
        <section className="flex h-screen justify-center items-center">
          <form
            className="mx-auto my-8 border-2 border-none rounded-lg shadow-md p-4 backdrop-blur-sm"
            onSubmit={handleLogin}
          >
            <h2 className="relative mb-3">Please sign in</h2>
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
            <div className="flex justify-around items-center">
              <button
                type="button"
                className={
                  !username || !password
                    ? "button-primary-disabled mr-2"
                    : "button-primary mr-2"
                }
                disabled={!username || !password}
                onClick={handleLogin}
              >
                Login
              </button>
              <button type="button" onClick={loginWithGoogle}>Login with Google</button>
              <section className="ml-2">
                <Link className="button-primary" to="/register">
                  Not a user yet?
                </Link>
              </section>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};
