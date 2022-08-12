import React from "react";

const Header = ({ headerURL }) => {
  return (
    <div className="header-photo">
      {headerURL && (
        <img src={headerURL} alt="header" className="header-photo__img" />
      )}
    </div>
  );
};

export default Header;
