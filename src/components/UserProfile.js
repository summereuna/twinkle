import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Route, Routes } from "react-router-dom";
import ProfileSection from "routes/pages/ProfileSection";
import ProfileSectionLikes from "routes/pages/ProfileSectionLikes";
import ProfileSectionMedia from "routes/pages/ProfileSectionMedia";
import FollowBtn from "./FollowBtn";
import Header from "./Header";
import EditProfileModal from "./Modal/EditProfileModal";
import ProfilePhoto from "./ProfilePhoto";
import ProfileTab from "./ProfileTab";

const UserProfile = ({
  userObj,
  userData,
  handleUserDataUpdate,
  handleEditModalOpen,
  isEditProfileModalOpen,
  handleEditModalClose,
  onChangeDisplayName,
  onChangeBio,
  newDisplayName,
  newBio,
  profileAttachment,
  onProfileFileChange,
  profileFileInput,
  headerAttachment,
  onHeaderFileChange,
  headerFileInput,
  onSubmit,
  handleUserUpdate,
}) => {
  //유저 가입일

  let userCreatedAtTimestamp;
  if (userObj.uid !== userData.uid) {
    userCreatedAtTimestamp = Number(userData.createdAt);
  } else if (userObj.uid === userData.uid) {
    userCreatedAtTimestamp = Number(userObj.createdAt);
  }
  //타입이 string이어서 number로 바꿔줌
  const date = new Date(userCreatedAtTimestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const userCreatedAt = `${year}년 ${month}월 ${day}일`;
  console.log("과연");

  return (
    <div className="profile__container">
      <div className="profile__title">
        <div className="profile__title__container">
          <NavLink to="/">
            <FontAwesomeIcon icon={faArrowLeft} size="2x" />
          </NavLink>
          <div className="profile__title__user">
            <h1 className="profile__title__username">{userData.displayName}</h1>
          </div>
        </div>
      </div>
      <div className="profile__main-container">
        <div className="profile__user">
          <div className="profile__user__header">
            <Header headerURL={userData.headerURL} />
          </div>
          <div className="profile__user__info">
            <div className="profile__user__btns">
              <div className="profile__user__userImg">
                <div className="userImg--lg">
                  <div className="profile__user__userImg__file">
                    <ProfilePhoto photoURL={userData.photoURL} />
                  </div>
                </div>
              </div>
              {userData.uid === userObj.uid ? (
                <>
                  <button
                    className="btn btn--grey"
                    onClick={handleEditModalOpen}
                  >
                    프로필 수정
                  </button>
                  <EditProfileModal
                    userObj={userObj}
                    isEditProfileModalOpen={isEditProfileModalOpen}
                    handleEditModalClose={handleEditModalClose}
                    onChangeDisplayName={onChangeDisplayName}
                    onChangeBio={onChangeBio}
                    newDisplayName={newDisplayName}
                    newBio={newBio}
                    profileAttachment={profileAttachment}
                    onProfileFileChange={onProfileFileChange}
                    profileFileInput={profileFileInput}
                    headerAttachment={headerAttachment}
                    onHeaderFileChange={onHeaderFileChange}
                    headerFileInput={headerFileInput}
                    onSubmit={onSubmit}
                  />
                </>
              ) : (
                <div>
                  {
                    <FollowBtn
                      userObj={userObj}
                      userData={userData}
                      handleUserUpdate={handleUserUpdate}
                      handleUserDataUpdate={handleUserDataUpdate}
                    />
                  }
                </div>
              )}
            </div>
            <div className="profile__user__info__userName">
              <span className="profile__user__info__userName__name">
                {userData.displayName}
              </span>
              <span className="profile__user__info__userName__id">
                @{userData.email?.substring(0, userData.email?.indexOf("@"))}
              </span>
            </div>
            <div className="profile__user__info__userInfo">
              <div className="profile__user__info__userInfo__bio">
                <span>{userData.bio}</span>
              </div>
              <div className="profile__user__info__userInfo__createdAt">
                <span>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </span>
                <span> 가입일: {userCreatedAt}</span>
              </div>
            </div>
            <div className="profile__user__info__userMeta">
              <NavLink to="following">
                <div className="profile__user__info__userMeta__followList">
                  <span>
                    {userData.following?.length}
                    {userData.following?.length > 0 ? " 팔로우 중" : " 팔로우"}
                  </span>
                </div>
              </NavLink>
              <NavLink to="follower">
                <div className="profile__user__info__userMeta__followList">
                  <span> {userData.follower?.length} 팔로워</span>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
        <ProfileTab />
        {userData.uid && (
          <Routes>
            <Route
              path=""
              element={<ProfileSection userData={userData} userObj={userObj} />}
            />
            <Route
              path="media"
              element={
                <ProfileSectionMedia userData={userData} userObj={userObj} />
              }
            />
            <Route
              path="likes"
              element={
                <ProfileSectionLikes userData={userData} userObj={userObj} />
              }
            />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
