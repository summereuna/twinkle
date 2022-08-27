import { NavLink } from "react-router-dom";
import FollowBtn from "./FollowBtn";

import ProfilePhoto from "./ProfilePhoto";

const Recommendation = ({ userList, hover }) => {
  return (
    <div>
      {userList.map((user) => (
        <div key={user.id}>
          <NavLink to={user.id} end>
            <div className={`recommendation ${hover}`}>
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
                <FollowBtn otherUser={user} />
              </div>
            </div>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default Recommendation;
