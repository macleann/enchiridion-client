import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export const Login = () => {
  const [username, setUsername] = useState("mooglyg");
  const [password, setPassword] = useState("password");
  const [focused, setFocused] = useState({ username: false, password: false });
  const { postUserForLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    return postUserForLogin(username, password).then((foundUser) => {
      if (foundUser.valid === true) {
        const user = foundUser;
        localStorage.setItem(
          "enchiridion_user",
          JSON.stringify({
            token: user.token
          })
        );

        navigate("/");
      } else {
        window.alert("Invalid login");
      }
    });
  };

  const handleFocus = (field, isFocused) => {
    setFocused({ ...focused, [field]: isFocused });
  };

  const isFocusedOrFilled = (field, value) => {
    return focused[field] || value
      ? "transform -translate-y-[1.15rem] scale-[0.8] text-primary"
      : ""
  }

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
                type="text"
                className="input-field"
                placeholder="david@byrne.com"
                onChange={(evt) => setUsername(evt.target.value)}
                onFocus={() => handleFocus("username", true)}
                onBlur={(evt) => handleFocus("username", evt.target.value !== "")}
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
            <button type="submit" className={`btn-primary ${
              !username || !password ? "btn-primary-disabled" : ""
            }`}
            disabled={!username || !password}>
              Sign in
            </button>
            <section>
              <Link to="/register">Not a user yet?</Link>
            </section>
          </form>
        </section>
      </main>
    </>
  );
};