import ReactDOM from "react-dom/client";
import App from "./App";

import { createStandaloneToast } from "@chakra-ui/toast";
import { ChakraProvider } from "@chakra-ui/react";
import casinoTheme from "./styles/theme";
import { ColorModeScript } from "@chakra-ui/react";

import store from "./redux/store";
import { Provider } from "react-redux";

const { ToastContainer } = createStandaloneToast();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ToastContainer />
    <ChakraProvider theme={casinoTheme}>
      <ColorModeScript initialColorMode={casinoTheme.config.initialColorMode} />
      <Provider store={store}>
        <App />
      </Provider>
    </ChakraProvider>
  </>
);
