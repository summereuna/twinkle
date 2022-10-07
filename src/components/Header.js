import React from "react";

const Header = ({ headerURL }) => {
  return (
    <div className="header-photo">
      {headerURL ? (
        <img
          src={headerURL}
          alt="header"
          className="header-photo__img"
          width="598px"
          height="200px"
        />
      ) : (
        <div className="header-photo__default"></div>
      )}
    </div>
  );
};

export default Header;
