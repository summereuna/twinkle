import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { authService } from "fbase";

const LogOutModal = ({ show, userObj, onClose }) => {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    authService.signOut();
    //home으로 돌아가기 위해 react router dom의 useNavigate() 메서드 사용
    navigate("/");
  };

  return (
    <div className={`modal-layout ${show ? "show" : ""}`} onClick={onClose}>
      <div className="modal-layout-inside">
        <div className="modal-logout">
          <div
            className="modal-logout-content-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-logout-header">
              <div className="modal-logout-header__container">
                <div className="modal-logout-header__container__userImg"></div>
                <div className="modal-logout-header__container__userInfo">
                  <div className="modal-logout-header__container__userInfo__userName">
                    {userObj.displayName}
                  </div>
                  <div className="modal-logout-header__container__userInfo__userId">
                    @{userObj.email.substring(0, userObj.email.indexOf("@"))}
                  </div>
                </div>
                <div className="modal-logout-header__container__userInfo__check">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </div>
            </div>
            <div className="modal-logout-body">
              <button onClick={onLogOutClick}>
                @{userObj.email.substring(0, userObj.email.indexOf("@"))}{" "}
                계정에서 로그아웃
              </button>
            </div>
          </div>
          <div className="modal-logout-content-2"></div>
        </div>
      </div>
    </div>
  );
};
export default LogOutModal;
