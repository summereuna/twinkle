import { authService, dbService } from "fbase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

//아직 데이터 못 받아 오는 중
const FollowBtn = ({ thisUserId }) => {
  const myId = authService.currentUser.uid;

  //팔로우 버튼 토글
  const [isFollow, setIsFollow] = useState(false);

  //팔로우
  //상대방 팔로워 목록에 내 아이디 추가 (상대방 팔로워 +1)
  const increaseFollowerInOther = async () => {
    const userDocRef = doc(dbService, "users", thisUserId);

    await updateDoc(userDocRef, {
      follower: arrayUnion(`${myId}`),
    });
  };

  //내 팔로잉 목록에 내가 추가한 상대 아이디 추가 (내 팔로잉 +1)
  const addFollow = async () => {
    const userRef = doc(dbService, "users", myId);

    await updateDoc(userRef, {
      following: arrayUnion(`${thisUserId}`),
    });
  };

  //팔로우 취소
  //상대방 팔로워 목록에 내 아이디 빼기 (상대방 팔로워 -1)
  const decreaseFollowerInOther = async () => {
    const userDocRef = doc(dbService, "users", thisUserId);

    await updateDoc(userDocRef, {
      follower: arrayRemove(`${myId}`),
    });
  };

  //내 팔로잉 목록에 팔로우 취소한 상대 아이디 빼기 (내 팔로잉 -1)
  const removeFollow = async () => {
    const userRef = doc(dbService, "users", myId);

    await updateDoc(userRef, {
      following: arrayRemove(`${thisUserId}`),
    });
  };

  //팔로우 버튼 토글
  const toggleFollowBtn = async () => {
    if (!isFollow) {
      increaseFollowerInOther();
      addFollow();
      setIsFollow((prev) => !prev);
    } else {
      decreaseFollowerInOther();
      removeFollow();
      setIsFollow((prev) => !prev);
    }
  };

  //useEffect 사용해서 팔로우 버튼 색깔 유지
  useEffect(() => {
    async function fetchData() {
      const usersFollowingRef = doc(dbService, "users", thisUserId);
      const usersFollowingSnap = await getDoc(usersFollowingRef);
      const usersFollowingUsers = usersFollowingSnap.data().follower;

      if (usersFollowingUsers.includes(myId)) {
        setIsFollow(true);
      } else {
        setIsFollow(false);
      }
    }
    fetchData();
  }, []);

  const [isBtnHover, setIsBtnHover] = useState(false);

  //scss클래스 아직 추가 안함
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
