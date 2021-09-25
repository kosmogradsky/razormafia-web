import * as React from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export const Register = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (password === passwordConfirmation) {
        createUserWithEmailAndPassword(getAuth(), email, password);
      } else {
        throw new Error("Passwords don't match!");
      }
    },
    [password, passwordConfirmation, email]
  );

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>Регистрация</div>
      <form action="" onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: ".5rem" }}>
          <span>Электронная почта: </span>
          <input
            type="text"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </label>
        <label style={{ display: "block", marginBottom: ".5rem" }}>
          <span>Пароль: </span>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </label>
        <label style={{ display: "block", marginBottom: ".5rem" }}>
          <span>Повторение пароля: </span>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(event) => {
              setPasswordConfirmation(event.target.value);
            }}
          />
        </label>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </>
  );
};
