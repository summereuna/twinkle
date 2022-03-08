//절대 경로(absolute import)
import AppRouter from "components/Router";
import { useState } from "react";
//절대 경로(absolute import)
import fbase from "fbase";

function App() {
  //useState Hook
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Router 렌더하기
  //AppRouter에 prop 전달하기
  console.log(fbase);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; twinkle {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
