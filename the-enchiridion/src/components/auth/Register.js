import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { setLoggedIn, setUserData } from "../../redux/actions/authActions";
import { useGoogleLogin } from "@react-oauth/google";

export const Register = () => {
  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [focused, setFocused] = useState({
    username: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const { postNewUser, postGoogleUser } = useContext(AuthContext);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const url = process.env.REACT_APP_URL;

  const registerNewUser = () => {
    return postNewUser(user).then((createdUser) => {
      if (createdUser && createdUser.id) {
        dispatch(setLoggedIn(true));
        dispatch(setUserData({ id: createdUser.id }));
        dispatch(showSnackbar("Registered successfully", "success"));
        navigate("/");
      } else if (createdUser.hasOwnProperty("error")) {
        window.alert(createdUser.error);
      }
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    return registerNewUser();
  };

  const updateNewUser = (evt) => {
    const copy = { ...user };
    copy[evt.target.id] = evt.target.value;
    setUser(copy);
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
    redirect_uri: `${url}/register`,
  });

  return (
    <main>
      <section className="flex h-screen justify-center items-center">
        <form
          className="flex flex-col mx-auto my-8 border-2 border-none rounded-lg shadow-md p-4 backdrop-blur-sm"
          onSubmit={handleRegister}
        >
          <h1 className="relative mb-6 text-3xl font-bold">
            Create your free account
          </h1>
          
          <button
            type="button"
            className="flex justify-center items-center py-2 px-4 backdrop-blur-md bg-white/30 font-semibold rounded-md border"
            onClick={loginWithGoogle}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"></path><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"></path><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"></path><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z"></path></svg>
            <p className="ml-2">Sign up with Google</p>
          </button>

          <div className="divider my-6" />

          <div className="relative mb-6 group">
            <input
              type="text"
              id="firstName"
              className="input-field"
              placeholder="Finn"
              onChange={updateNewUser}
              onFocus={() => handleFocus("firstName", true)}
              onBlur={(evt) =>
                handleFocus("firstName", evt.target.value !== "")
              }
              required
              autoFocus
            />
            <label
              className={`input-label ${isFocusedOrFilled(
                "firstName",
                user.firstName
              )} motion-reduce:transition-none`}
            >
              First Name
            </label>
          </div>

          <div className="relative mb-6 group">
            <input
              type="text"
              id="lastName"
              className="input-field"
              placeholder="Mertens"
              onChange={updateNewUser}
              onFocus={() => handleFocus("lastName", true)}
              onBlur={(evt) => handleFocus("lastName", evt.target.value !== "")}
              required
            />
            <label
              className={`input-label ${isFocusedOrFilled(
                "lastName",
                user.lastName
              )} motion-reduce:transition-none`}
            >
              Last Name
            </label>
          </div>

          <div className="relative mb-6 group">
            <input
              type="username"
              id="username"
              className="input-field"
              placeholder="fmertens"
              onChange={updateNewUser}
              onFocus={() => handleFocus("username", true)}
              onBlur={(evt) => handleFocus("username", evt.target.value !== "")}
              required
            />
            <label
              className={`input-label ${isFocusedOrFilled(
                "username",
                user.username
              )} motion-reduce:transition-none`}
            >
              Username
            </label>
          </div>

          <div className="relative mb-6 group">
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="finn@enchiridion.tv"
              onChange={updateNewUser}
              onFocus={() => handleFocus("email", true)}
              onBlur={(evt) => handleFocus("email", evt.target.value !== "")}
              required
            />
            <label
              className={`input-label ${isFocusedOrFilled(
                "email",
                user.email
              )} motion-reduce:transition-none`}
            >
              Email address
            </label>
          </div>

          <div className="relative mb-6 group">
            <input
              type="password"
              id="password"
              className="input-field"
              onChange={updateNewUser}
              onFocus={() => handleFocus("password", true)}
              onBlur={(evt) => handleFocus("password", evt.target.value !== "")}
              required
            />
            <label
              className={`input-label ${isFocusedOrFilled(
                "password",
                user.password
              )} motion-reduce:transition-none`}
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className={`${
              !user.username ||
              !user.email ||
              !user.firstName ||
              !user.lastName ||
              !user.password
                ? "button-primary-disabled"
                : "button-primary"
            }`}
            disabled={
              !user.username ||
              !user.email ||
              !user.firstName ||
              !user.lastName ||
              !user.password
            }
          >
            Register
          </button>
          <div className="my-2 text-sm text-center" to="/login">
              Already a user? &thinsp;
              <Link
                className="text-primary font-semibold"
                to="/login"
              >
              Login
              </Link>
          </div>
        </form>
      </section>
    </main>
  );
};
