import { authService, dbService, storageService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import EditProfileModal from "../components/Modal/EditProfileModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import ProfilePhoto from "components/ProfilePhoto";
import Header from "components/Header";
import ProfileTab from "components/ProfileTab";
import ProfileSection from "components/ProfileSection";
import { Route, Routes } from "react-router-dom";
import ProfileSectionLikes from "components/ProfileSectionLikes";

//로그인한 유저 정보 prop으로 받기
const Profile = ({ refreshUser, userObj }) => {
  //✅ 닉네임 수정
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onChangeDisplayName = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  //✅ 자기소개 수정
  const [newBio, setNewBio] = useState(userObj.bio);

  const onChangeBio = (event) => {
    const {
      target: { value },
    } = event;
    setNewBio(value);
  };

  //✅ 프로필 파일 미리보기
  //FileReader API로 읽은 파일의 url 상태관리
  const [profileAttachment, setProfileAttachment] = useState(userObj.photoURL);

  const onProfileFileChange = (event) => {
    //업로드할 프로필 파일 인풋으로 선택
    const {
      target: { files },
    } = event;
    const profileFile = files[0];

    //FileReader API로 파일 읽기
    const reader = new FileReader();
    reader.onload = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setProfileAttachment(result);
    };
    reader.readAsDataURL(profileFile);
  };

  //profileAttachment 비우기 (🌟 모달 닫힐 때 onClearProfileAttachment() 실행시키기)
  const profileFileInput = useRef();
  const onClearProfileAttachment = () => {
    //setProfileAttachment(null);
    profileFileInput.current.value = null;
  };

  //✅ 헤더 파일 미리보기
  const [headerAttachment, setHeaderAttachment] = useState(userObj.headerURL);

  const onHeaderFileChange = (event) => {
    //업로드할 프로필 파일 인풋으로 선택
    const {
      target: { files },
    } = event;
    const headerFile = files[0];

    //FileReader API로 파일 읽기
    const reader = new FileReader();
    reader.onload = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setHeaderAttachment(result);
    };
    reader.readAsDataURL(headerFile);
  };

  //headerAttachment 비우기 (🌟 모달 닫힐 때 onClearProfileAttachment() 실행시키기)
  const headerFileInput = useRef();
  const onClearHeaderAttachment = () => {
    //setHeaderAttachment(null);
    headerFileInput.current.value = null;
  };

  /*✅파일 업데이트 함수
  //함수로 파라미터 보내서 사용하니까 한 박자 느려서 일단 뺌
  const fileUpdate = async (fileURL, foldername, attachment) => {
    console.log(userObj[fileURL]);
    const userCollectionRef = doc(dbService, "users", `${userObj.uid}`);
    const desertRef = ref(storageService, userObj[fileURL]);
    if (userObj[fileURL] !== "") {
      await deleteObject(desertRef);
    }
    //새로운 프로필 사진 업데이트: 버킷에 파일 업로드
    const theFileRef = ref(
      storageService,
      `${userObj.uid}/${foldername}/${uuidv4()}`
    );
    //ref 위치에 파일 업로드
    const response = await uploadString(theFileRef, attachment, "data_url");
    //console.log(response);
    //버킷에 업로드된 파일 url 다운로드
    let attachmentUrl;
    attachmentUrl = await getDownloadURL(response.ref);

    if (fileURL === "photoURL") {
      await updateProfile(authService.currentUser, {
        photoURL: attachmentUrl,
      });
    }

    await updateDoc(userCollectionRef, { [fileURL]: attachmentUrl });
  };
*/
  //✅ 프로필 수정 submit
  const onSubmit = async (event) => {
    event.preventDefault();
    if (
      userObj.displayName !== newDisplayName ||
      userObj.bio !== newBio ||
      userObj.photoURL !== profileAttachment ||
      userObj.headerURL !== headerAttachment
    ) {
      console.log(
        "💗displayName: is updated?",
        newDisplayName !== userObj.displayName
      );
      console.log("💗bio: is updated?", newBio !== userObj.bio);
      console.log(
        "💗photoURL: is updated?",
        profileAttachment !== userObj.photoURL
      );
      console.log(
        "💗headerURL: is updated?",
        headerAttachment !== userObj.headerURL
      );

      //공통으로 읽어 올 userCollectionRef
      const userCollectionRef = doc(dbService, "users", `${userObj.uid}`);

      //이름 업데이트
      if (userObj.displayName !== newDisplayName) {
        //authService 업데이트
        await updateProfile(authService.currentUser, {
          displayName: newDisplayName,
        });
        console.log("✅ 이름 auth 업데이트");

        //user collection 업데이트
        await updateDoc(userCollectionRef, {
          displayName: newDisplayName,
        });
        console.log("✅ 이름 users collection 업데이트");

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
        console.log("✅ 모든 트윗에 있는 이름 업데이트");
      }

      //자기소개 업데이트
      if (userObj.bio !== newBio) {
        await updateDoc(userCollectionRef, { bio: newBio });
        console.log("✅ 자기소개 업데이트");
      }

      //프로필 사진 업데이트
      if (userObj.photoURL !== profileAttachment) {
        //프로필 사진 업데이트 시 이미 프로필 사진이 있다면 기존 사진 파일은 스토리지에서 삭제
        const desertRef = ref(storageService, userObj.photoURL);
        if (userObj.photoURL) {
          await deleteObject(desertRef);
          console.log("❌ 기존 프로필 사진 삭제");
        }

        //새로운 프로필 사진 업데이트: 버킷에 파일 업로드
        const profileFileRef = ref(
          storageService,
          `${userObj.uid}/profile/${uuidv4()}`
        );
        //ref 위치에 파일 업로드
        const response = await uploadString(
          profileFileRef,
          profileAttachment,
          "data_url"
        );

        //버킷에 업로드된 파일 url 다운로드
        let profileAttachmentUrl;
        profileAttachmentUrl = await getDownloadURL(response.ref);

        await updateProfile(authService.currentUser, {
          photoURL: profileAttachmentUrl,
        });

        await updateDoc(userCollectionRef, { photoURL: profileAttachmentUrl });
        console.log("✅ 프로필 사진 업데이트");
      }

      //헤더 업데이트
      if (userObj.headerURL !== headerAttachment) {
        //함수 만든걸로 하니까 렌더링이 한 박자 느려서 일단 패스
        //fileUpdate("headerURL", "header", headerAttachment);

        //기존 헤더 있는 경우 스토리지에서 헤더 파일 삭제
        const desertRef = ref(storageService, userObj.headerURL);
        if (userObj.headerURL) {
          await deleteObject(desertRef);

          console.log("❌ 기존 헤더 삭제");
        }
        //새로운 헤더 사진 업데이트: 버킷에 파일 업로드
        const theFileRef = ref(
          storageService,
          `${userObj.uid}/header/${uuidv4()}`
        );
        //ref 위치에 파일 업로드
        const response = await uploadString(
          theFileRef,
          headerAttachment,
          "data_url"
        );

        //버킷에 업로드된 파일 url 다운로드
        let attachmentUrl;
        attachmentUrl = await getDownloadURL(response.ref);

        await updateDoc(userCollectionRef, { headerURL: attachmentUrl });
        console.log("✅ 헤더 업데이트");
      }

      //프로필 수정 사항 있을 때만 react.js에 있는 profile도 새로고침되게 하기
      refreshUser();
    }

    //모달 닫기
    handleEditModalClose();
  };

  //프로필 수정 모달
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleEditModalOpen = () => {
    setIsEditProfileModalOpen((prev) => !prev);
    setProfileAttachment(userObj.photoURL);
    setHeaderAttachment(userObj.headerURL);
    console.log("모달 오픈");
  };

  const handleEditModalClose = () => {
    setIsEditProfileModalOpen(false);
    onClearProfileAttachment();
    onClearHeaderAttachment();
    console.log("모달 클로즈");
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
              <div className="profile__user__header">
                <Header headerURL={userObj.headerURL} />
              </div>
              <div className="profile__user__info">
                <div className="profile__user__btns">
                  <div className="profile__user__userImg">
                    <div className="userImg--lg">
                      <div className="profile__user__userImg__file">
                        <ProfilePhoto photoURL={userObj.photoURL} />
                      </div>
                    </div>
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
                    profileAttachment={profileAttachment}
                    onProfileFileChange={onProfileFileChange}
                    profileFileInput={profileFileInput}
                    headerAttachment={headerAttachment}
                    onHeaderFileChange={onHeaderFileChange}
                    headerFileInput={headerFileInput}
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
                  <div className="profile__user__info__userInfo__bio">
                    <span>{userObj.bio}</span>
                  </div>
                  <div className="profile__user__info__userInfo__createdAt">
                    <span>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </span>
                    <span> 가입일: {userCreatedAt}</span>
                  </div>
                </div>
                <div className="profile__user__info__userMeta">
                  <span>8 팔로우 중</span>
                  <span>0 팔로워</span>
                </div>
              </div>
            </div>
            <ProfileTab />
            <Routes>
              <Route path="" element={<ProfileSection userObj={userObj} />} />
              <Route
                path="likes"
                element={<ProfileSectionLikes userObj={userObj} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
