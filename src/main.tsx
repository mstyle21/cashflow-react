import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("mainContainer")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
