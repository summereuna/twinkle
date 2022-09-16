import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService } from "fbase";
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
    //snapshot은 쿼리 같은 건데 docs를 가지고 있다.
    //tweets은 페이지를 불러올 때 snapshot에서 나오는 거다.
    const q = query(
      collection(dbService, "users"),
      where("following", "array-contains", userData.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      //모든 docs는 {} 오브젝트 반환하도록
      //아이디 가져오고, 그리고 나머지 데이터 전체 가져오기
      const followerArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //트윗어레이 확인해보자. 오케이 원하는대로 포맷된것을 확인할 수 있다!
      //console.log(followerArr);
      setFollowerUsers(followerArr);
    });
    return () => {
      unsubscribe(); //stop listening to changes
    };
  }, [userData.uid]);

  return (
    followerUsers && (
      <div>
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
