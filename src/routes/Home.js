import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
} from "firebase/firestore";

//App > Router > Home 순으로 보낸 로그인한 유저 정보 prop으로 받기
const Home = ({ userObj }) => {
  //홈에서 트윗 내용 작성하는 폼
  const [tweet, setTweet] = useState("");

  //0. 작성한 트윗 가져오기: 기본 값은 빈 배열
  const [tweets, setTweets] = useState([]);

  const getTweets = async () => {
    /*1. DB에서 컬렉션 가져오기
    dbService에 있는 tweets 컬렉션을 가져오는 쿼리 만들기*/
    const q = query(collection(dbService, "tweets"));

    /*2. 컬렉션의 다큐먼트 모두 가져오기
    - 쿼리를 실행하고 결과를 QuerySnapshot으로 반환하면 tweets 컬렉션의 document들을 얻는다.
    - 따라서 querySnapshot은 tweets 컬렉션의 document들을 모아놓은 배열이다.*/
    const querySnapshot = await getDocs(q);

    //3. 각각의 다큐먼트를 나열
    querySnapshot.forEach((document) => {
      /*각각의 다큐먼트를 나열할 때 {data, id} 오브젝트 형태로 나열하자.
    - document의 data를 가져오기 위해 data() 메서드 사용
    - 트윗 하나씩 나열 할 때 쓸 key 값 필요하기 때문에 id 할당*/
      const tweetObj = {
        ...document.data(),
        id: document.id,
      };
      //- setTweets() 모디파이어로 이전 tweets(prev)에 대해, 새로운 배열(새로 작성한 트윗과, ...그 이전 것들)을 리턴해주자.
      setTweets((prev) => [tweetObj, ...prev]);
    });
  };

  //4. 컴포넌트가 마운트되면 useEffect()사용
  useEffect(() => {
    getTweets();
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
          //tweetObj 만들 때 각각의 tweet에 할당한 id 값을 div의 key에 넣어주자
          <div key={tweet.id}>
            <h4>{tweet.text}</h4>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
