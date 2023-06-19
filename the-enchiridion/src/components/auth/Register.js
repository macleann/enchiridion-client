import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

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
  const { postNewUser } = useContext(AuthContext);
  let navigate = useNavigate();

  const registerNewUser = () => {
    return postNewUser(user).then((createdUser) => {
      if (createdUser.hasOwnProperty("token")) {
        localStorage.setItem(
          "enchiridion_user",
          JSON.stringify({
            token: createdUser.token,
            id: createdUser.id,
          })
        );

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

  return (
    <main style={{ textAlign: "center" }}>
      <form
        className="w-1/2 mx-auto my-8 border-2 border-none rounded-lg shadow-md p-4 backdrop-blur-sm"
        onSubmit={handleRegister}
      >
        <h2 className="relative mb-3 text-xl">
          Register for The Enchiridion
        </h2>

        <div className="relative mb-6 group">
          <input
            type="text"
            id="firstName"
            className="input-field"
            placeholder="Finn"
            onChange={updateNewUser}
            onFocus={() => handleFocus("firstName", true)}
            onBlur={(evt) => handleFocus("firstName", evt.target.value !== "")}
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
            autoFocus
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
            placeholder="finn@enchiridion.co"
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
            !user.username || !user.email || !user.firstName || !user.lastName || !user.password ? "button-primary-disabled" : "button-primary"
          }`}
          disabled={!user.username || !user.email || !user.firstName || !user.lastName || !user.password}
        >
          Register
        </button>
      </form>
    </main>
  );
};