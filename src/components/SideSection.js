import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faGithub,
  faTwitter,
  faVimeoV,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService } from "fbase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import Recommendation from "./Recomendation";
import SearchBar from "./SearchBar";

const SideSection = ({ userObj, isInExplore }) => {
  const [loading, setLoading] = useState(false);

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

    //사용자 어레이
    const allUserWithoutCurrentUserList = querySnapshot.docs.map((doc) =>
      doc.data()
    );

    setAllUserWithoutCurrentUser(allUserWithoutCurrentUserList);

    //현재 로그인한 유저가 팔로우한 유저 id 배열 가져오기
    const userObjFollowingArr = userObj.following;

    //추천 유저 필터링
    let filterArr = allUserWithoutCurrentUserList.filter((user) => {
      //현재 로그인한 유저가 팔로우한 유저 제외한 나머지 유저 배열 가져오기
      return !userObjFollowingArr.includes(user.uid);
    });

    //userObjFollowingArr.length 에 따른 추첨
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
  }, [userObj.following]);

  useEffect(() => {
    setLoading(true);
    getUsers();

    return () => {
      setLoading(false);
    };
  }, [getUsers]);

  return (
    <div className="side__container">
      <div className={`side__search__container ${isInExplore ? "" : "show"}`}>
        <SearchBar
          allUserWithoutCurrentUser={allUserWithoutCurrentUser}
          isInExplore={isInExplore}
        />
      </div>
      <div className={`side__search-box ${isInExplore ? "" : "show"}`}></div>
      {/* <div className="side-box">
        <div className="side__trends">
          <h2>나를 위한 트렌드</h2>
          <div>
            <div></div>
          </div>
        </div>
      </div> */}
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
