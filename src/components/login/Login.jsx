import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import "./Login.scss";

import Button from "../button/Button.jsx";
import Input from "../input/Input.jsx";
import Loader from "../loader/Loader";

function ChoseClass() {
  const router = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    user.login({ email, password }).then((res) => {
      router.push("/profile");
      // setLoading(false);
    });
    //   .catch((err) => setLoading(false));
    setEmail("");
    setPassword("");
  };

  const signUp = () => {
    setLoading(true);

    user
      .signUp({ email, password })
      .then(() => login())
      .catch((err) => console.log(err));
  };

  const clearUserData = () => {
    localStorage.setItem(
      "logedUser",
      JSON.stringify({ email: "", password: "", token: "", id: "" })
    );
  };

  const user = useContext(UserContext);

  useEffect(() => {
    clearUserData();
  }, []);

  return (
    <section className="login card">
      <Input type="text" placeholder="Email" value={email} change={setEmail} />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        change={setPassword}
      />

      <div className="login__controls">
        <Button class="btn_left" text="Log in" click={login} />
        <Button class="btn_right" text="Sign up" click={signUp} />
      </div>

      <Loader isShown={loading} />
    </section>
  );
}

export default ChoseClass;
