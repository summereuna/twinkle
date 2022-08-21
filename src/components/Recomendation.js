import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ProfilePhoto from "./ProfilePhoto";

const Recommendation = ({ userList }) => {
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
