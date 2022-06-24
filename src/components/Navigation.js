import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBookmark,
  faChevronCircleRight,
  faClipboardList,
  faEnvelope,
  faHashtag,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const Navigation = ({ userObj }) => (
  <header className="header">
    <div className="header__container">
      <nav className="nav">
        <ul className="nav__ul">
          <button className="btn--circle btn--circle--blue">
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </button>
          <li className="nav__ul__li">
            <Link to="/">
              <button className="btn--circle btn--circle--blue">
                <FontAwesomeIcon icon={faHome} size="2x" />
              </button>
            </Link>
          </li>
          <li className="nav__ul__li">
            <button className="btn--circle btn--circle--blue">
              <FontAwesomeIcon icon={faHashtag} size="2x" />
            </button>
          </li>
          <li className="nav__ul__li">
            <button className="btn--circle btn--circle--blue">
              <FontAwesomeIcon icon={faBell} size="2x" />
            </button>
          </li>
          <li className="nav__ul__li">
            <button className="btn--circle btn--circle--blue">
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </button>
          </li>
          <li className="nav__ul__li">
            <button className="btn--circle btn--circle--blue">
              <FontAwesomeIcon icon={faBookmark} size="2x" />
            </button>
          </li>
          <li className="nav__ul__li">
            <button className="btn--circle btn--circle--blue">
              <FontAwesomeIcon icon={faClipboardList} size="2x" />
            </button>
          </li>
          <li className="nav__ul__li">
            <Link to="/profile">
              <button className="btn--circle btn--circle--blue">
                <FontAwesomeIcon icon={faUser} size="2x" />
              </button>
            </Link>
          </li>
          <li className="nav__ul__li">
            <button className="btn--circle btn--circle--blue">
              <FontAwesomeIcon icon={faChevronCircleRight} size="2x" />
            </button>
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
