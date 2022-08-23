import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService } from "fbase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchModal from "./Modal/SearchModal";
import Recommendation from "./Recomendation";

const SideSection = () => {
  //유저 데이터
  const [allUser, setAllUser] = useState([]);
  const [randomUserList, setRandomUserList] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      //전체 사용자 가져오기
      const querySnapshot = await getDocs(collection(dbService, "users"));

      //전체 사용자 어레이
      const allUserList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName,
        email: doc.data().email,
        photoURL: doc.data().photoURL,
      }));

      setAllUser(allUserList);
      //유저 3명 무작위 추첨
      let randomUsersArr = [];

      for (let i = 1; i <= 3; i++) {
        const randomUsers =
          allUserList[Math.floor(Math.random() * allUserList.length)];
        //중복 제거
        if (randomUsersArr.indexOf(randomUsers) === -1) {
          randomUsersArr.push(randomUsers);
        } else {
          i--;
        }
      }
      setRandomUserList(randomUsersArr);
      //console.log(allUserList);
      //console.log(randomUserList);
    };

    getUsers();
    return () => {
      getUsers(); //stop listening to changes
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
  const filterKeywordArr = allUser.filter((user) => {
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
