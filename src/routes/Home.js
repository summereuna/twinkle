import React, { useEffect, useState, useRef } from "react";
//식별자 자동 생성해주는 uuid
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import Tweet from "components/Tweet";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";

//App > Router > Home 순으로 보낸 로그인한 유저 정보 prop으로 받기
const Home = ({ userObj }) => {
  //홈에서 트윗 내용 작성하는 폼
  const [tweet, setTweet] = useState("");

  //0. 작성한 트윗 가져오기: 기본 값은 빈 배열
  const [tweets, setTweets] = useState([]);

  //첨부파일 readAsDataURL로 받은 데이터 넣어 두는 state
  //attachment에 들어온 url은 첨부파일 미리보기 img src로 활용
  //null > ""로 수정: 트윗할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
  const [attachment, setAttachment] = useState("");

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

    //if문 안에 있던 거 밖으로 빼주자. 그래야 오류 안남 (lexical scope: 정적 범위)
    let attachmentUrl = "";

    //이미지 첨부하지 않고 걍 트윗만 올리고 싶을 때도 있기 때문에
    //attachment가 빈값이 아닌 경우에만 아래 코드 실행되게하자.
    if (attachment !== "") {
      //storage에 파일 데이터가 업로드될 위치 가리키는 레퍼런스 생성하기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

      //레퍼런스(attachmentRef)가 가리키는 위치에 찐으로 데이터 업로드하기
      //attachmentRef가 가리키는 위치에 attachment에 들어있는 첨부파일 url을 넣어라, 포맷data_url
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      //console.log(response);

      //response의 ref, 즉 스토리지에 업로드한 파일 위치에 있는 그 파일의 URL을 다운로드해서
      //attachmentUrl 변수에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
      //콘솔에 찍어보자
      //console.log(attachmentUrl);
    }
    //빈값인 경우 url에 빈값으로 들어감

    //트윗 오브젝트 형태
    const tweetObj = {
      text: tweet, //tweet(value로 tweet state 값)
      createdAt: serverTimestamp(), //Date.now(),로 해도 되지만 이왕 있는거 함 써보자(타임존 동북아3 = 서울로 설정되어 있음)
      creatorId: userObj.uid,
      attachmentUrl,
    };
    //트윗하기 누르면 tweetObj 형태로 새로운 document 생성하여 tweets 콜렉션에 넣기
    await addDoc(collection(dbService, "tweets"), tweetObj);
    //console.log("Document written with ID: ", docRef.id);

    //state 비워서 form 비우기
    setTweet("");
    //파일 미리보기 img src 비워주기
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
    //console.log(tweet);
  };

  //file 미리보기 제공
  const onFileChange = (event) => {
    //console.log(event);
    const {
      target: { files },
    } = event;
    //파일은 하나만 넣을 수 있게..^^;;
    const theFile = files[0];
    //console.log(theFile);
    //1. 파일리더 새로 만들고
    const reader = new FileReader();
    //3. 파일 읽기 끝나면(reader.onloadend) finishedEvent를 받는다
    reader.onloadend = (finishedEvent) => {
      //콘솔에 찍어보면 finishedEvent.target.result에 이미지 url이 생성된 것을 확인할 수 있다.
      //console.log(finishedEvent);
      // 첨부한 사진 데이터 들어있는 위치: 이벤트의 현재 타겟의 결과
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    //2. 리더에 dataURL로 읽기 메서드로 theFile 읽기 시작
    reader.readAsDataURL(theFile);
  };

  //선택했던 첨부파일명 없애기위해 useRef() 훅 사용
  const fileInput = useRef();

  //첨부 사진 취소하는 버튼
  const onClearAttachment = () => {
    //1. 첨부파일 url 넣는 state 비워서 프리뷰 img src 없애기
    //null > ""로 수정: 트윗할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
    setAttachment("");
    //2. 선택했던 첨부파일명 없애기
    fileInput.current.value = null;
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
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            ref={fileInput}
          />
          {attachment && (
            <div>
              <img src={attachment} alt="preview" width="50" height="50" />
              <button onClick={onClearAttachment}>취소</button>
            </div>
          )}
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
