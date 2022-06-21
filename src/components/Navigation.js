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

const Navigation = ({ userObj }) => (
  <nav>
    <ul className="nav__list hidden">
      <li>
        <Link to="/">
          <FontAwesomeIcon icon={faHome} size="2x" /> 🔥홈
        </Link>
      </li>
      <li>
        <FontAwesomeIcon icon={faHashtag} size="2x" /> 탐색하기
      </li>
      <li>
        <FontAwesomeIcon icon={faBell} size="2x" /> 알림
      </li>
      <li>
        <FontAwesomeIcon icon={faEnvelope} size="2x" /> 쪽지
      </li>
      <li>
        <FontAwesomeIcon icon={faBookmark} size="2x" /> 북마크
      </li>
      <li>
        <FontAwesomeIcon icon={faClipboardList} size="2x" /> 리스트
      </li>
      <li>
        <Link to="/profile">
          <FontAwesomeIcon icon={faUser} size="2x" /> 🔥프로필
        </Link>
      </li>
      <li>
        <FontAwesomeIcon icon={faChevronCircleRight} size="2x" /> 더보기
      </li>
      {/*ul 밖으로 빼야 함 ㅇㅇ*/}
      <div className="nav__user">
        <div className="nav__user__userImg">🥺dddd</div>
        <span className="nav__user__userName">{userObj.displayName}</span>
      </div>
    </ul>
  </nav>
);

Navigation.propTypes = {
  userObj: PropTypes.object,
};

export default Navigation;
