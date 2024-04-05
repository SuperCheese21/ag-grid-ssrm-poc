import { LicenseManager } from "ag-grid-enterprise";
import { setupWorker } from "msw/browser";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AG_GRID_LICENSE } from "./constants.ts";
import { dataHandler } from "./mocks/dataHandler.ts";
import "./index.css";

LicenseManager.setLicenseKey(AG_GRID_LICENSE);

export const worker = setupWorker(...dataHandler);

worker
  .start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
