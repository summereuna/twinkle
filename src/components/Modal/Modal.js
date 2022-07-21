import React, { useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Modal({ children, isModalOpen, handleModalClose }) {
  const onEscapeKeyDown = (event) => {
    if ((event.charCode || event.keyCode) === 27) {
      handleModalClose();
    }
  };
  useEffect(() => {
    document.body.addEventListener("keydown", onEscapeKeyDown);
    return function cleanup() {
      document.body.addEventListener("keydown", onEscapeKeyDown);
    };
  }, []);

  console.log(isModalOpen);
  //엥....? 왜 외부 클릭시 입력해 놓은 값도 없는데 자기 혼자 되는거야?

  return (
    <div className={`modal ${isModalOpen ? "show" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="btn--min btn--circle" onClick={handleModalClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
