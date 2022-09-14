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

//로그인한 유저 정보 prop으로 받기
const Profile = ({ refreshUser, userObj, handleUserUpdate }) => {
  //prop으로 받은 userObj는 currentUser의 user Collection data
  //아래 userData state에 있는 유저 오브젝트는 param에 따른 유저 데이터로 유저별 프로필 정보

  //✅ 프로필 사용자 정보 받아오기
  const userId = useParams().id;

  const [init, setInit] = useState(false);
  //state에 어떤 타입의 데이터가 들어올지 디폴트를 작성해 두면 state가 업데이트 되기전 에러를 출력하지 않음
  //그리고 && 연산자 적극 사용하자
  const [userData, setUserData] = useState({});

  const getProfiles = useCallback(async () => {
    const usersRef = doc(dbService, "users", userId);
    const usersSnap = await getDoc(usersRef);
    const userDataObj = usersSnap.data();
    setUserData(userDataObj);
    console.log("괜찮니");
  }, [userId]);
  //userId 파람 디펜던시에 넣으면 다른 유저 선택시 페이지 리렌더링 된다.

  //userData 팔로우 클릭시 setUserData 실행
  const handleUserDataUpdate = (newUserData) => {
    setUserData(newUserData);
  };

  useEffect(() => {
    setInit(true);
    getProfiles();
    console.log("🔥유즈이펙트");
    return () => {
      setInit(false);
    };
  }, [getProfiles]);
  //param 바뀌는거에 따라 getProfiles에서 유저 프로필 데이터를 구해오니까 getProfiles 함수를 디펜던시에 넣으면 다른 유저 선택시 페이지 리렌더링 된다.

  console.log("🍎밖", userData.uid);
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

      const updatedUserObj = { ...userObj };

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

        //userObj state 변경
        updatedUserObj.displayName = newDisplayName;
      }

      //자기소개 업데이트
      if (userObj.bio !== newBio) {
        await updateDoc(userCollectionRef, { bio: newBio });
        console.log("✅ 자기소개 업데이트");

        //userObj state 변경
        updatedUserObj.bio = newBio;
      }

      //프로필 사진 업데이트
      if (userObj.photoURL !== profileAttachment) {
        //프로필 사진 업데이트 시 이미 프로필 사진이 있다면 기존 사진 파일은 스토리지에서 삭제
        const desertRef = ref(storageService, userObj.photoURL);

        //소셜로그인시 스토리지에 사진 따로 저장 안되기 때문에 오류 발생해서 그냥 소셜로그인시 사진 안 받아오게 바꿈
        //이건 뭐 방법을 모르겠음 일단 자잘한건 드랍하고 다른거 먼저 하자고
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
        console.log("✅", profileAttachment);
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

        //userObj state 변경
        updatedUserObj.photoURL = profileAttachmentUrl;
        console.log("바뀐거", userObj.photoURL === profileAttachmentUrl);
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

        //userObj state 변경
        updatedUserObj.headerURL = attachmentUrl;
      }
      //프로필 페이지에 있는 userData 새로고침

      //프로필 수정 사항 있을 때만 react.js에 있는 profile도 새로고침되게 하기
      // refreshUser();
      handleUserUpdate(updatedUserObj);
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
    if (isEditProfileModalOpen) {
      setIsEditProfileModalOpen(false);
      onClearProfileAttachment();
      onClearHeaderAttachment();
      console.log("모달 클로즈");
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
