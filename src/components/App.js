//절대 경로(absolute import)
import AppRouter from "components/Router";
import { useEffect, useState } from "react";
//절대 경로(absolute import)
//fbase에서 authService 가져오기(export로 내보냈기 때문에 {} 중괄호 쳐서 가져와야 함)
import { onAuthStateChanged, updateProfile } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { authService, dbService } from "fbase";
import { useCallback } from "react";

function App() {
  //firebase가 프로그램을 초기화하길 기다리고 나서 isLoggedIn이 바뀌게 해야 한다.
  const [init, setInit] = useState(false);

  //로그인한 유저 정보 담은 오브젝트 state, 디폴트 값은 일단 아무도 없으니까 null
  const [userObj, setUserObj] = useState(null);

  const handleUserUpdate = (newObj) => {
    setUserObj(newObj);
  };
  //refresh 위한 state
  //const [, setNewName] = useState("");

  //어떻게 기다릴 수 있을까? useEffect()를 사용하면 된다 ㅇㅇ!
  useEffect(() => {
    //유저 변화가 있는지 listen하기: onAuthStateChanged관찰자 사용
    //onAuthStateChanged은 콜백이 필요한데, 콜백은 user이다.
    onAuthStateChanged(authService, async (user) => {
      //console.log(user);
      //user가 있다면 로그인한 유저 정보 userObj에 업데이트, 로그아웃하면 null
      //user ? setUserObj(user) : setUserObj(null);
      if (user) {
        //auth에 유저 이름 넣기
        if (user.displayName === null) {
          await updateProfile(user, { displayName: "유저" });
        }
        console.log("❗️user", user);
        //users 컬렉션 문서 가져오기
        const docRef = doc(dbService, "users", `${user.uid}`);
        const docSnap = await getDoc(docRef);

        const userCollectionDocObj = docSnap.data();
        // const authCurrentUserObj = user;

        // const mergeUserObj = { ...authCurrentUserObj, ...userCollectionDocObj };

        // setUserObj(mergeUserObj);

        setUserObj(userCollectionDocObj);
        console.log("❗️userObj", userObj);
        //console.log("❗️mergeUserObj", mergeUserObj);
      } else {
        setUserObj(null);
      }

      //그러고 나서 초기화 시켜라
      setInit(true);
    });
    return () => {
      setInit(false);
    };
  }, []);

  // user 새로고침하는 기능: firebase의 정보를 가지고 react.js의 userObj 업데이트 하기
  //으로 하려고 하다가 계속 오류나서 그냥 state 하나 더 만들어서 렌더링만을 위한 state 추가
  const refreshUser = useCallback(async () => {
    //const newAuthServiceCurrentUser = authService.currentUser;

    const newDocRef = doc(dbService, "users", `${userObj.uid}`);
    const newDocSnap = await getDoc(newDocRef);
    const newUserCollectionDocObj = newDocSnap.data();

    /*const newMergeUserObj = {
      ...newAuthServiceCurrentUser,
      ...newUserCollectionDocObj,
    };
    setUserObj(newMergeUserObj);*/

    setUserObj(newUserCollectionDocObj);
    console.log("🔥refresh: authService.currentUser", authService.currentUser);
    console.log("🔥refresh: newUserCollectionDocObj", newUserCollectionDocObj);
    console.log("🔥refresh: userObj 얘가 안바뀌네 ㅡㅡ", userObj);
  }, [userObj]);

  console.log("✅ refresh");
  console.log("✅userObj✅", userObj);

  //Router 렌더하기 & AppRouter에 prop 전달하기
  return (
    <>
      {/*init이 거짓이면 라우터 숨기고 초기화 중이라고 띄우기*/}
      {/*로그인한 user 정보 AppRouter로 보내기*/}
      <div id="body-wrapper">
        {init ? (
          <AppRouter
            isLoggedIn={Boolean(userObj)}
            userObj={userObj}
            refreshUser={refreshUser}
            handleUserUpdate={handleUserUpdate}
          />
        ) : (
          <div className="loading__container">
            <FontAwesomeIcon className="loading" icon={faCog} spin size="3x" />
          </div>
        )}
      </div>
      <footer>&copy; Twinkle {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
