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
import Tweet from "../../components/Tweet";

const ProfileSectionLikes = ({ userObj }) => {
  //트윗 가져오기
  const [likeTweets, setLikeTweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "tweets"),
      where("like", "array-contains", userObj.uid),
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
      unsubscribe(); //stop listening to changes
    };
  }, [userObj.uid]);

  return (
    <div className="tweetList">
      {likeTweets.map((tweet) => (
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
