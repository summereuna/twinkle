import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService } from "fbase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchModal from "./Modal/SearchModal";
import Recommendation from "./Recomendation";

const SideSection = () => {
  const [loading, setLoading] = useState();

  //유저 데이터
  const [allUserWithoutCurrentUser, setAllUserWithoutCurrentUser] = useState(
    []
  );
  const [randomUserList, setRandomUserList] = useState([]);
  const currentUserUid = authService.currentUser.uid;

  const getUsers = async () => {
    //전체 사용자 가져오기
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
      email: doc.data().email,
      photoURL: doc.data().photoURL,
    }));

    /*setAllUserWithoutCurrentUser(allUserWithoutCurrentUserList);
    //console.log(allUserWithoutCurrentUserList);
    //유저 3명 무작위 추첨
    let randomUsersArr = [];

    for (let i = 1; i <= 3; i++) {
      const randomUsers =
        allUserWithoutCurrentUserList[
          Math.floor(Math.random() * allUserWithoutCurrentUserList.length)
        ];

      //중복 제거
      if (randomUsersArr.indexOf(randomUsers) === -1) {
        randomUsersArr.push(randomUsers);
      } else {
        i--;
      }
    }
    setRandomUserList(randomUsersArr);*/
    //메모리 릭 발생해서 일단 이렇게 커밋
    setRandomUserList(allUserWithoutCurrentUserList);
  };
  console.log("밖");
  useEffect(() => {
    setLoading(true);
    getUsers();
    console.log("dhoㅇㄴㄹㅁㅇㄴㄹㅁㅇㄴㄹㅁㅇㄴ");
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
    console.log("필터");
    return search && (username || userId);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    //페이지 바뀌게
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
