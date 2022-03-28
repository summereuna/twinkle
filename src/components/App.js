//절대 경로(absolute import)
import AppRouter from "components/Router";
import { useEffect, useState } from "react";
//절대 경로(absolute import)
//fbase에서 authService 가져오기(export로 내보냈기 때문에 {} 중괄호 쳐서 가져와야 함)
import { authService } from "fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  //🔥 firebase가 프로그램을 초기화하길 기다리고 나서 isLoggedIn이 바뀌게 해야 한다.
  const [init, setInit] = useState(false);
  //인증서비스의 현재 유저가 참인지 거짓인지에 따라 (로그인했는지 안했는지에 따라)state 달라짐
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //🔥 어떻게 기다릴 수 있을까? useEffect()를 사용하면 된다 ㅇㅇ!
  useEffect(() => {
    const auth = getAuth();
    //🔥🔥 유저 변화가 있는지 listen하기: onAuthStateChanged관찰자 사용
    //🔥 onAuthStateChanged은 콜백이 필요한데, 콜백은 user이다.
    onAuthStateChanged(auth, (user) => {
      //console.log(user);
      //🔥 user가 있다면 로그인 참으로 바꿔주고, 아니라면 로그인 거짓으로
      if (user) {
        setIsLoggedIn(true);
        const uid = user.uid;
      } else {
        setIsLoggedIn(false);
      }
      //🔥 그러고 나서 초기화 시켜라
      setInit(true);
    });
  }, []);
  //Router 렌더하기 & AppRouter에 prop 전달하기
  return (
    <>
      {/*🔥 init이 거짓이면 라우터 숨기고 초기화 중이라고 띄우기*/}
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "초기화중..."}
      <footer>&copy; twinkle {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
