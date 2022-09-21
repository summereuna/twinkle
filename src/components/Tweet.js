import React, { useCallback, useEffect, useRef, useState } from "react";
import { authService, dbService, storageService } from "fbase";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import PropTypes from "prop-types";

import moment from "moment";
import "moment/locale/ko";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as solidHeart,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ProfilePhoto from "./ProfilePhoto";
import { NavLink } from "react-router-dom";

const Tweet = ({ tweetObj, isOwner, userObj }) => {
  //프로필 페이지에서 userObj는 프로필 페이지 유저 정보를 담는다.
  //console.log(userObj.displayName);
  //따라서 현재 로그인한 유저에 대해 따로 변수를 주자.
  const currentUserUid = authService.currentUser.uid;
  //수정모드인지 아닌지 false/true
  const [editing, setEditing] = useState(false);

  //수정모드 input에서 입력된 트윗 내용 업데이트
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  //디비 > 트윗컬렉션 > 해당하는 id 가진 다큐먼트 찝어오기
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);

  //삭제하려는 이미지 파일 가리키는 ref 생성
  //tweetObj의 attachmentUrl이 바로 삭제하려는 그 url임
  const desertRef = ref(storageService, tweetObj.attachmentUrl);

  //트윗 삭제
  const onDeleteClick = async () => {
    const ok = window.confirm("정말 이 트윗을 삭제하시겠습니까?");
    //console.log(ok);  //treu/false 반환함
    if (ok) {
      try {
        //해당하는 트윗 파이어스토어에서 삭제
        await deleteDoc(tweetTextRef);
        //삭제하려는 트윗에 이미지 파일이 있는 경우 이미지 파일 스토리지에서 삭제
        if (tweetObj.attachmentUrl !== "") {
          await deleteObject(desertRef);
        }
      } catch (error) {
        window.alert("트윗을 삭제하는 데 실패했습니다!");
      }
    }
  };

  const textRef = useRef();

  const autoResizeTextarea = useCallback(() => {
    textRef.current.style.height = "auto";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  //수정모드 토글 (토글 버튼 누르면 현재 상태(기본 false) 반대로 바뀜
  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setNewTweet(tweetObj.text);
  };

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

  const fromNowCreatedAt = moment(tweetObj.createdAt).fromNow();

  //유저 사진 얻기
  const [usersPhotoUrl, setUsersPhotoUrl] = useState("");
  const getUsersPhotoUrl = async () => {
    const tweetOwnerRef = doc(dbService, "users", `${tweetObj.creatorId}`);
    const tweetOwnerSnap = await getDoc(tweetOwnerRef);
    const tweetOwnerPhotoUrl = tweetOwnerSnap.data().photoURL;
    setUsersPhotoUrl(tweetOwnerPhotoUrl);
  };

  getUsersPhotoUrl();

  //💗
  const [isClickedHeart, setIsClickedHeart] = useState(false);

  //하트 +1
  const increaseLikeInTweetObj = async () => {
    const tweetDocRef = doc(dbService, "tweets", tweetObj.id);

    await updateDoc(tweetDocRef, {
      like: arrayUnion(currentUserUid),
    });
  };

  //하트를 누른 유저의 user 문서의 like 필드([])에 해당 tweet의 doc.id를 추가
  // Atomically add a new region to the "like" array field.
  const addUserLike = async () => {
    const userRef = doc(dbService, "users", currentUserUid);

    await updateDoc(userRef, {
      like: arrayUnion(`${tweetObj.id}`),
    });
  };

  //하트 -1
  const decreaseLikeInTweetObj = async () => {
    const tweetDocRef = doc(dbService, "tweets", tweetObj.id);

    await updateDoc(tweetDocRef, {
      like: arrayRemove(currentUserUid),
    });
  };

  //Atomically remove a region from the "like" array field.
  const removeUserLike = async () => {
    const userRef = doc(dbService, "users", currentUserUid);

    await updateDoc(userRef, {
      like: arrayRemove(`${tweetObj.id}`),
    });
  };

  //하트 토글
  const toggleHeartCounter = async () => {
    if (!isClickedHeart) {
      increaseLikeInTweetObj();
      addUserLike();
      setIsClickedHeart((prev) => !prev);
    } else {
      decreaseLikeInTweetObj();
      removeUserLike();
      setIsClickedHeart((prev) => !prev);
    }
  };

  //useEffect 사용해서 좋아요한 트윗 하트 색깔 유지
  useEffect(() => {
    async function fetchData() {
      const usersLikeRef = doc(dbService, "users", currentUserUid);
      const usersLikeSnap = await getDoc(usersLikeRef);
      const userLikedTweetArr = usersLikeSnap.data().like;

      if (userLikedTweetArr.includes(tweetObj.id)) {
        setIsClickedHeart(true);
      } else {
        setIsClickedHeart(false);
      }
    }
    fetchData();
    //클린업 펑션 추가해야함
  }, [currentUserUid, tweetObj.id]);

  return (
    <div>
      {/*수정 버튼 클릭된 거면(true) 수정할 폼 보여주고 : 아니면(false) 트윗 내용 보여주기*/}
      {editing ? (
        <>
          <div className="tweetSender tweetSender--edit">
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
                    placeholder="수정할 내용을 입력하세요."
                    maxLength={150}
                    value={newTweet}
                    required
                    onChange={onChange}
                    ref={textRef}
                    onInput={autoResizeTextarea}
                  />
                  {tweetObj.attachmentUrl && (
                    <div className="tweetList__tweets__tweet__content__img">
                      <img
                        src={tweetObj.attachmentUrl}
                        alt="tweetImg"
                        width="200"
                        className="tweetImg--edit"
                      />
                    </div>
                  )}
                </div>
                <div className="tweetSender__writeBox__btn">
                  <div className="tweetSender__writeBox__btn__editBox">
                    <div className="tweetSender__writeBox__btn__submit">
                      <button
                        onClick={toggleEditing}
                        className="tweetSender__writeBox__btn__editBox__delete btn btn--grey "
                        type="button"
                      >
                        취소
                      </button>
                      <input
                        className="btn btn--blue btn--border-zero"
                        type="submit"
                        value="수정"
                        disabled={
                          newTweet.length === 0 || tweetObj.text === newTweet
                        }
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="tweetList__tweets">
            <div className="userImg">
              <NavLink to={`/${tweetObj.creatorId}`}>
                <div className="userImg_img">
                  <ProfilePhoto photoURL={usersPhotoUrl} />
                </div>
              </NavLink>
            </div>
            <div className="tweetList__tweets__tweet">
              <div className="tweetList__tweets__tweet__info">
                <NavLink to={`/${tweetObj.creatorId}`}>
                  <span className="tweetList__tweets__tweet__info__userName">
                    {tweetObj.creatorName}
                  </span>
                  <span>@{tweetObj.creatorEmailId}</span>
                </NavLink>
                <span> · </span>
                <span>{fromNowCreatedAt}</span>
              </div>
              <div className="tweetList__tweets__tweet__content">
                <div className="tweetList__tweets__tweet__content__text">
                  <p>{tweetObj.text}</p>
                </div>
                {/*이미지 업로드 했을 때만 보이게*/}
                {tweetObj.attachmentUrl && (
                  <div className="tweetList__tweets__tweet__content__img">
                    <img
                      src={tweetObj.attachmentUrl}
                      alt="tweetImg"
                      width="200"
                      className="tweetImg"
                    />
                  </div>
                )}
                <div className="tweetList__tweets__tweet__content__btns">
                  <div className="tweetList__tweets__tweet__content__btns__btn">
                    <button
                      className={`btn--min--circle ${
                        isClickedHeart ? "clicked-heart" : ""
                      }`}
                      onClick={toggleHeartCounter}
                    >
                      {isClickedHeart ? (
                        <FontAwesomeIcon icon={solidHeart} />
                      ) : (
                        <FontAwesomeIcon icon={regularHeart} />
                      )}
                    </button>
                    <span>{tweetObj.like.length}</span>
                    {/*트윗 주인인 경우만 삭제/수정 버튼 보이게*/}
                  </div>
                  {isOwner && (
                    <div className="tweetList__tweets__tweet__content__btn__modify">
                      <button
                        className="btn--min--circle"
                        onClick={toggleEditing}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button
                        className="btn--min--circle"
                        onClick={onDeleteClick}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

Tweet.propTypes = {
  tweetObj: PropTypes.object,
  isOwner: PropTypes.bool,
};

export default Tweet;
