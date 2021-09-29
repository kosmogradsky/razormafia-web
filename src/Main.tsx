import * as React from "react";
import { HashRouter, Link, Route, Switch } from "react-router-dom";
import { GameQueue } from "./GameQueue";
import { Header } from "./Header";
import { Login } from "./Login";
import { Register } from "./Register";

export const Main = () => (
  <>
    <HashRouter>
      <Header />
      <Link to="/" style={{ display: "block" }}>
        /
      </Link>
      <Link to="/login" style={{ display: "block" }}>
        /login
      </Link>
      <Link to="/register" style={{ display: "block" }}>
        /register
      </Link>
      <Link to="/videoroom" style={{ display: "block" }}>
        /videoroom
      </Link>

      <div style={{ paddingTop: "1rem" }}>
        <Switch>
          <Route exact path="/">
            <GameQueue />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/videoroom">
            <div>Videoroom</div>
          </Route>
        </Switch>
      </div>
    </HashRouter>
  </>
);
