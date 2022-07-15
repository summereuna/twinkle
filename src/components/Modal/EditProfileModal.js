import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";

const EditProfileModal = ({
  userObj,
  isModalOpen,
  onClose,
  onChange,
  newDisplayName,
  onSubmit,
}) => {
  //이벤트 전달 막기: modal 전체 화면 클리 시 onClose 이벤트 발생하나 modal-content 영역 클릭시 작동되지 않도록 이벤트 전달 막음
  const handleStopPropagation = (event) => {
    event.stopPropagation();
  };

  const onEscapeKeyDown = (event) => {
    if ((event.charCode || event.keyCode) === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", onEscapeKeyDown);
    return function cleanup() {
      document.body.addEventListener("keydown", onEscapeKeyDown);
    };
  }, []);

  console.log(userObj);

  return (
    <div className={`modal ${isModalOpen ? "show" : ""}`} onClick={onClose}>
      <div className="modal-content" onClick={handleStopPropagation}>
        <div className="modal-header">
          <div className="modal-header__box">
            <div className="modal-x-btn">
              <button className="btn--min btn--circle" onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <h4 className="modal-title">프로필 수정</h4>
            <button
              className="btn btn--blue btn--border-zero"
              type="submit"
              form="edit-form"
            >
              저장
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="profile__user__header">
            헤더 이미지 598*200
            <div className="btn--edit--container">
              <div
                aria-label="헤더 사진 추가하기"
                className="btn--edit--container--btn"
              >
                <button className="btn--change">
                  <FontAwesomeIcon icon={faCamera} />
                </button>
              </div>
              <div
                aria-label="헤더 사진 삭제하기"
                className="btn--edit--container--btn"
              >
                <button className="btn--delete">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
          <div className="profile__user__info">
            <div className="profile__user__userImg">
              <div className="profile__user__userImg__file userImg--sm img--edit--container">
                <div
                  aria-label="프로필 사진 추가하기"
                  className="img--edit--container--btn"
                >
                  <button className="btn--change">
                    <FontAwesomeIcon icon={faCamera} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-edit">
            <form id="edit-form" className="edit-form" onSubmit={onSubmit}>
              <label htmlFor="user-name"> 이름 </label>
              <input
                id="user-name"
                aria-describedby="user-name"
                name="user-name"
                type="text"
                placeholder="이름"
                className="btn btn--skyblue"
                onChange={onChange}
                value={newDisplayName}
              />
              <label htmlFor="self-introduction"> 자기 소개 </label>
              <input
                id="self-introduction"
                aria-describedby="self-introduction"
                name="self-introduction"
                type="text"
                placeholder="자기 소개"
                className="btn btn--skyblue"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
