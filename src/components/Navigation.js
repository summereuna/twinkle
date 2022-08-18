import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHashtag,
  faHome,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBell,
  faUser,
  faListAlt,
  faBookmark,
  faEnvelope,
  faCaretSquareRight,
} from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import LogOutModal from "./Modal/LogOutModal";
import Modal from "./Modal/Modal";
import { useState } from "react";
import TweetFactory from "./TweetFactory";
import ProfilePhoto from "./ProfilePhoto";

const Navigation = ({ userObj }) => {
  //Log Out Modal
  const [isOpenLogOutModal, setIsOpenLogOutModal] = useState(false);

  const handleOpenLogOutModal = () => {
    setIsOpenLogOutModal((prev) => !prev);
  };

  const handleCloseLogOutModal = () => {
    setIsOpenLogOutModal(false);
  };

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <nav className="nav">
          <ul className="nav__ul">
            <Link to="/">
              <div className="nav__ul__li__btn nav__btn color-main">
                <FontAwesomeIcon
                  icon={faTwitter}
                  size="2x"
                  className="cursor--pointer"
                />
              </div>
            </Link>
            <li className="nav__ul__li">
              <Link to="/">
                <div className="nav__ul__li__btn nav__btn btn--circle">
                  <FontAwesomeIcon icon={faHome} size="2x" />
                </div>
              </Link>
            </li>
            <li className="nav__ul__li">
              <div className="nav__ul__li__btn nav__btn btn--circle">
                <FontAwesomeIcon icon={faHashtag} size="2x" />
              </div>
            </li>
            <li className="nav__ul__li">
              <div className="nav__ul__li__btn nav__btn btn--circle">
                <FontAwesomeIcon icon={faBell} size="2x" />
              </div>
            </li>
            <li className="nav__ul__li">
              <div className="nav__ul__li__btn nav__btn btn--circle">
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
              </div>
            </li>
            <li className="nav__ul__li">
              <div className="nav__ul__li__btn nav__btn btn--circle">
                <FontAwesomeIcon icon={faBookmark} size="2x" />
              </div>
            </li>
            <li className="nav__ul__li">
              <div className="nav__ul__li__btn nav__btn btn--circle">
                <FontAwesomeIcon icon={faListAlt} size="2x" />
              </div>
            </li>
            <li className="nav__ul__li">
              <Link to="/profile">
                <div className="nav__ul__li__btn nav__btn btn--circle">
                  <FontAwesomeIcon icon={faUser} size="2x" />
                </div>
              </Link>
            </li>
            <li className="nav__ul__li">
              <div className="nav__ul__li__btn nav__btn btn--circle">
                <FontAwesomeIcon icon={faCaretSquareRight} size="2x" />
              </div>
            </li>
            <li className="nav__ul__li">
              <div
                className="nav__ul__li__btn nav__btn btn--blue--circle"
                onClick={handleModalOpen}
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size="2x"
                  className="cursor--pointer"
                />
                <Modal
                  userObj={userObj}
                  handleModalClose={handleModalClose}
                  isModalOpen={isModalOpen}
                >
                  <TweetFactory
                    setIsModalOpen={setIsModalOpen}
                    userObj={userObj}
                  />
                </Modal>
              </div>
            </li>
          </ul>
          <div className="nav__user">
            <div
              className="nav__user__userImg nav__btn btn--circle"
              onClick={handleOpenLogOutModal}
            >
              <div className="nav__user__userImg_img">
                <ProfilePhoto photoURL={userObj.photoURL} />
              </div>
            </div>
            <LogOutModal
              userObj={userObj}
              onClose={handleCloseLogOutModal}
              show={isOpenLogOutModal}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

Navigation.propTypes = {
  userObj: PropTypes.object,
};

export default Navigation;
