import React, { createContext, useReducer } from "react";
import { userReducer } from "../reducers/userReducer";
import axios from "axios";
axios.defaults.baseURL = "https://endival-api.herokuapp.com";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [data, dispatch] = useReducer(userReducer, {
    email: "",
    password: "",
    token: "",
    characters: [],
  });

  const login = (payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/user/login", payload)
        .then((res) => {
          let token = "Bearer ";
          token += res.data.token;
          dispatch({
            type: "UPDATE",
            payload: {
              email: payload.email,
              password: payload.password,
              token,
              id: res.data.id,
              characters: [],
            },
          });
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const signUp = (payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/user/signup", payload)
        .then((res) => {
          resolve();
        })
        .catch((err) => {
          reject();
        });
    });
  };

  const getChars = () => {
    return new Promise((resolve, reject) => {
      if (!data.token) return;
      let config = {
        method: "get",
        url: "/characters",
        headers: {
          Authorization: data.token,
        },
      };

      axios(config)
        .then((res) => {
          dispatch({
            type: "UPDATE",
            payload: { characters: res.data.characters },
          });
        })
        .catch((err) => {
          // if (err.response.status) reject();
          reject();
        });
    });
  };

  return (
    <UserContext.Provider value={{ data, dispatch, login, signUp, getChars }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
