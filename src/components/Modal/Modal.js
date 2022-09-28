import React, { useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TweetFactory from "components/TweetFactory";

function Modal({ userObj, isModalOpen, handleModalClose }) {
  const onEscapeKeyDown = (event) => {
    if (isModalOpen && (event.charCode || event.keyCode) === 27) {
      handleModalClose();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onEscapeKeyDown);
    return function cleanup() {
      window.removeEventListener("keydown", onEscapeKeyDown);
    };
  });

  return (
    <div
      className={`modal ${isModalOpen ? "show" : ""}`}
      onClick={handleModalClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="btn--min btn--circle" onClick={handleModalClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          <TweetFactory
            isModalOpen={isModalOpen}
            handleModalClose={handleModalClose}
            userObj={userObj}
          />
        </div>
      </div>
    </div>
  );
}

export default Modal;
