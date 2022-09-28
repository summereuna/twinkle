import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHashtag,
  faHome,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import LogOutModal from "./Modal/LogOutModal";
import Modal from "./Modal/Modal";
import { useEffect, useRef, useState } from "react";
import ProfilePhoto from "./ProfilePhoto";

const Navigation = ({ userObj }) => {
  const outsideOfLogOutModal = useRef();

  //Log Out Modal
  const [isOpenLogOutModal, setIsOpenLogOutModal] = useState(false);

  const handleOpenLogOutModal = () => {
    if (!isOpenLogOutModal) {
      setIsOpenLogOutModal((prev) => !prev);
    }
  };

  const handleCloseLogOutModal = (event) => {
    if (
      isOpenLogOutModal &&
      !outsideOfLogOutModal.current.contains(event.target)
    ) {
      setIsOpenLogOutModal((prev) => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleCloseLogOutModal);
    return () => {
      window.removeEventListener("click", handleCloseLogOutModal);
    };
  });

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    if (!isModalOpen) {
      setIsModalOpen((prev) => !prev);
    }
  };

  const handleModalClose = () => {
    if (isModalOpen) {
      setIsModalOpen((prev) => !prev);
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__container__container">
          <nav className="nav">
            <ul className="nav__ul">
              <Link to="/">
                <div className="nav__ul__li__btn nav__btn logo-color">
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
                <Link to="explore">
                  <div className="nav__ul__li__btn nav__btn btn--circle">
                    <FontAwesomeIcon icon={faHashtag} size="2x" />
                  </div>
                </Link>
              </li>
              {/* <li className="nav__ul__li">
                <div className="nav__ul__li__btn nav__btn btn--circle">
                  <FontAwesomeIcon icon={faBell} size="2x" />
                </div>
              </li>
              <li className="nav__ul__li">
                <div className="nav__ul__li__btn nav__btn btn--circle">
                  <FontAwesomeIcon icon={faEnvelope} size="2x" />
                </div>
              </li> */}
              <li className="nav__ul__li">
                <Link to={userObj.uid} end="true">
                  <div className="nav__ul__li__btn nav__btn btn--circle">
                    <FontAwesomeIcon icon={faUser} size="2x" />
                  </div>
                </Link>
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
                  />
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
              <div ref={outsideOfLogOutModal}>
                <LogOutModal userObj={userObj} show={isOpenLogOutModal} />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

Navigation.propTypes = {
  userObj: PropTypes.object,
};

export default Navigation;
