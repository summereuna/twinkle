import Tweet from "components/Tweet";
import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import EditProfileModal from "../components/Modal/EditProfileModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

//로그인한 유저 정보 prop으로 받기
const Profile = ({ refreshUser, userObj }) => {
  //내 트윗 가져오기: map으로
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    //snapshot은 쿼리 같은 건데 docs를 가지고 있다.
    //tweets은 페이지를 불러올 때 snapshot에서 나오는 거다.
    //따라서 setTweets()을
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
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
      unsubscribe(); //stop listening to changes
    };
  }, [userObj.uid]);

  //닉네임 수정
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onChangeDisplayName = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  //자기소개 수정
  const [newBio, setNewBio] = useState(userObj.bio);

  const onChangeBio = (event) => {
    const {
      target: { value },
    } = event;
    setNewBio(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    //이름 수정하면 updateProfile() 메서드 사용해 프로필 업데이트하기
    //firestore에서 users 콜렉션 만들어서 도큐먼트 생성해서 유저에 관한 데이터 모두 관리하는 방법도 있지만 귀찮으니 걍 이걸로 하자구
    //1. firebase에 있는 profile 업데이트\
    if (
      `${userObj.displayName !== newDisplayName}` ||
      `${userObj.bio !== newBio}`
    ) {
      if (userObj.displayName !== newDisplayName) {
        //console.log(userObj.updateProfile);
        //authService 업데이트
        await updateProfile(authService.currentUser, {
          displayName: newDisplayName,
        });

        //user collection 업데이트
        const userCollectionRef = doc(dbService, "users", `${userObj.uid}`);
        await updateDoc(userCollectionRef, {
          displayName: newDisplayName,
        });

        //트윗 작성자명 일괄 변경 (batch: 500개 문서 제한)
        const updateAllMyTweets = async () => {
          const batch = writeBatch(dbService);

          const myTweetsQ = query(
            collection(dbService, "tweets"),
            where("creatorId", "==", userObj.uid)
          );

          const myTweetsQuerySnapshot = await getDocs(myTweetsQ);

          myTweetsQuerySnapshot.forEach((tweet) => {
            const myTweetsDocRef = doc(dbService, "tweets", `${tweet.id}`);
            batch.update(myTweetsDocRef, {
              creatorName: newDisplayName,
            });
          });
          await batch.commit();
        };
        updateAllMyTweets();
      }
      if (userObj.bio !== newBio) {
        const userBioRef = doc(dbService, "users", `${userObj.uid}`);
        await updateDoc(userBioRef, { bio: newBio });
      }
      //2. react.js에 있는 profile도 새로고침되게 하기
      refreshUser();

      setIsEditProfileModalOpen((prev) => !prev);
    }
  };

  //프로필 사진 업데이트 하기(숙제)
  /*
1. 프로필 사진 업로드 하는 폼 만들기
2. profilePhoto 버켓 만들어서 
3. 다운로드 url 가져와서 위에 photoURL에 넣어주면 됨
*/

  //프로필 수정 모달
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleEditModalOpen = () => {
    setIsEditProfileModalOpen((prev) => !prev);
  };

  const handleEditModalClose = () => {
    setIsEditProfileModalOpen(false);
  };

  //유저 가입일
  const userCreatedAtTimestamp = Number(userObj.metadata.createdAt);
  //타입이 string이어서 number로 바꿔줌
  const date = new Date(userCreatedAtTimestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const userCreatedAt = `${year}년 ${month}월 ${day}일`;

  return (
    <main>
      <div id="body-content">
        <div className="profile__container">
          <div className="profile__title">
            <a href="/">
              <FontAwesomeIcon icon={faArrowLeft} size="2x" />
            </a>
            <h1 className="profile__title__username">{userObj.displayName}</h1>
          </div>
          <div className="profile__main-container">
            <div className="profile__user">
              <div className="profile__user__header">헤더 이미지 598*200</div>
              <div className="profile__user__info">
                <div className="profile__user__btns">
                  <div className="profile__user__userImg">
                    <div className="profile__user__userImg__file userImg--lg"></div>
                  </div>
                  <button
                    className="btn btn--grey"
                    onClick={handleEditModalOpen}
                  >
                    프로필 수정
                  </button>
                  <EditProfileModal
                    userObj={userObj}
                    isEditProfileModalOpen={isEditProfileModalOpen}
                    handleEditModalClose={handleEditModalClose}
                    onChangeDisplayName={onChangeDisplayName}
                    onChangeBio={onChangeBio}
                    newDisplayName={newDisplayName}
                    newBio={newBio}
                    onSubmit={onSubmit}
                  />
                </div>
                <div className="profile__user__info__userName">
                  <span className="profile__user__info__userName__name">
                    {userObj.displayName}
                  </span>
                  <span className="profile__user__info__userName__id">
                    @{userObj.email.substring(0, userObj.email.indexOf("@"))}
                  </span>
                </div>
                <div className="profile__user__info__userInfo">
                  <p>자기 소개: {userObj.bio}</p>
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </span>
                  <span> 가입일: {userCreatedAt}</span>
                </div>
                <div className="profile__user__info__userMeta">
                  <span>8 팔로우 중</span>
                  <span>0 팔로워</span>
                </div>
              </div>
            </div>

            <nav className="nav-tab">
              <div className="nav-tab__div">
                <div className="nav-tab__div__div">
                  <div className="nav-tab__list">
                    <div className="nav-tab__list__presentation">
                      <a href="/" className="nav-tab__list__presentation__a">
                        <div className="nav-tab__list__presentation__a__text-box">
                          <span className="nav-tab__list__presentation__a__text-box__name">
                            트윗
                          </span>
                          <div className="nav-tab__list__presentation__a__text-box__line tab-on"></div>
                        </div>
                      </a>
                    </div>
                    <div className="nav-tab__list__presentation">
                      <a href="/" className="nav-tab__list__presentation__a">
                        <div className="nav-tab__list__presentation__a__text-box">
                          <span className="nav-tab__list__presentation__a__text-box__name">
                            트윗 및 답글
                          </span>
                          <div className="nav-tab__list__presentation__a__text-box__line tab-on"></div>
                        </div>
                      </a>
                    </div>
                    <div className="nav-tab__list__presentation">
                      <a href="/" className="nav-tab__list__presentation__a">
                        <div className="nav-tab__list__presentation__a__text-box">
                          <span className="nav-tab__list__presentation__a__text-box__name">
                            미디어
                          </span>
                          <div className="nav-tab__list__presentation__a__text-box__line tab-on"></div>
                        </div>
                      </a>
                    </div>
                    <div className="nav-tab__list__presentation">
                      <a href="/" className="nav-tab__list__presentation__a">
                        <div className="nav-tab__list__presentation__a__text-box">
                          <span className="nav-tab__list__presentation__a__text-box__name">
                            마음에 들어요
                          </span>
                          <div className="nav-tab__list__presentation__a__text-box__line tab-on"></div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <div className="tweetList">
              {tweets.map((tweet) => (
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
