import ReactDOM from "react-dom/client";
import App from "./App";

import { createStandaloneToast } from "@chakra-ui/toast";
import { ChakraProvider } from "@chakra-ui/react";
import casinoTheme from "./styles/theme";
import { ColorModeScript } from "@chakra-ui/react";

import store from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const { ToastContainer } = createStandaloneToast();
let persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ToastContainer />
    <ChakraProvider theme={casinoTheme}>
      <ColorModeScript initialColorMode={casinoTheme.config.initialColorMode} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ChakraProvider>
  </>
);
