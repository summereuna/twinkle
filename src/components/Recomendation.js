import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService } from "fbase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import ProfilePhoto from "./ProfilePhoto";

const Recommendation = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      //전체 사용자 가져오기
      const querySnapshot = await getDocs(collection(dbService, "users"));
      const userArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName,
        email: doc.data().email,
        photoURL: doc.data().photoURL,
      }));

      //유저 3명 무작위 추첨
      let randomUsersArr = [];

      for (let i = 1; i <= 3; i++) {
        const randomUsers = userArr[Math.floor(Math.random() * userArr.length)];
        //중복 제거
        if (randomUsersArr.indexOf(randomUsers) === -1) {
          randomUsersArr.push(randomUsers);
        } else {
          i--;
        }
      }
      setUserList(randomUsersArr);
      //console.log(userList);
    };

    getUsers();
    return () => {
      getUsers(); //stop listening to changes
    };
  }, []);

  return (
    <div>
      {userList.map((user) => (
        <div key={user.id} className="recommendation">
          <div className="recommendation__userImg">
            <ProfilePhoto photoURL={user.photoURL} />
          </div>
          <div className="recommendation__userInfo">
            <div className="recommendation__userInfo__userName">
              {user.displayName}
            </div>
            <div className="recommendation__userInfo__userId">
              @{user.email.substring(0, user.email.indexOf("@"))}
            </div>
          </div>
          <div className="recommendation__btn">
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendation;
