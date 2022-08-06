import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";

//App > Router > Home 순으로 보낸 로그인한 유저 정보 prop으로 받기
const Home = ({ userObj }) => {
  //0. 작성한 트윗 가져오기: 기본 값은 빈 배열
  const [tweets, setTweets] = useState([]);

  //모든 트윗 가져오기: map으로
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
      unsubscribe(); //stop listening to changes
    };
  }, []);

  return (
    <main>
      <div id="body-content">
        <div className="home__container">
          <div className="home__tile">
            <h1>최신 트윗</h1>
          </div>
          <div className="home__main-container">
            <div className="home__main-container__write">
              <TweetFactory userObj={userObj} />
            </div>
            {/*DB에서 가져온 트위터 나열*/}
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
