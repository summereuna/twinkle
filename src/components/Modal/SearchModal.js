import React, { useEffect } from "react";
import SearchUser from "components/SearchUser";

const SearchModal = ({
  isModalOpen,
  handleModalClose,
  hover,
  filterKeywordArr,
  searchKeyword,
}) => {
  const onEscapeKeyDown = (event) => {
    if (isModalOpen && (event.charCode || event.keyCode) === 27) {
      handleModalClose();
      console.log("❗️esc 누름❗️");
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
      className={`modal-search-layout ${isModalOpen ? "show" : ""}`}
      onClick={handleModalClose}
    >
      <div className="modal-search-layout-inside">
        <div className="modal-search">
          <div
            className="modal-search-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {searchKeyword ? (
                filterKeywordArr.length > 0 ? (
                  <SearchUser
                    hover={hover}
                    userList={filterKeywordArr}
                    handleModalClose={handleModalClose}
                  />
                ) : (
                  <div className="modal-search-content__default">
                    {`'${searchKeyword}'에 대한 검색 결과가 없습니다.`}
                  </div>
                )
              ) : (
                <div className="modal-search-content__default">
                  사용자를 검색해보세요
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchModal;
