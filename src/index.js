import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ← 追加
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>   {/* ← ここで包む */}
    <App />
  </BrowserRouter>
);