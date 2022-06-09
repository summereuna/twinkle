import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Navigation = ({ userObj }) => (
  <nav>
    <ul>
      <li>
        <Link to="/">홈</Link>
      </li>
      <li>
        <Link to="/profile">{userObj.displayName}의 프로필</Link>
      </li>
    </ul>
  </nav>
);

Navigation.propTypes = {
  userObj: PropTypes.object,
};

export default Navigation;
