import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import ProfilePhoto from "./ProfilePhoto";

const FollowerList = ({ hover, userData }) => {
  const [followerUsers, setFollowerUsers] = useState([]);
  useEffect(() => {
    const q = query(
      collection(dbService, "users"),
      where("following", "array-contains", userData.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const followerArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFollowerUsers(followerArr);
    });

    onAuthStateChanged(authService, (user) => {
      if (user === null) {
        unsubscribe();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userData.uid]);

  return (
    followerUsers && (
      <div className="followList__box">
        {followerUsers.length > 0 ? (
          followerUsers.map((user) => (
            <div key={user.uid}>
              <NavLink to={`/${user.uid}`}>
                <div className={`follow ${hover}`}>
                  <div className="follow__userImg">
                    <ProfilePhoto photoURL={user.photoURL} />
                  </div>
                  <div className="follow__userInfo">
                    <div className="follow__userInfo__userName">
                      {user.displayName}
                    </div>
                    <div className="follow__userInfo__userId">
                      @{user.email.substring(0, user.email.indexOf("@"))}
                    </div>
                    <div className="follow__userInfo__userBio">{user.bio}</div>
                  </div>
                </div>
              </NavLink>
            </div>
          ))
        ) : (
          <div className="follow--nothing">
            <FontAwesomeIcon icon={faUserSlash} size="2x" />
            <div className="follow--nothing__info">
              <h4 className="follow--nothing__info__userName">
                {userData.displayName}
              </h4>
              님을 팔로우하는 유저가 없습니다.
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default FollowerList;
