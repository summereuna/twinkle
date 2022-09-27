import { faArrowLeft, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfilePhoto from "components/ProfilePhoto";
import SearchBar from "components/SearchBar";
import SideSection from "components/SideSection";
import Tweet from "components/Tweet";
import { dbService } from "fbase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";

const Explore = ({ userObj }) => {
  const [isInExplore, setIsInExplore] = useState(false);
  //console.log(isInExplore);
  //
  const [loading, setLoading] = useState();
  //유저 데이터
  const currentUserUid = userObj.uid;
  const [allUserWithoutCurrentUser, setAllUserWithoutCurrentUser] = useState(
    []
  );

  const getUsers = useCallback(async () => {
    //현재 로그인한 유저 본인 제외한 유저 전체 배열 가져오기
    const usersRef = collection(dbService, "users");
    const usersQuery = query(
      usersRef,
      where("uid", "not-in", [currentUserUid])
    );
    const querySnapshot = await getDocs(usersQuery);

    //전체 사용자 어레이
    const allUserWithoutCurrentUserList = querySnapshot.docs.map((doc) =>
      doc.data()
    );
    setAllUserWithoutCurrentUser(allUserWithoutCurrentUserList);
  }, [currentUserUid]);

  useEffect(() => {
    //useEffect 무한 루프 돌아서 메모리 릭 발생해서 randomUserList 있는 조건으로 묶었다가
    //getUsers 디펜던시 배열에 넣어주고 조건 뺌
    setLoading(true);
    setIsInExplore(true);
    getUsers();
    console.log("랜덤유저 가져오기");

    return () => {
      setLoading(false);
    };
  }, [getUsers]);

  return (
    userObj && (
      <main>
        <div id="body-content">
          <div className="explore__container">
            <div className="explore__title">
              <div className="explore__title__container">
                <SearchBar
                  allUserWithoutCurrentUser={allUserWithoutCurrentUser}
                  isInExplore={isInExplore}
                />
              </div>
            </div>

            <div className="explore__main-container">
              <div className="explore__main__title">
                <h1 className="explore__main__title__title">모든 유저</h1>
              </div>

              <div className="exploreList">
                {allUserWithoutCurrentUser.length > 0 ? (
                  allUserWithoutCurrentUser.map((user) => (
                    <div key={user.uid}>
                      <NavLink to={`/${user.uid}`}>
                        <div className="explore hover--bg--deep">
                          <div className="explore__userImg">
                            <ProfilePhoto photoURL={user.photoURL} />
                          </div>
                          <div className="explore__userInfo">
                            <div className="explore__userInfo__userName">
                              {user.displayName}
                            </div>
                            <div className="explore__userInfo__userId">
                              @
                              {user.email.substring(0, user.email.indexOf("@"))}
                            </div>
                            <div className="explore__userInfo__userBio">
                              {user.bio}
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    </div>
                  ))
                ) : (
                  <div className="explore--nothing">
                    <FontAwesomeIcon icon={faUserSlash} size="2x" />
                    <div className="explore--nothing__info">
                      유저가 없습니다.
                    </div>
                  </div>
                )}
              </div>

              <div className="explore__main__title">
                <h1 className="explore__main__title__title">인기 있는 트윗</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile">
          <SideSection userObj={userObj} isInExplore={isInExplore} />
        </div>
      </main>
    )
  );
};

export default Explore;
