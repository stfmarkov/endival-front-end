import React from "react";
import "./header.scss";
import Button from "../button/Button";
import { useHistory } from "react-router-dom";

function Header() {
  const router = useHistory();

  const toProfile = () => router.push("/profile");
  const logout = () => router.push("/");

  return (
    <header className="header">
      {router.location.pathname !== "/" ? (
        <Button text="Към Профил" click={toProfile} class="btn_small" />
      ) : (
        ""
      )}

      {router.location.pathname !== "/" ? (
        <Button text="Отпиши се" click={logout} class="btn_small" />
      ) : (
        ""
      )}
    </header>
  );
}

export default Header;
