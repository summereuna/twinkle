import React, { useEffect } from "react";
import Recommendation from "components/Recomendation";

const SearchModal = ({
  isModalOpen,
  handleModalClose,
  hover,
  filterKeywordArr,
  searchKeyword,
}) => {
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

  //console.log(isModalOpen);
  //console.log("searchKeyword", searchKeyword);
  //console.log("filterKeywordArr", filterKeywordArr);

  return (
    <div
      className={`modal-layout ${isModalOpen ? "show" : ""}`}
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
                  <Recommendation hover={hover} userList={filterKeywordArr} />
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
