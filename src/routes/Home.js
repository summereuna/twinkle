import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import SideSection from "components/SideSection";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "tweets"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
    return () => {
      unsubscribe();
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
            <div className="tweetList">
              {tweets.map((tweet) => (
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
      <div className="mobile">
        <SideSection userObj={userObj} />
      </div>
    </main>
  );
};

export default Home;
