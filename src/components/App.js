//절대 경로(absolute import)
import AppRouter from "components/Router";
import { useEffect, useState } from "react";
//절대 경로(absolute import)
//fbase에서 authService 가져오기(export로 내보냈기 때문에 {} 중괄호 쳐서 가져와야 함)
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  //firebase가 프로그램을 초기화하길 기다리고 나서 isLoggedIn이 바뀌게 해야 한다.
  const [init, setInit] = useState(false);

  //로그인한 유저 정보 담은 오브젝트 state, 디폴트 값은 일단 아무도 없으니까 null
  const [userObj, setUserObj] = useState(null);

  //어떻게 기다릴 수 있을까? useEffect()를 사용하면 된다 ㅇㅇ!
  useEffect(() => {
    const auth = getAuth();
    //유저 변화가 있는지 listen하기: onAuthStateChanged관찰자 사용
    //onAuthStateChanged은 콜백이 필요한데, 콜백은 user이다.
    onAuthStateChanged(auth, (user) => {
      //console.log(user);
      //user가 있다면 로그인한 유저 정보 userObj에 업데이트, 로그아웃하면 null
      user ? setUserObj(user) : setUserObj(null);
      //그러고 나서 초기화 시켜라
      setInit(true);
    });
  }, []);

  //Router 렌더하기 & AppRouter에 prop 전달하기
  return (
    <>
      {/*init이 거짓이면 라우터 숨기고 초기화 중이라고 띄우기*/}
      {/*로그인한 user 정보 AppRouter로 보내기*/}
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "초기화중..."
      )}
      <footer>&copy; twinkle {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
