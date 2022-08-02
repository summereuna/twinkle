import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";

const EditProfileModal = ({
  isEditProfileModalOpen,
  handleEditModalClose,
  onChangeDisplayName,
  onChangeBio,
  newDisplayName,
  newBio,
  onSubmit,
}) => {
  const onEscapeKeyDown = (event) => {
    if ((event.charCode || event.keyCode) === 27) {
      handleEditModalClose();
    }
  };
  useEffect(() => {
    document.body.addEventListener("keydown", onEscapeKeyDown);
    return function cleanup() {
      document.body.addEventListener("keydown", onEscapeKeyDown);
    };
  }, []);

  //console.log(userObj);

  return (
    <div
      className={`modal ${isEditProfileModalOpen ? "show" : ""}`}
      onClick={handleEditModalClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header__box">
            <div className="modal-x-btn">
              <button
                className="btn--min btn--circle"
                onClick={handleEditModalClose}
              >
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
                onChange={onChangeDisplayName}
                value={newDisplayName}
              />
              <label htmlFor="bio"> 자기 소개 </label>
              <input
                id="bio"
                aria-describedby="bio"
                name="bio"
                type="text"
                placeholder="자기 소개"
                className="btn btn--skyblue"
                onChange={onChangeBio}
                value={newBio}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
