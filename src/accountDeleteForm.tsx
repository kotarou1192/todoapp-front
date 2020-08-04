import * as React from "react";
import { baseUrl } from ".";
import axios from "axios";
import Cookies from "js-cookie";
import ReactDOM from "react-dom";
import { LoginForm } from "./loginForm";
import "./styles/src/accountDeleteForm.css";

export const AccountDeleteForm = (): JSX.Element => {
  const [isDisplay, setIsDisplay] = React.useState<boolean>(false);

  return (
    <div>
      <input
        className="header__delete-your-account-button"
        type="submit"
        value="delete-your-account?"
        onClick={() => setIsDisplay(!isDisplay)}
      ></input>
      <DeleteForm isDisplay={isDisplay} />
    </div>
  );
};

const DeleteForm = (props: { isDisplay: boolean }) => {
  const [confirmEmail, setConfirmEmail] = React.useState<string>("");

  const deleteAccount = () => {
    const url = baseUrl + "/users/delete";
    axios
      .post(url, { token: Cookies.get("todoapptoken"), email: confirmEmail })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          Cookies.remove("todoapptoken");
          window.alert("アカウントを削除しました");
          return ReactDOM.render(
            <LoginForm />,
            document.getElementById("root")
          );
        }
        window.alert(
          "削除できませんでした、メールアドレスが正しくない可能性があります。正しい場合、再ログインしてもう一度お試しください"
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (props.isDisplay) {
    return (
      <div>
        <input
          className="header__delete-account-email-form"
          type="text"
          placeholder="メールアドレスを確認"
          value={confirmEmail}
          onChange={(str) => {
            setConfirmEmail(str.target.value);
          }}
        ></input>
        <input
          className="header__delete-account-submit-button"
          type="submit"
          value="削除"
          onClick={deleteAccount}
        ></input>
      </div>
    );
  }
  return <div></div>;
};
