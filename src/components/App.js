//절대 경로(absolute import)
import AppRouter from "components/Router";
import { useState } from "react";
//절대 경로(absolute import)
//fbase에서 authService 가져오기(export로 내보냈기 때문에 {} 중괄호 쳐서 가져와야 함)
import { authService } from "fbase";

function App() {
  //인증서비스의 현재 유저가 참인지 거짓인지에 따라 (로그인했는지 안했는지에 따라)state 달라짐
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
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
