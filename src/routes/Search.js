import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "components/SearchBar";
import SearchUser from "components/SearchUser";
import SideSection from "components/SideSection";
import { dbService } from "fbase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";

const Search = ({ userObj }) => {
  const [isInExplore, setIsInExplore] = useState(false);

  const [loading, setLoading] = useState();

  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get("q");

  console.log("💜searchKeyword", searchKeyword);

  const currentUserUid = userObj.uid;
  const [allUserWithoutCurrentUser, setAllUserWithoutCurrentUser] = useState(
    []
  );
  const [filterKeywordArr, setFilterKeywordArr] = useState([]);

  const getUsers = useCallback(async () => {
    //현재 로그인한 유저 본인 제외한 유저 전체 배열 가져오기
    const usersRef = collection(dbService, "users");
    const usersQuery = query(
      usersRef,
      where("uid", "not-in", [currentUserUid])
    );
    const querySnapshot = await getDocs(usersQuery);

    const allUserWithoutCurrentUserList = querySnapshot.docs.map((doc) =>
      doc.data()
    );
    console.log(
      "🍀필터할 유저 디비에서 가꼬온 리스트",
      allUserWithoutCurrentUserList
    );
    setAllUserWithoutCurrentUser(allUserWithoutCurrentUserList);
    console.log("🌸필터할 유저 어레이", allUserWithoutCurrentUser);
    //let filterKeywords = [...filterKeywordArr];

    const filterKeywords = allUserWithoutCurrentUserList.filter((user) => {
      const username = user.displayName
        .replace(" ", "")
        .toLocaleLowerCase()
        .includes(searchKeyword.toLocaleLowerCase().replace(" ", ""));
      const emailId = user.email.substring(0, user.email.indexOf("@"));
      const userId = emailId
        .replace(" ", "")
        .toLocaleLowerCase()
        .includes(searchKeyword.toLocaleLowerCase().replace(" ", ""));
      console.log("필터");
      return searchKeyword && (username || userId);
    });

    console.log("🔥filterKeywords", filterKeywords);

    setFilterKeywordArr(filterKeywords);
  }, [currentUserUid, searchKeyword]);

  useEffect(() => {
    setLoading(true);
    setIsInExplore(true);
    getUsers();
    console.log("랜덤유저 가져오기");

    return () => {
      setLoading(false);
    };
  }, [getUsers, searchKeyword]);

  return (
    userObj && (
      <main>
        <div id="body-content">
          <div className="searchPage__container">
            <div className="searchPage__title">
              <div className="searchPage__title__container">
                <div className="searchPage__title__icon">
                  <NavLink to="/">
                    <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                  </NavLink>
                </div>

                <div className="searchPage__title__searchBar">
                  <SearchBar
                    allUserWithoutCurrentUser={allUserWithoutCurrentUser}
                  />
                </div>
              </div>
            </div>

            <div className="searchPage__main-container">
              <div>
                {searchKeyword ? (
                  filterKeywordArr.length > 0 ? (
                    <SearchUser
                      hover={"hover--bg--light"}
                      userList={filterKeywordArr}
                    />
                  ) : (
                    <div className="modal-search-content__default">
                      {`'${searchKeyword}'에 대한 검색 결과가 없습니다.`}
                    </div>
                  )
                ) : (
                  <div className="modal-search-content__default">
                    사용자를 검색해보세요
                  </div>
                )}
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

export default Search;
