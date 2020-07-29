import * as React from "react";
import { Todo } from "./todo";
import { AddTodo } from "./addTodo";
import "../styles/src/apps/app.css";
import { APITodoResponse, fetchTodos, baseUrl } from "../index";
import axios from "axios";
import { LoginForm } from "../loginForm";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";

interface AppProps {
  todos: APITodoResponse[];
}

export const App = (props: AppProps): JSX.Element => {
  const [todos, setTodo] = React.useState<APITodoResponse[]>(props.todos);
  const loginToken = Cookies.get("todoapptoken") || " ";

  const deleteTodo = async (id: number) => {
    const url = baseUrl + `/todo_lists/delete`;
    await axios
      .delete(url, { data: { id: id, token: loginToken } })
      .catch((e) => {
        console.error(e);
      });
    const changedTodos = await fetchTodos(loginToken);
    if (changedTodos === "NOT_LOGIN") {
      return ReactDOM.render(<LoginForm />, document.getElementById("root"));
    }
    setTodo(changedTodos);
  };

  const switchStatus = async (id: number) => {
    const url = baseUrl + `/todo_lists/update`;
    await axios.patch(url, { id: id, token: loginToken }).catch((e) => {
      console.log(e);
    });
    const changedTodos = await fetchTodos(loginToken);
    if (changedTodos === "NOT_LOGIN") {
      return ReactDOM.render(<LoginForm />, document.getElementById("root"));
    }
    setTodo(changedTodos);
  };

  return (
    <div className="todoapp">
      <p style={{ textAlign: "center" }}>入力してエンターを押す</p>
      <AddTodo todos={todos} setTodo={setTodo} />
      <p
        style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}
      >
        リストをクリックしてDone, もう一度クリックしてDoing
      </p>
      <div>
        {todos.map((todo) => {
          return (
            <Todo
              key={todo.id}
              todo={todo}
              onClick={() => {
                switchStatus(todo.id);
              }}
              deleteTodo={deleteTodo}
            />
          );
        })}
      </div>
    </div>
  );
};
