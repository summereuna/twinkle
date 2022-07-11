import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faHome } from "@fortawesome/free-solid-svg-icons";
import {
  faBell,
  faUser,
  faListAlt,
  faBookmark,
  faEnvelope,
  faCaretSquareRight,
} from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const Navigation = ({ userObj }) => (
  <header className="header">
    <div className="header__container">
      <nav className="nav">
        <ul className="nav__ul">
          <div className="nav__ul__li__btn nav__btn color-main">
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </div>
          <li className="nav__ul__li">
            <Link to="/">
              <div className="nav__ul__li__btn nav__btn nav__btn--circle">
                <FontAwesomeIcon icon={faHome} size="2x" />
              </div>
            </Link>
          </li>
          <li className="nav__ul__li">
            <div className="nav__ul__li__btn nav__btn nav__btn--circle">
              <FontAwesomeIcon icon={faHashtag} size="2x" />
            </div>
          </li>
          <li className="nav__ul__li">
            <div className="nav__ul__li__btn nav__btn nav__btn--circle">
              <FontAwesomeIcon icon={faBell} size="2x" />
            </div>
          </li>
          <li className="nav__ul__li">
            <div className="nav__ul__li__btn nav__btn nav__btn--circle">
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </div>
          </li>
          <li className="nav__ul__li">
            <div className="nav__ul__li__btn nav__btn nav__btn--circle">
              <FontAwesomeIcon icon={faBookmark} size="2x" />
            </div>
          </li>
          <li className="nav__ul__li">
            <div className="nav__ul__li__btn nav__btn nav__btn--circle">
              <FontAwesomeIcon icon={faListAlt} size="2x" />
            </div>
          </li>
          <li className="nav__ul__li">
            <Link to="/profile">
              <div className="nav__ul__li__btn nav__btn nav__btn--circle">
                <FontAwesomeIcon icon={faUser} size="2x" />
              </div>
            </Link>
          </li>
          <li className="nav__ul__li">
            <div className="nav__ul__li__btn nav__btn nav__btn--circle">
              <FontAwesomeIcon icon={faCaretSquareRight} size="2x" />
            </div>
          </li>
        </ul>
        <div className="nav__user">
          <div className="nav__user__userImg">
            <div className="nav__user__userImg_img"></div>
          </div>
          <span className="nav__user__userName">{userObj.displayName}</span>
        </div>
      </nav>
    </div>
  </header>
);

Navigation.propTypes = {
  userObj: PropTypes.object,
};

export default Navigation;
