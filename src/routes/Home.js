import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import Tweet from "components/Tweet";

//App > Router > Home 순으로 보낸 로그인한 유저 정보 prop으로 받기
const Home = ({ userObj }) => {
  //홈에서 트윗 내용 작성하는 폼
  const [tweet, setTweet] = useState("");

  //0. 작성한 트윗 가져오기: 기본 값은 빈 배열
  const [tweets, setTweets] = useState([]);

  //🔥트윗 가져오기: map으로
  useEffect(() => {
    //snapshot은 쿼리 같은 건데 docs를 가지고 있다.
    //tweets은 페이지를 불러올 때 snapshot에서 나오는 거다.
    //따라서 setTweets()을
    const q = query(
      collection(dbService, "tweets"),
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
    return () => {
      unsubscribe();
    };
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    //트윗하기 누르면 새로운 document 생성하기
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        //트윗 작성자
        creatorId: userObj.uid,
        text: tweet, //tweet(value로 tweet state 값)
        createdAt: serverTimestamp(), //Date.now(),로 해도 되지만 이왕 있는거 함 써보자(타임존 동북아3 = 서울로 설정되어 있음)
      });
      //console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    //state 비워서 form 비우기
    setTweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
    //console.log(tweet);
  };

  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="무슨 일이 일어나고 있나요?"
            maxLength={120}
            value={tweet}
            onChange={onChange}
          />
          <input type="submit" value="트윗하기" />
        </form>
      </div>
      {/*DB에서 가져온 트위터 나열*/}
      <div>
        {tweets.map((tweet) => (
          //Tweet을 컴포넌트로 만고 props으로 가져온다.
          //tweetObj 만들 때 각각의 tweet에 할당한 id 값을 div의 key에 넣어주자
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
