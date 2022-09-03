import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService } from "fbase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchModal from "./Modal/SearchModal";
import Recommendation from "./Recomendation";

const SideSection = (userObj) => {
  const [loading, setLoading] = useState();

  //유저 데이터
  const currentUserUid = authService.currentUser.uid;

  const [allUserWithoutCurrentUser, setAllUserWithoutCurrentUser] = useState(
    []
  );
  const [randomUserList, setRandomUserList] = useState([]);

  const getUsers = async () => {
    //현재 로그인한 유저 본인 제외한 유저 전체 배열 가져오기
    const usersRef = collection(dbService, "users");
    const usersQuery = query(
      usersRef,
      where("uid", "not-in", [currentUserUid])
    );
    const querySnapshot = await getDocs(usersQuery);

    //전체 사용자 어레이
    const allUserWithoutCurrentUserList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      displayName: doc.data().displayName,
      bio: doc.data().bio,
      email: doc.data().email,
      photoURL: doc.data().photoURL,
    }));

    setAllUserWithoutCurrentUser(allUserWithoutCurrentUserList);

    //현재 로그인한 유저가 팔로우한 유저 id 배열 가져오기
    const userObjFollowingArr = userObj.userObj.following;
    //console.log(userObjFollowingArr);

    //현재 로그인한 유저가 팔로우한 유저 제외한 나머지 유저 배열 가져오기
    let filterArr = allUserWithoutCurrentUserList.filter((user) => {
      return !userObjFollowingArr.includes(user.id);
    });

    //console.log("🔥", filterArr);
    if (allUserWithoutCurrentUserList.length - userObjFollowingArr.length > 2) {
      //그 중에서 유저 3명 무작위 추첨
      let randomUsersArr = [];

      for (let i = 1; i <= 3; i++) {
        const randomUsers =
          filterArr[Math.floor(Math.random() * filterArr.length)];

        //중복 제거
        if (randomUsersArr.indexOf(randomUsers) === -1) {
          randomUsersArr.push(randomUsers);
        } else {
          i--;
        }
      }

      setRandomUserList(randomUsersArr);
    } else if (
      allUserWithoutCurrentUserList.length - userObjFollowingArr.length >
      1
    ) {
      //그 중에서 유저 3명 무작위 추첨
      let randomUsersArr = [];

      for (let i = 1; i <= 2; i++) {
        const randomUsers =
          filterArr[Math.floor(Math.random() * filterArr.length)];

        //중복 제거
        if (randomUsersArr.indexOf(randomUsers) === -1) {
          randomUsersArr.push(randomUsers);
        } else {
          i--;
        }
      }

      setRandomUserList(randomUsersArr);
    } else if (
      allUserWithoutCurrentUserList.length - userObjFollowingArr.length >
      0
    ) {
      //그 중에서 유저 3명 무작위 추첨
      let randomUsersArr = [];

      for (let i = 1; i <= 1; i++) {
        const randomUsers =
          filterArr[Math.floor(Math.random() * filterArr.length)];

        //중복 제거
        if (randomUsersArr.indexOf(randomUsers) === -1) {
          randomUsersArr.push(randomUsers);
        } else {
          i--;
        }
      }

      setRandomUserList(randomUsersArr);
    }

    //console.log("팔로우 추천");
  };

  //console.log("밖");
  useEffect(() => {
    //useEffect 무한 루프 돌아서 메모리 릭 발생해서 조건 묶음
    if (randomUserList) {
      setLoading(true);
      getUsers();
      console.log("랜덤유저 가져오기");
    }
    return () => {
      setLoading(false);
    };
  }, []);

  //검색
  const [search, setSearch] = useState("");

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setSearch(value);
  };

  //검색 필터
  const filterKeywordArr = allUserWithoutCurrentUser.filter((user) => {
    const username = user.displayName
      .replace(" ", "")
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase().replace(" ", ""));
    const emailId = user.email.substring(0, user.email.indexOf("@"));
    const userId = emailId
      .replace(" ", "")
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase().replace(" ", ""));
    //console.log("필터");
    return search && (username || userId);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    //🌟 페이지 바뀌게: 나중에 할 것
  };

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearch("");
  };

  return (
    <div className="side__container">
      <div className="side__search__container">
        <div className="side__search__container__search">
          <form
            onSubmit={onSubmit}
            className="side__search__container__search__form"
          >
            <div className="side__search__container__search__form__div">
              <label htmlFor="searchInput">
                <button
                  type="submit"
                  className="side__search__container__search__form__btn"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                <input
                  id="searchInput"
                  type="text"
                  placeholder="트윙클 검색"
                  onChange={onChange}
                  value={search}
                  className="side__search__container__search__form__input"
                  onClick={handleModalOpen}
                />
              </label>
            </div>
          </form>
          <SearchModal
            handleModalClose={handleModalClose}
            isModalOpen={isModalOpen}
            hover={"hover--bg--light"}
            filterKeywordArr={filterKeywordArr}
            searchKeyword={search}
          ></SearchModal>
        </div>
      </div>
      <div className="side__search-box"></div>

      <div className="side-box">
        <div className="side__trends">
          <h2>나를 위한 트렌드</h2>
          <div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="side-box">
        <div className="side_recommendation">
          <h2>팔로우 추천</h2>
          <Recommendation hover={"hover--bg--deep"} userList={randomUserList} />
        </div>
      </div>
    </div>
  );
};

export default SideSection;
