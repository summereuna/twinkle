import { NavLink } from "react-router-dom";
import ProfilePhoto from "./ProfilePhoto";

const Recommendation = ({ userList, hover }) => {
  return (
    <div>
      {userList.length > 0 ? (
        userList.map((user) => (
          <div key={user.uid}>
            <NavLink to={`/${user.uid}`}>
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
                <div className="recommendation__btn"></div>
              </div>
            </NavLink>
          </div>
        ))
      ) : (
        <div className="recommendation no-recommendation">
          <span>추천할 유저가 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default Recommendation;
