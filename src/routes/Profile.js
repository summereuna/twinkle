import { authService, dbService } from "fbase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//로그인한 유저 정보 prop으로 받기
const Profile = ({ userObj }) => {
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

  return (
    <>
      <button onClick={onLogOutClick}>로그아웃</button>
    </>
  );
};

export default Profile;
