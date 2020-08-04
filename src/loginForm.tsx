import React, { useState } from "react";
import axios from "axios";
import { baseUrl, renderTodosFromAPI } from "./index";
import { App } from "./apps/app";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import { CreateAccountForm } from "./createAccountForm";

const changeForm = () => {
  ReactDOM.render(
    <div>
      <CreateAccountForm />
    </div>,
    document.getElementById("root")
  );
};

export const LoginForm = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const tryLogin = () => {
    const token = Cookies.get("todoapptoken");
    if (!token) return;
    const url = baseUrl + "/todo_lists/get";
    axios.post(url, { token: token }).then((response) => {
      if (response.data.message === "SUCCESS") {
        ReactDOM.render(
          <App todos={response.data.data} />,
          document.getElementById("root")
        );
      }
      console.log("old token");
      return;
    });
  };

  const loginTodoApp = () => {
    const url = baseUrl + "/users/login";
    axios
      .post(url, { email: email, password: password })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          Cookies.set("todoapptoken", res.data.token);
          return renderTodosFromAPI();
        }
        window.alert("入力内容が間違っています");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  tryLogin();

  return (
    <div>
      <p>log-in</p>
      <p>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(str) => {
            setEmail(str.target.value);
          }}
        ></input>
      </p>
      <p>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(str) => {
            setPassword(str.target.value);
          }}
        ></input>
      </p>
      <p>
        <input type="submit" onClick={loginTodoApp} value="log-in"></input>
      </p>
      <p>
        <input
          type="submit"
          value="create-account"
          onClick={changeForm}
        ></input>
      </p>
      <a href="https://takashiii-hq.com/password_resets/new">
        パスワードを忘れましたか？
      </a>
    </div>
  );
};
