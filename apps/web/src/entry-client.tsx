import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Provider as ReduxProvider } from "react-redux";
import store from "@redux/store";

import { routes } from "./App";
import { ResourceLoader } from "@components/loaders";

function hydrate() {
  const router = createBrowserRouter(routes);

  return hydrateRoot(
    document.getElementById("root")!,
    <ReduxProvider store={store}>
      <ResourceLoader>
        <RouterProvider router={router} fallbackElement={null} />
      </ResourceLoader>
    </ReduxProvider>
  );
}

hydrate();
