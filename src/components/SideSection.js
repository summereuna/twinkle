import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faTwitter,
  faVimeoV,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService } from "fbase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import SearchModal from "./Modal/SearchModal";
import Recommendation from "./Recomendation";

const SideSection = ({ userObj }) => {
  const [loading, setLoading] = useState();

  //유저 데이터
  const currentUserUid = userObj.uid;
  const [allUserWithoutCurrentUser, setAllUserWithoutCurrentUser] = useState(
    []
  );
  const [randomUserList, setRandomUserList] = useState([]);

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

    //현재 로그인한 유저가 팔로우한 유저 id 배열 가져오기
    const userObjFollowingArr = userObj.following;

    //추천 유저 필터링
    let filterArr = allUserWithoutCurrentUserList.filter((user) => {
      //현재 보고 있는 프로필 페이지의 유저는 추천리스트에 포함시키지 않기
      //이거 쓰면 팔로우 3명 남았을 때 부터 에러 먹기 시작하는데 이유가 이 유저를 추천리스트에 포함시키지 않기 때문에 userObjFollowingArr.length 측정하는데 오류 발생하기 때문인듯
      //그래서 안되기 때문에 예외 사항을 더 주든지 해야함

      //   // //이제 괜찮긴 하네;;; 근데 바로바로 안뜸 ㅠㅠ
      //  if (){
      //   if (user.uid === pageUserId) {
      //     return false;
      //   }
      //  }

      //현재 로그인한 유저가 팔로우한 유저 제외한 나머지 유저 배열 가져오기
      return !userObjFollowingArr.includes(user.uid);
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
  }, [userObj.following]);

  //console.log("밖");
  useEffect(() => {
    //useEffect 무한 루프 돌아서 메모리 릭 발생해서 randomUserList 있는 조건으로 묶었다가
    //getUsers 디펜던시 배열에 넣어주고 조건 뺌
    setLoading(true);
    getUsers();
    console.log("랜덤유저 가져오기");

    return () => {
      setLoading(false);
    };
  }, [getUsers]);
  //pageUserId
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
    if (!isModalOpen) {
      setIsModalOpen((prev) => !prev);
    }
  };

  const handleModalClose = () => {
    if (isModalOpen) {
      setIsModalOpen((prev) => !prev);
      setSearch("");
    }
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
                  autoComplete="off"
                  placeholder="트윙클 검색"
                  onChange={onChange}
                  value={search}
                  className="side__search__container__search__form__input"
                  onClick={handleModalOpen}
                />
              </label>
            </div>
          </form>
          <div className="side__search__container__search__modal">
            <SearchModal
              handleModalClose={handleModalClose}
              isModalOpen={isModalOpen}
              hover={"hover--bg--light"}
              filterKeywordArr={filterKeywordArr}
              searchKeyword={search}
            ></SearchModal>
          </div>
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
      <footer>
        <FontAwesomeIcon icon={faEnvelope} />
        <span> summereuna@gmail.com</span>
        <span> | </span>
        <a
          href="https://github.com/summereuna"
          rel="noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={faGithub} />
          <span> github</span>
        </a>
        <span> | </span>
        <a href="https://velog.io/@summereuna" rel="noreferrer" target="_blank">
          <FontAwesomeIcon icon={faVimeoV} />
          <span> blog</span>
        </a>
        <p>
          <span>&copy; {new Date().getFullYear()} Twinkle</span>
          <span> | </span>
          <span>Twitter 클론 사이트 </span>
          <FontAwesomeIcon icon={faTwitter} />
        </p>
      </footer>
    </div>
  );
};

export default SideSection;
