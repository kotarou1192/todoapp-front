import * as React from "react";
import "../styles/src/apps/addTodo.css";
import axios from "axios";
import { APITodoResponse, fetchTodos, baseUrl } from "../index";
import { TodoProps } from "../index";
import ReactDOM from "react-dom";
import { LoginForm } from "../loginForm";
import Cookies from "js-cookie";

interface AddTodoProps {
  todos: TodoProps[];
  setTodo: (value: APITodoResponse[]) => void;
}

const postNewTodo = async (newTodo: TodoProps) => {
  const loginToken = Cookies.get("todoapptoken");
  const body = {
    todo: newTodo,
    token: loginToken,
  };
  const targetUrl = baseUrl + "/todo_lists/create";

  await axios
    .post(targetUrl, body)
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.error(e);
    });
};

export const AddTodo = (props: AddTodoProps): JSX.Element => {
  const [text, setText] = React.useState("");
  const loginToken = Cookies.get("todoapptoken") || " ";
  const handleText = (key: React.KeyboardEvent) => {
    if (key.key !== "Enter" || key.shiftKey === true) return;
    if (text.length < 1 && text.length > 200) return;
    if (text.replace(/[\n|\s]/g, "").length < 1) return;
    const newTodo = {
      id: undefined,
      userName: undefined,
      text: text,
      isDone: false,
      deadline: new Date().getTime() / 1000,
      created_at: undefined,
      updated_at: undefined,
    };

    setText("");
    postNewTodo(newTodo).then(() => {
      fetchTodos(loginToken).then((response) => {
        if (response === "NOT_LOGIN") {
          return ReactDOM.render(
            <LoginForm />,
            document.getElementById("root")
          );
        }
        window.alert("作成しました。");
        props.setTodo(response);
      });
    });
  };
  return (
    <div className="inputarea">
      <input
        id="text"
        value={text}
        className="input"
        onChange={(str) => {
          setText(str.target.value);
        }}
        onKeyPress={(key) => {
          handleText(key);
        }}
      ></input>
    </div>
  );
};
