import { authService, dbService } from "fbase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const FollowBtn = ({
  userObj,
  userData,
  handleUserUpdate,
  handleUserDataUpdate,
}) => {
  //const myId = authService.currentUser.uid;
  const myId = userObj.uid;
  //팔로우 버튼 토글
  const [isFollow, setIsFollow] = useState(false);

  //팔로우
  //상대방 팔로워 목록에 내 아이디 추가 (상대방 팔로워 +1)
  const increaseFollowerInOther = async () => {
    const userDocRef = doc(dbService, "users", userData.uid);

    await updateDoc(userDocRef, {
      follower: arrayUnion(`${myId}`),
    });
  };

  //내 팔로잉 목록에 내가 추가한 상대 아이디 추가 (내 팔로잉 +1)
  const addFollow = async () => {
    const userRef = doc(dbService, "users", myId);

    await updateDoc(userRef, {
      following: arrayUnion(`${userData.uid}`),
    });
  };

  //userObj 팔로잉 항목에 상대 id 추가
  const addUserFollowingList = () => {
    const oldUserObj = { ...userObj };
    const oldUserObjFollowing = oldUserObj.following;
    if (oldUserObjFollowing) {
      const newUserObjFollowingList = oldUserObjFollowing.concat(userData.uid);
      const userObjUpdate = {
        ...oldUserObj,
        following: newUserObjFollowingList,
      };
      handleUserUpdate(userObjUpdate);
    }
  };

  //userData obj 팔로워 항목에 내 id 추가
  const addUserFollowerList = () => {
    const oldUserData = { ...userData };
    const oldUserDataFollower = oldUserData.follower;
    if (oldUserDataFollower) {
      const newUserDataFollowerList = oldUserDataFollower.concat(myId);
      const userDataUpdate = {
        ...oldUserData,
        follower: newUserDataFollowerList,
      };
      handleUserDataUpdate(userDataUpdate);
    }
  };

  //팔로우 취소
  //상대방 팔로워 목록에 내 아이디 빼기 (상대방 팔로워 -1)
  const decreaseFollowerInOther = async () => {
    const userDocRef = doc(dbService, "users", userData.uid);

    await updateDoc(userDocRef, {
      follower: arrayRemove(`${myId}`),
    });
  };

  //내 팔로잉 목록에 팔로우 취소한 상대 아이디 빼기 (내 팔로잉 -1)
  const removeFollow = async () => {
    const userRef = doc(dbService, "users", myId);

    await updateDoc(userRef, {
      following: arrayRemove(`${userData.uid}`),
    });
  };

  //userObj 팔로잉 항목에 상대 id 제거
  const removeUserFollowingList = () => {
    const oldUserObj = { ...userObj };
    const oldUserObjFollowing = oldUserObj.following;

    if (oldUserObjFollowing) {
      const newUserObjFollowingList = oldUserObjFollowing.filter((userId) => {
        return userId !== userData.uid;
      });
      const userObjUpdate = {
        ...oldUserObj,
        following: newUserObjFollowingList,
      };
      handleUserUpdate(userObjUpdate);
    }
  };

  //userData obj 팔로워 항목에서 내 id 제거
  const removeUserFollowerList = () => {
    const oldUserData = { ...userData };
    const oldUserDataFollower = oldUserData.follower;

    if (oldUserDataFollower) {
      const newUserDataFollowerList = oldUserDataFollower.filter((userId) => {
        return userId !== myId;
      });
      const userDataUpdate = {
        ...oldUserData,
        follower: newUserDataFollowerList,
      };
      handleUserDataUpdate(userDataUpdate);
    }
  };

  //팔로우 버튼 토글
  const toggleFollowBtn = async () => {
    console.log(
      "프로필 버튼 컴포넌트 userData",
      "💜",
      userData.displayName,
      " : ",
      userData.follower
    );
    console.log("전", userData.follower);
    if (!isFollow) {
      increaseFollowerInOther();
      addFollow();
      addUserFollowingList();
      addUserFollowerList();
      setIsFollow((prev) => !prev);
    } else {
      decreaseFollowerInOther();
      removeFollow();
      removeUserFollowingList();
      removeUserFollowerList();
      setIsFollow((prev) => !prev);
    }
    console.log("후", userData.follower);
  };

  //useEffect 사용해서 팔로우 버튼 색깔 유지
  useEffect(() => {
    async function fetchData() {
      const usersFollowingRef = doc(dbService, "users", userData.uid);
      const usersFollowingSnap = await getDoc(usersFollowingRef);
      const usersFollowingUsers = usersFollowingSnap.data().follower;

      console.log("ㅇ", usersFollowingUsers.includes(myId));
      //8번 리렌더링

      if (usersFollowingUsers.includes(myId)) {
        setIsFollow(true);
      } else {
        setIsFollow(false);
      }
    }

    //인덱스 에러 방지
    if (userData.uid) {
      fetchData();
    }
  }, [myId, userData.uid]);

  const [isBtnHover, setIsBtnHover] = useState(false);

  return (
    <div
      className={`follow-btn ${
        isFollow
          ? isBtnHover
            ? "follow-btn--red"
            : "follow-btn--white"
          : "follow-btn--black"
      }`}
      onClick={toggleFollowBtn}
      onMouseOver={() => setIsBtnHover(true)}
      onMouseOut={() => setIsBtnHover(false)}
    >
      <span className="follow-btn__text">
        {isFollow ? (isBtnHover ? "언팔로우" : "팔로잉") : "팔로우"}
      </span>
    </div>
  );
};

export default FollowBtn;
