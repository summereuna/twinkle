import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import firebase from "./firebase";

//잘 가져와 지는지 알아보기 위해 firebase 콘솔에 찍어보기
console.log(firebase);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
