import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//로그인한 유저 정보 prop으로 받기
const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    //home으로 돌아가기 위해 react router dom의 useNavigate() 메서드 사용
    navigate("/");
  };

  //내 Tweets 얻는 function 생성
  const getMyTweets = async () => {
    //트윗 불러오기
    //dbService의 컬렉션 중 "tweets" Docs 중에서, userObj의 uid와 동일한 creatorID를 가진 모든 문서를 가져오는 쿼리(요청) 생성
    //트윗한 순서대로 정렬하기
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );

    //getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  //내 Tweets 얻는 function 호출
  useEffect(() => {
    getMyTweets();
  }, []);

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    //이름 수정하면 updateProfile() 메서드 사용해 프로필 업데이트하기
    //firestore에서 users 콜렉션 만들어서 도큐먼트 생성해서 유저에 관한 데이터 모두 관리하는 방법도 있지만 귀찮으니 걍 이걸로 하자구
    //1. firebase에 있는 profile 업데이트
    if (userObj.displayName !== newDisplayName) {
      //console.log(userObj.updateProfile);
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
      //2. react.js에 있는 profile도 새로고침되게 하기
      refreshUser();
    }
  };
  //프로필 사진 업데이트 하기(숙제)
  /*
1. 프로필 사진 업로드 하는 폼 만들기
2. profilePhoto 버켓 만들어서 
3. 다운로드 url 가져와서 위에 photoURL에 넣어주면 됨
*/
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="이름"
          value={newDisplayName}
        />
        <input type="submit" value="저장" />
      </form>
      <button onClick={onLogOutClick}>로그아웃</button>
    </>
  );
};

export default Profile;
