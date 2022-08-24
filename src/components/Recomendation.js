import FollowBtn from "./FollowBtn";

import ProfilePhoto from "./ProfilePhoto";

const Recommendation = ({ userList, hover }) => {
  return (
    <div>
      {userList.map((user) => (
        <div key={user.id} className={`recommendation ${hover}`}>
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
            <FollowBtn />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendation;
