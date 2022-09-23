import { NavLink } from "react-router-dom";

const ProfileTab = () => {
  return (
    <nav className="nav-tab">
      <div className="nav-tab__div">
        <div className="nav-tab__div__div">
          <ul className="nav-tab__list">
            <li className="nav-tab__list__presentation">
              <NavLink
                to=""
                end="true"
                className={({ isActive }) => (isActive ? "tab-on" : undefined)}
              >
                <div className="nav-tab__list__presentation__a">
                  <div className="nav-tab__list__presentation__a__text-box">
                    <span className="nav-tab__list__presentation__a__text-box__name">
                      트윗
                    </span>
                  </div>
                </div>
              </NavLink>
            </li>
            {/* <li className="nav-tab__list__presentation">
              <a href="/" className="nav-tab__list__presentation__a">
                <div className="nav-tab__list__presentation__a__text-box">
                  <span className="nav-tab__list__presentation__a__text-box__name">
                    트윗 및 답글
                  </span>
                  <div className="nav-tab__list__presentation__a__text-box__line"></div>
                </div>
              </a>
            </li> */}
            <li className="nav-tab__list__presentation">
              <NavLink
                to="media"
                className={({ isActive }) => (isActive ? "tab-on" : undefined)}
              >
                <div className="nav-tab__list__presentation__a">
                  <div className="nav-tab__list__presentation__a__text-box">
                    <span className="nav-tab__list__presentation__a__text-box__name">
                      미디어
                    </span>
                    <div className="nav-tab__list__presentation__a__text-box__line"></div>
                  </div>
                </div>
              </NavLink>
            </li>
            <li className="nav-tab__list__presentation">
              <NavLink
                to="likes"
                className={({ isActive }) => (isActive ? "tab-on" : undefined)}
              >
                <div className="nav-tab__list__presentation__a">
                  <div className="nav-tab__list__presentation__a__text-box">
                    <span className="nav-tab__list__presentation__a__text-box__name">
                      마음에 들어요
                    </span>
                    <div className="nav-tab__list__presentation__a__text-box__line"></div>
                  </div>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default ProfileTab;
