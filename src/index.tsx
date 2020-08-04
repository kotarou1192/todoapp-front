import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./apps/app";
import axios from "axios";
import { LoginForm } from "./loginForm";
import * as Cookies from "js-cookie";

export interface APITodoResponse {
  id: number;
  userName: string;
  text: string;
  isDone: boolean;
  deadline: number;
  created_at: Date;
  updated_at: Date;
}

export interface TodoProps {
  id?: number;
  userName?: string;
  text: string;
  isDone: boolean;
  deadline?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface Response {
  status: string;
  message: string;
  data: APITodoResponse[];
}

export const baseUrl = "https://takashiii-hq.com";

export const fetchTodos = async (
  loginToken: string
): Promise<APITodoResponse[] | "NOT_LOGIN"> => {
  const data = await axios
    .post(baseUrl + "/todo_lists/get", { token: loginToken })
    .then((response: any) => {
      console.log(response.data.status);
      return response.data;
    })
    .catch((e) => {
      console.error(e);
    });

  if (data.data) {
    return data.data;
  } else if (data.status === "NOT_LOGIN") {
    return data.status;
  }
  return [];
};

const logout = () => {
  const url = baseUrl + "/users/logout";
  axios
    .post(url, { token: Cookies.get("todoapptoken") })
    .then((response) => {
      if (response.data.status === "SUCCESS") {
        console.log(response.data);
        Cookies.remove("todoapptoken");
        ReactDOM.render(<LoginForm />, document.getElementById("root"));
      }
    })
    .catch((e) => {
      console.error(e);
    });
};

export const renderTodosFromAPI = async (): Promise<void> => {
  const loginToken = Cookies.get("todoapptoken") || "hoge";
  const target = document.getElementById("root");
  try {
    const response = await fetchTodos(loginToken);
    if (response === "NOT_LOGIN") {
      ReactDOM.render(<LoginForm />, target);
      return;
    }
    ReactDOM.render(
      <div>
        <div>
          <input type="submit" value="log-out" onClick={logout}></input>
        </div>
        <div>
          <App todos={response} />
        </div>
      </div>,
      target
    );
  } catch (e) {
    ReactDOM.render(<p>an error occured</p>, target);
    console.error(e);
  }
};

renderTodosFromAPI();
