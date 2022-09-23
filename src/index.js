import React from "react";
import ReactDOM from "react-dom";
//절대경로로 바꿈
import App from "components/App";
import "./css/styles.scss";

//잘 가져와 지는지 알아보기 위해 firebase 콘솔에 찍어보기
//console.log(authService);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
