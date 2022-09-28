import React, { useEffect } from "react";
import { dbService } from "fbase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import Tweet from "../components/Tweet";

const Likes = ({ userData, userObj }) => {
  const [likeTweets, setLikeTweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "tweets"),
      where("like", "array-contains", userData.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLikeTweets(tweetArr);
    });

    return () => {
      unsubscribe();
    };
  }, [userData.uid]);

  return (
    <div className="tweetList">
      {likeTweets.length > 0 ? (
        likeTweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
            userObj={userData}
          />
        ))
      ) : (
        <div className="tweetList noTweet">작성한 트윗이 없습니다.</div>
      )}
    </div>
  );
};

export default Likes;
