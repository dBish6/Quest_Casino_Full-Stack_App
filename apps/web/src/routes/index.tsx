import { Routes, Route } from "react-router-dom";

import paths from "./paths";

import { About } from "@views/about";
import { Error404, Error500 } from "@views/errors";
import { Dashboard } from "@components/partials/dashboard";

const routes = new Map<string, { view: () => JSX.Element }>([
  ...Array.from(paths).map((path) => {
    switch (path) {
      case "/":
      case "/about":
        return [path, { view: About }];
      case "/dashboard":
        return [path, { view: About }];
      case "/error-404":
        return [path, { view: Error404 }];
      case "/error-500":
        return [path, { view: Error500 }];
      default:
        return [] as any;
    }
  }),
]);

export default function RoutesProvider() {
  return (
    <Routes>
      {[...routes].map(([path, options]) => (
        <Route
          key={path}
          path={path}
          element={
            <Dashboard routes={routes}>
              <options.view />
            </Dashboard>
          }
        />
      ))}
    </Routes>
  );
}
