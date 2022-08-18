import { dbService } from "fbase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";

const ProfileSectionLikes = ({ userObj }) => {
  //✅ 내 트윗 가져오기: map으로
  const [tweets, setTweets] = useState([]);

  //const likedTweets = userObj.like;

  console.log("아아아테스트중");
  useEffect(() => {
    //snapshot은 쿼리 같은 건데 docs를 가지고 있다.
    //tweets은 페이지를 불러올 때 snapshot에서 나오는 거다.
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      //모든 docs는 {} 오브젝트 반환하도록
      //아이디 가져오고, 그리고 나머지 데이터 전체 가져오기
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //트윗어레이 확인해보자. 오케이 원하는대로 포맷된것을 확인할 수 있다!
      //console.log(tweetArr);
      setTweets(tweetArr);
    });
    console.log("아아아테스트중");
    return () => {
      unsubscribe(); //stop listening to changes
    };
  }, [userObj.uid]);

  return (
    <div className="tweetList">
      {tweets.map((tweet) => (
        //Tweet을 컴포넌트로 만고 props으로 가져온다.
        //tweetObj 만들 때 각각의 tweet에 할당한 id 값을 div의 key에 넣어주자
        <Tweet
          key={tweet.id}
          tweetObj={tweet}
          isOwner={tweet.creatorId === userObj.uid}
          userObj={userObj}
        />
      ))}
    </div>
  );
};

export default ProfileSectionLikes;
