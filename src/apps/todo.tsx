import React from "react";
import "../styles/src/apps/todo.css";
import { APITodoResponse } from "../index";

type onClick = {
  onClick: () => void;
};

type deleteTodo = {
  deleteTodo: (n: number) => void;
};

interface Props {
  todo: APITodoResponse;
}

export const Todo = (props: Props & onClick & deleteTodo): JSX.Element => {
  return (
    <ul>
      <li
        className={
          props.todo.isDone
            ? "todo-card todo-card__done"
            : "todo-card todo-card__doing"
        }
      >
        <input
          name="checkbox"
          type="checkbox"
          defaultChecked={props.todo.isDone}
          onClick={props.onClick}
        ></input>
        <p className={"todo-card__text"}>{props.todo.text}</p>
        <p className={"todo-card__date"}>{props.todo.deadline?.toString()}</p>
        <p>
          <button
            className={"todo-card__button"}
            onClick={() => {
              props.deleteTodo(props.todo.id);
            }}
          >
            X
          </button>
        </p>
      </li>
    </ul>
  );
};
