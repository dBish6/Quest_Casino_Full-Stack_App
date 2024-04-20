import { type Store } from "@reduxjs/toolkit";

import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { Provider } from "react-redux";

import App from "./App";

interface renderProps {
  path: string;
  store: Store;
}

export function render({ path, store }: renderProps) {
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </Provider>
  );
}
