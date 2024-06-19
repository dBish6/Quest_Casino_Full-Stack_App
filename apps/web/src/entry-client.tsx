import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Provider as ReduxProvider } from "react-redux";
import store from "@redux/store";

import { routes } from "./App";

function hydrate() {
  const router = createBrowserRouter(routes);

  return hydrateRoot(
    document.getElementById("root")!,
    <ReduxProvider store={store}>
      <RouterProvider router={router} fallbackElement={null} />
    </ReduxProvider>
  );
}

hydrate();
