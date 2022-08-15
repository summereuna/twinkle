import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ProfilePhoto = ({ photoURL }) => {
  return (
    <div className="profile-photo">
      {photoURL ? (
        <img src={photoURL} alt="profile" className="profile-photo__img" />
      ) : (
        <FontAwesomeIcon
          icon={faUserAlt}
          size="2x"
          className="profile-photo__default"
        />
      )}
    </div>
  );
};

export default ProfilePhoto;
