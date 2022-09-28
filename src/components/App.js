//절대 경로(absolute import)
import AppRouter from "components/Router";
import { useEffect, useState } from "react";
//절대 경로(absolute import)
//fbase에서 authService 가져오기(export로 내보냈기 때문에 {} 중괄호 쳐서 가져와야 함)
import { onAuthStateChanged } from "firebase/auth";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { authService, dbService } from "fbase";

function App() {
  //firebase가 프로그램을 초기화하길 기다리고 나서 isLoggedIn이 바뀌게 해야함
  const [init, setInit] = useState(false);

  //로그인한 유저 정보 담은 오브젝트 state, 디폴트 값은 일단 아무도 없으니까 null
  const [userObj, setUserObj] = useState(null);

  const handleUserUpdate = (newObj) => {
    setUserObj(newObj);
  };

  //소셜 로그인 시 이미 가입한 유저 필터하기 위한 코드
  //모든 유저의 id 정보 담는 어레이
  const [allUserIdList, setAllUserIdList] = useState([]);

  const getAllUserIdList = async () => {
    const querySnapshot = await getDocs(collection(dbService, "users"));
    const allUserUidArr = querySnapshot.docs.map((doc) => doc.id);
    setAllUserIdList(allUserUidArr);
  };

  useEffect(() => {
    getAllUserIdList();
    //유저 변화가 있는지 listen하기: onAuthStateChanged관찰자 사용
    //onAuthStateChanged은 콜백이 필요한데, 콜백은 user
    onAuthStateChanged(authService, async (user) => {
      //user가 있다면 로그인한 유저 정보 userObj에 업데이트, 로그아웃하면 null
      if (user) {
        const docRef = doc(dbService, "users", `${user.uid}`);
        const docSnap = await getDoc(docRef);
        const userCollectionDocObj = docSnap.data();
        setUserObj(userCollectionDocObj);
      } else {
        setUserObj(null);
      }

      console.log(`
       x         *       +        
   *  _____  +    _  x  _   _   * 
     |_   _|_ _ _|_|___| |_| |___ 
       | | | | | | |   | '_| | -_|
       |_| |_____|_|_|_|_,_|_|___|
                                  
                                  `);
      //그러고 나서 초기화
      setInit(true);
    });
    return () => {
      setInit(false);
    };
  }, []);

  return (
    <>
      <div id="body-wrapper">
        {init ? (
          <AppRouter
            isLoggedIn={Boolean(userObj)}
            userObj={userObj}
            handleUserUpdate={handleUserUpdate}
            allUserIdList={allUserIdList}
          />
        ) : (
          <div className="loading__container">
            <FontAwesomeIcon className="loading" icon={faCog} spin size="3x" />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
