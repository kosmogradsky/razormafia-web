import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import * as React from "react";

export const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      signInWithEmailAndPassword(getAuth(), email, password);
    },
    [email, password]
  );

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>Вход в систему</div>
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
        <button type="submit">Войти в систему</button>
      </form>
    </>
  );
};
