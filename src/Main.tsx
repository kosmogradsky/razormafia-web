import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";

export const Main = () => (
  <>
    <BrowserRouter>
      <div></div>

      <Switch>
        <Route exact path="/">
          <div></div>
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
    </BrowserRouter>
  </>
);
