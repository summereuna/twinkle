import AppRouter from "./Router";
import { useState } from "react";

function App() {
  //useState Hook
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Router 렌더하기
  //AppRouter에 prop 전달하기
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; twinkle {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
