import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ThirdwebProvider } from "thirdweb/react";
import { supportedChains, defaultChain } from "./config/chains";
import { client } from "./client";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThirdwebProvider
      client={client}
      supportedChains={supportedChains}
      activeChain={defaultChain}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
