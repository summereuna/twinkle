import { NavLink } from "react-router-dom";

import ProfilePhoto from "./ProfilePhoto";

const SearchUser = ({ userList, hover, handleModalClose }) => {
  return (
    <div>
      {userList.map((user) => (
        <div key={user.uid} onClick={handleModalClose}>
          <NavLink to={`/${user.uid}`}>
            <div className={`searchUser ${hover}`}>
              <div className="searchUser__userImg">
                <ProfilePhoto photoURL={user.photoURL} />
              </div>
              <div className="searchUser__userInfo">
                <div className="searchUser__userInfo__userName">
                  {user.displayName}
                </div>
                <div className="searchUser__userInfo__userId">
                  @{user.email.substring(0, user.email.indexOf("@"))}
                </div>
                <div className="searchUser__userInfo__userBio">{user.bio}</div>
              </div>
            </div>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default SearchUser;
