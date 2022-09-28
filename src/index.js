import React from "react";
import ReactDOM from "react-dom";
//절대경로로 바꿈
import App from "components/App";
import "./css/styles.scss";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
