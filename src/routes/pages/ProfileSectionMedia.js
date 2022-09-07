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

const ProfileSectionMedia = ({ userData, userObj }) => {
  //트윗 가져오기
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

    return () => {
      unsubscribe(); //stop listening to changes
    };
  }, [userData.uid]);

  return (
    <div className="tweetList">
      {mediaTweets.length > 0 ? (
        mediaTweets.map((tweet) => (
          //Tweet을 컴포넌트로 만고 props으로 가져온다.
          //tweetObj 만들 때 각각의 tweet에 할당한 id 값을 div의 key에 넣어주자
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

export default ProfileSectionMedia;
