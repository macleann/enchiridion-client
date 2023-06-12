import { createContext, useState } from "react";

export const AuthContext = createContext();
const url = "http://localhost:8000/";

export const AuthProvider = (props) => {
  const [users, setUsers] = useState([]);

  const postUserForLogin = (username, password) => {
    return fetch(
      url + `login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
      }
    ).then((response) => response.json());
  };

  const postNewUser = (user) => {
    return fetch(url + `register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((response) => response.json());
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        setUsers,
        postUserForLogin,
        postNewUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};