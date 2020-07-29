import { useState } from "react";
import React from "react";
import axios from "axios";
import { baseUrl, renderTodosFromAPI } from "./index";
import Cookies from "js-cookie";
import ReactDOM from "react-dom";
import { LoginForm } from "./loginForm";

const smashAPI = async (
  email: string,
  password: string,
  confirmPassword: string,
  name: string
) => {
  if (name.length < 1 && name.length > 200)
    return window.alert("1invalid name");
  if (name.replace(/[\n|\s]/g, "").length < 1)
    return window.alert("invalid name");

  if (
    !email.match(
      // eslint-disable-next-line no-useless-escape
      /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    )
  )
    return window.alert("invalid email address");

  if (password !== confirmPassword)
    return window.alert("confirmation password does not match");

  const url = baseUrl + "/users/create";
  axios
    .post(url, {
      email: email,
      password: password,
      name: name,
    })
    .then((response) => {
      if (response.data.status === "SUCCESS") {
        Cookies.set("todoapptoken", response.data.token);
        return renderTodosFromAPI();
      }
      window.alert("input value is invalid");
    })
    .catch((e) => {
      console.error(e);
    });
};

const switchLoginForm = () => {
  ReactDOM.render(
    <div>
      <LoginForm />
    </div>,
    document.getElementById("root")
  );
};

export const CreateAccountForm = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  return (
    <div>
      <p>create account</p>
      <p>
        <input
          type="text"
          placeholder="your_name"
          value={name}
          onChange={(str) => {
            setName(str.target.value);
          }}
        ></input>
      </p>
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
        <br></br>
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(str) => {
            setConfirmPassword(str.target.value);
          }}
        ></input>
      </p>
      <p></p>
      <p>
        <input
          type="submit"
          value="create-account"
          onClick={() => smashAPI(email, password, confirmPassword, name)}
        ></input>
      </p>
      <p>
        <input
          type="submit"
          value="back to login"
          onClick={switchLoginForm}
        ></input>
      </p>
    </div>
  );
};
