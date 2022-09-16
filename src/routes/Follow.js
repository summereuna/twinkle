import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FollowerList from "components/FollowerList";
import FollowingList from "components/FollowingList";
import SideSection from "components/SideSection";
import { dbService } from "fbase";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const Follow = ({ userObj, state }) => {
  const [init, setInit] = useState(false);
  const pageUserId = useParams().id;

  const [userData, setUserData] = useState({});

  const getPageUserProfiles = useCallback(async () => {
    const usersRef = doc(dbService, "users", pageUserId);
    const usersSnap = await getDoc(usersRef);
    const userDataObj = usersSnap.data();
    setUserData(userDataObj);
  }, [pageUserId]);

  useEffect(() => {
    setInit(true);
    getPageUserProfiles();
    console.log("🔥");
    return () => {
      setInit(false);
    };
  }, [getPageUserProfiles]);

  return (
    <main>
      {userData.uid && (
        <>
          <div id="body-content">
            <div className="profile__container">
              <div className="profile__title">
                <div className="profile__title__container">
                  <NavLink to={`/${userData.uid}`}>
                    <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                  </NavLink>
                  <div className="profile__title__user">
                    <h1 className="profile__title__username">
                      {userData.displayName}
                    </h1>
                    <h4 className="profile__title__userId">
                      @
                      {userData.email?.substring(
                        0,
                        userData.email?.indexOf("@")
                      )}
                    </h4>
                  </div>
                </div>

                <nav className="nav-tab">
                  <div className="nav-tab__div">
                    <div className="nav-tab__div__div">
                      <ul className="nav-tab__list">
                        <li className="nav-tab__list__presentation">
                          <NavLink
                            to={`/${userData.uid}/follower`}
                            end
                            className={({ isActive }) =>
                              isActive ? "tab-on" : undefined
                            }
                          >
                            <div className="nav-tab__list__presentation__a">
                              <div className="nav-tab__list__presentation__a__text-box">
                                <span className="nav-tab__list__presentation__a__text-box__name">
                                  팔로워
                                </span>
                              </div>
                            </div>
                          </NavLink>
                        </li>

                        <li className="nav-tab__list__presentation">
                          <NavLink
                            to={`/${userData.uid}/following`}
                            className={({ isActive }) =>
                              isActive ? "tab-on" : undefined
                            }
                          >
                            <div className="nav-tab__list__presentation__a">
                              <div className="nav-tab__list__presentation__a__text-box">
                                <span className="nav-tab__list__presentation__a__text-box__name">
                                  팔로잉
                                </span>
                                <div className="nav-tab__list__presentation__a__text-box__line"></div>
                              </div>
                            </div>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>

              <div className="followList">
                {state === "following" ? (
                  <FollowingList
                    hover={"hover--bg--deep"}
                    userData={userData}
                  />
                ) : (
                  <FollowerList hover={"hover--bg--deep"} userData={userData} />
                )}
              </div>
            </div>
          </div>

          <div className="mobile">
            <SideSection userObj={userObj} />
          </div>
        </>
      )}
    </main>
  );
};

export default Follow;
