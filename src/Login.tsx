import * as React from "react";

export const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    },
    []
  );

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>Вход в систему</div>
      <form action="" onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: ".5rem" }}>
          <span>Имя пользователя: </span>
          <input
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
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
