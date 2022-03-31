import React, { useState } from "react";
import { dbService } from "fbase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Home = () => {
  //홈에서 트윗 내용 작성하는 폼
  const [tweet, setTweet] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    //트윗하기 누르면 새로운 document 생성하기
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        tweet, // tweet(다큐먼트의 key): tweet(value로 tweet state 값)
        createdAt: serverTimestamp(), //Date.now(),로 해도 되지만 이왕 있는거 함 써보자(타임존 동북아3 = 서울로 설정되어 있음)
      });
      console.log("Document written with ID: ", docRef.id);
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
  );
};

export default Home;
