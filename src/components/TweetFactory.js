import React, { useState, useRef, useCallback } from "react";
//식별자 자동 생성해주는 uuid
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import ProfilePhoto from "./ProfilePhoto";

const TweetFactory = ({ userObj, isModalOpen, handleModalClose }) => {
  const textRef = useRef();

  //input에 데이터 입력될 때 마다 ref 가져와서 textarea의 height에 scrollHeight 높이만큼 더해주기
  const autoResizeTextarea = useCallback(() => {
    textRef.current.style.height = "auto";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  const [tweet, setTweet] = useState("");

  //첨부파일 readAsDataURL로 받은 데이터 넣어 두는 state
  //attachment에 들어온 url은 첨부파일 미리보기 img src로 활용
  //null > ""로 수정: 트윗할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";

    //이미지 첨부하지 않고 트윗만 올리고 싶은 경우가 있음
    //attachment가 빈값이 아닌 경우에만 아래 코드 실행
    if (attachment !== "") {
      //storage에 파일 데이터가 업로드될 위치 가리키는 레퍼런스 생성하기
      const attachmentRef = ref(
        storageService,
        `${userObj.uid}/tweets/${uuidv4()}`
      );

      //레퍼런스(attachmentRef)가 가리키는 위치에 찐으로 데이터 업로드하기
      //attachmentRef가 가리키는 위치에 attachment에 들어있는 첨부파일 url을 넣어라, 포맷data_url
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );

      //response의 ref, 즉 스토리지에 업로드한 파일 위치에 있는 그 파일의 URL을 다운로드해서
      //attachmentUrl 변수에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
    }
    //attachment가 빈값인 경우(글만 트윗할 경우) url에 빈값으로 들어감

    //트윗 오브젝트 형태
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      creatorName: userObj.displayName,
      creatorEmailId: userObj.email.substring(0, userObj.email.indexOf("@")),
      attachmentUrl,
      like: [],
    };

    await addDoc(collection(dbService, "tweets"), tweetObj);

    setTweet("");
    setAttachment("");

    textRef.current.style.height = "auto";

    //모달인 경우 창 닫기
    if (isModalOpen) {
      handleModalClose();
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  //file 미리보기 제공
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    //파일은 하나만
    const theFile = files[0];

    //1. 파일리더 새로 만들고
    const reader = new FileReader();
    //3. 파일 읽기 끝나면(reader.onloadend) finishedEvent를 받는다
    reader.onloadend = (finishedEvent) => {
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

  //파일 업로드시 각 DOM 영역에 이미지 띄우기
  const clickFileUploader = () => {
    fileInput.current.click();
  };

  //엔터키 작동 막기
  document.addEventListener(
    "keydown",
    function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    },
    true
  );

  return (
    <div className="tweetSender">
      <div className="tweetSender__userImg">
        <div className="tweetSender__userImg__img">
          <ProfilePhoto photoURL={userObj.photoURL} />
        </div>
      </div>
      <div className="tweetSender__writeBox">
        <form onSubmit={onSubmit}>
          <div className="tweetSender__writeBox__text">
            <textarea
              className="tweetSender__writeBox__text__textarea"
              type="text"
              autoComplete="off"
              wrap="on"
              placeholder="무슨 일이 일어나고 있나요?"
              maxLength={150}
              value={tweet}
              onChange={onChange}
              ref={textRef}
              onInput={autoResizeTextarea}
            />
            {attachment && (
              <div className="preview">
                <img
                  src={attachment}
                  alt="preview"
                  width="300"
                  height="auto"
                  className="previewImg"
                />
                <button className="preview--remove" onClick={onClearAttachment}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
          </div>

          <div className="tweetSender__writeBox__btn">
            <input
              name="file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              ref={fileInput}
              id="files"
              className="hidden"
            />
            <div className="icon" htmlFor="files" onClick={clickFileUploader}>
              <FontAwesomeIcon icon={faImage} size="2x" />
            </div>
            <div className="tweetSender__writeBox__btn__submit">
              <input
                className="btn btn--blue btn--border-zero"
                type="submit"
                value="트윗하기"
                disabled={tweet.length > 0 || attachment !== "" ? false : true}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

TweetFactory.propTypes = {
  userObj: PropTypes.object,
};

export default TweetFactory;
