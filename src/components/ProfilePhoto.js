import React from "react";

const ProfilePhoto = ({ photoURL }) => {
  return (
    <div className="profile-photo">
      {photoURL && (
        <img src={photoURL} alt="profile" className="profile-photo__img" />
      )}
    </div>
  );
};

export default ProfilePhoto;
