import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GameQueue } from "./GameQueue";
import { Header } from "./Header";
import { Login } from "./Login";
import { Register } from "./Register";

export const Main = () => (
  <>
    <BrowserRouter>
      <Header />

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
    </BrowserRouter>
  </>
);
