import React, { useEffect } from "react";
import { authService, dbService } from "fbase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import Tweet from "../components/Tweet";
import { onAuthStateChanged } from "firebase/auth";

const Media = ({ userData, userObj }) => {
  const [mediaTweets, setMediaTweets] = useState([]);
  useEffect(() => {
    const q = query(
      collection(dbService, "tweets"),
      where("attachmentUrl", "!=", ""),
      orderBy("attachmentUrl"),
      where("creatorId", "==", userData.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMediaTweets(tweetArr);
    });

    onAuthStateChanged(authService, (user) => {
      if (user === null) {
        unsubscribe();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userData.uid]);

  return (
    <div className="tweetList">
      {mediaTweets.length > 0 ? (
        mediaTweets.map((tweet) => (
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

export default Media;
