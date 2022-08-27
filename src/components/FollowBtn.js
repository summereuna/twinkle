import { authService, dbService } from "fbase";
import { doc, getDoc, increment, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";

//아직 데이터 못 받아 오는 중
const FollowBtn = ({ otherUser }) => {
  const user = authService.currentUser;
  const batch = writeBatch(dbService);

  const followUser = async () => {
    const followingRef = doc(
      dbService,
      "follow",
      user.uid,
      "following",
      otherUser.id
    );
    batch.setDoc(followingRef, {
      displayName: otherUser.displayName,
      photoURL: otherUser.photoURL,
      uid: otherUser.id,
    });

    const followerRef = doc(
      dbService,
      "follow",
      otherUser.id,
      "follower",
      user.uid
    );
    batch.setDoc(followerRef, {
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
    });

    const usersRef = doc(dbService, "users", user.uid);
    batch.update(usersRef, { following: increment(1) });

    const otherUsersRef = doc(dbService, "users", otherUser.id);
    batch.update(otherUsersRef, { follower: increment(1) });

    await batch.commit();

    /*
    await setDoc(
      doc(dbService, "follow", user.uid, "following", otherUser.id),
      {
        displayName: otherUser.displayName,
        photoURL: otherUser.photoURL,
        uid: otherUser.id,
      }
    );

    await setDoc(doc(dbService, "follow", otherUser.id, "follower", user.uid), {
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
    });

    const usersRef = doc(dbService, "users", user.uid);

    await updateDoc(usersRef, {
      following: increment(1),
    });
    const otherUsersRef = doc(dbService, "users", otherUser.id);

    await updateDoc(otherUsersRef, {
      follower: increment(1),
    });
    */
  };

  const unFollowUser = async () => {
    const followingRef = doc(
      dbService,
      "follow",
      user.uid,
      "following",
      otherUser.id
    );
    batch.delete(followingRef);

    const followerRef = doc(
      dbService,
      "follow",
      otherUser.id,
      "follower",
      user.uid
    );
    batch.delete(followerRef);

    const usersRef = doc(dbService, "users", user.uid);
    batch.update(usersRef, { following: increment(-1) });

    const otherUsersRef = doc(dbService, "users", otherUser.id);
    batch.update(otherUsersRef, { follower: increment(-1) });

    await batch.commit();
  };

  //팔로우 버튼 토글
  const [isFollow, setIsFollow] = useState();

  const toggleFollowBtn = async () => {
    if (!isFollow) {
      followUser();
      setIsFollow((prev) => !prev);
    } else {
      unFollowUser();
      setIsFollow((prev) => !prev);
    }
  };

  //useEffect 사용해서 팔로우 버튼 색깔 유지
  useEffect(() => {
    async function fetchData() {
      const usersFollowingRef = doc(dbService, "follow", user.uid, "following");
      const usersFollowingSnap = await getDoc(usersFollowingRef);
      const usersFollowingUsers = usersFollowingSnap.data().uid;

      if (usersFollowingUsers.includes(otherUser.id)) {
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
