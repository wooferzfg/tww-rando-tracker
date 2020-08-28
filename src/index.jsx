import React from "react";
import ReactDOM from "react-dom";

import App from "./ui/app";

if (process.env.NODE_ENV === "production") {
  const { serviceWorker } = navigator;

  if (serviceWorker) {
    serviceWorker.register("service-worker.js");
  }
}

ReactDOM.render(<App />, document.getElementById("base"));
