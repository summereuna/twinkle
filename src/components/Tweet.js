import React, { useState } from "react";
import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Tweet = ({ tweetObj }, isOwner) => {
  //수정모드인지 아닌지 false/true
  const [editing, setEditing] = useState(false);

  //수정모드 input에서 입력된 트윗 내용 업데이트
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  //디비 > 트윗컬렉션 > 해당하는 id 가진 다큐먼트 찝어오기
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);

  //삭제
  const onDeleteClick = async () => {
    const ok = window.confirm("정말 이 트윗을 삭제하시겠습니까?");
    //console.log(ok);  //treu/false 반환함
    if (ok) {
      //해당하는 트윗 삭제
      await deleteDoc(tweetTextRef);
    } else {
      console.log("삭제하는데 실패!");
    }
  };

  //수정모드 토글 (토글 버튼 누르면 현재 상태(기본 false) 반대로 바뀜
  const toggleEditing = () => setEditing((prev) => !prev);

  //수정모드에서 트윗 수정 후 폼 서밋해서 트윗 내용 업데이트하기
  const onSubmit = async (event) => {
    event.preventDefault();
    const ok = window.confirm("정말 이 트윗을 수정하시겠습니까?");
    if (ok) {
      await updateDoc(tweetTextRef, { text: newTweet });
      //업뎃하고 나서 수정모드 false로 만들어 주기
      setEditing(false);
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    //수정모드에서 사용자가 입력하는 input 값을 newTweet state에 넣기
    setNewTweet(value);
  };

  return (
    <div>
      {/*수정 버튼 클릭된 거면(true) 수정할 폼 보여주고 : 아니면(false) 트윗 내용 보여주기*/}
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              value={newTweet}
              required
              type="text"
              placeholder="수정할 내용을 입력하세요."
              onChange={onChange}
            ></input>
            <input type="submit" value="수정" />
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {/*트윗 주인인 경우만 삭제/수정 버튼 보이게*/}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>삭제</button>
              <button onClick={toggleEditing}>수정</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;