import { authService, dbService, storageService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { useParams } from "react-router-dom";
import SideSection from "components/SideSection";
import UserProfile from "components/UserProfile";

const Profile = ({ userObj, handleUserUpdate }) => {
  //프로필 사용자 정보 받아오기
  const userId = useParams().id;

  const [init, setInit] = useState(false);

  const [userData, setUserData] = useState({});

  const getProfiles = useCallback(async () => {
    const usersRef = doc(dbService, "users", userId);
    const usersSnap = await getDoc(usersRef);
    const userDataObj = usersSnap.data();
    setUserData(userDataObj);
  }, [userId]);
  //userId 파람 디펜던시에 넣어 다른 유저 선택시 페이지 리렌더링

  //userData 팔로우 클릭시 setUserData 실행
  const handleUserDataUpdate = (newUserData) => {
    setUserData(newUserData);
  };

  useEffect(() => {
    setInit(true);
    getProfiles();
    return () => {
      setInit(false);
    };
  }, [getProfiles]);
  //다른 유저 선택시 페이지 리렌더링

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onChangeDisplayName = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const [newBio, setNewBio] = useState(userObj.bio);

  const onChangeBio = (event) => {
    const {
      target: { value },
    } = event;
    setNewBio(value);
  };

  //FileReader API로 읽은 파일의 url 상태관리
  const [profileAttachment, setProfileAttachment] = useState(userObj.photoURL);

  const onProfileFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const profileFile = files[0];

    const reader = new FileReader();
    reader.onload = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setProfileAttachment(result);
    };
    reader.readAsDataURL(profileFile);
  };

  const profileFileInput = useRef();

  const onClearProfileAttachment = () => {
    profileFileInput.current.value = null;
  };

  const [headerAttachment, setHeaderAttachment] = useState(userObj.headerURL);

  const onHeaderFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const headerFile = files[0];

    const reader = new FileReader();
    reader.onload = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setHeaderAttachment(result);
    };
    reader.readAsDataURL(headerFile);
  };

  const headerFileInput = useRef();
  const onClearHeaderAttachment = () => {
    headerFileInput.current.value = null;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (
      userObj.displayName !== newDisplayName ||
      userObj.bio !== newBio ||
      userObj.photoURL !== profileAttachment ||
      userObj.headerURL !== headerAttachment
    ) {
      const updatedUserObj = { ...userObj };

      //공통으로 읽어 올 userCollectionRef
      const userCollectionRef = doc(dbService, "users", `${userObj.uid}`);

      if (userObj.displayName !== newDisplayName) {
        await updateProfile(authService.currentUser, {
          displayName: newDisplayName,
        });

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

        updatedUserObj.displayName = newDisplayName;
      }

      if (userObj.bio !== newBio) {
        await updateDoc(userCollectionRef, { bio: newBio });
        updatedUserObj.bio = newBio;
      }

      if (userObj.photoURL !== profileAttachment) {
        //프로필 사진 업데이트 시 이미 프로필 사진이 있다면 기존 사진 파일은 스토리지에서 삭제
        //소셜로그인 사용자는 처음 로그인시 photoURL이 다르고 스토리지에 포토가 추가되지 않았기 때문에 아래 조건 추가
        if (userObj.photoURL.includes("firebasestorage")) {
          const desertRef = ref(storageService, userObj.photoURL);
          if (userObj.photoURL) {
            await deleteObject(desertRef);
          }
        }

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

        updatedUserObj.photoURL = profileAttachmentUrl;
      }

      if (userObj.headerURL !== headerAttachment) {
        //기존 헤더 있는 경우 스토리지에서 헤더 파일 삭제
        const desertRef = ref(storageService, userObj.headerURL);
        if (userObj.headerURL) {
          await deleteObject(desertRef);
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

        //userObj state 변경
        updatedUserObj.headerURL = attachmentUrl;
      }

      handleUserUpdate(updatedUserObj);
    }

    handleEditModalClose();
  };

  //프로필 수정 모달
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleEditModalOpen = () => {
    if (!isEditProfileModalOpen) {
      setIsEditProfileModalOpen((prev) => !prev);
      setProfileAttachment(userObj.photoURL);
      setHeaderAttachment(userObj.headerURL);
    }
  };

  const handleEditModalClose = () => {
    if (isEditProfileModalOpen) {
      setIsEditProfileModalOpen((prev) => !prev);
      onClearProfileAttachment();
      onClearHeaderAttachment();
    }
  };

  return (
    <main>
      <div id="body-content">
        {init ? (
          userId === userObj.uid ? (
            <UserProfile
              userObj={userObj}
              userData={userObj}
              handleUserUpdate={handleUserUpdate}
              handleEditModalOpen={handleEditModalOpen}
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
          ) : (
            <UserProfile
              userObj={userObj}
              userData={userData}
              handleUserDataUpdate={handleUserDataUpdate}
              handleUserUpdate={handleUserUpdate}
              // handleEditModalOpen={handleEditModalOpen}
              // isEditProfileModalOpen={isEditProfileModalOpen}
              // handleEditModalClose={handleEditModalClose}
              // onChangeDisplayName={onChangeDisplayName}
              // onChangeBio={onChangeBio}
              // newDisplayName={newDisplayName}
              // newBio={newBio}
              // profileAttachment={profileAttachment}
              // onProfileFileChange={onProfileFileChange}
              // profileFileInput={profileFileInput}
              // headerAttachment={headerAttachment}
              // onHeaderFileChange={onHeaderFileChange}
              // headerFileInput={headerFileInput}
              // onSubmit={onSubmit}
            />
          )
        ) : (
          <div className="loading__container">
            <FontAwesomeIcon className="loading" icon={faCog} spin size="3x" />
          </div>
        )}
      </div>
      <div className="mobile">
        <SideSection userObj={userObj} pageUserId={userId} />
      </div>
    </main>
  );
};

export default Profile;
