import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchModal from "./Modal/SearchModal";

const SearchBar = ({ allUserWithoutCurrentUser }) => {
  const navigate = useNavigate();
  //검색
  const [search, setSearch] = useState("");

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    console.log("🌟onChange 안에 있는 value", value);
    setSearch(value);
  };
  //검색 필터
  const filterKeywordArr = allUserWithoutCurrentUser.filter((user) => {
    const username = user.displayName
      .replace(" ", "")
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase().replace(" ", ""));
    const emailId = user.email.substring(0, user.email.indexOf("@"));
    const userId = emailId
      .replace(" ", "")
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase().replace(" ", ""));
    //console.log("필터");
    return search && (username || userId);
  });

  const handleSearchOnClick = (e) => {
    e.preventDefault();
    //console.log("클릭");
    handleSearch();
  };

  const handleSearchOnEnterKey = (e) => {
    if (e.keyCode === 13 || e.key === "Enter" || e.code === "Enter") {
      //console.log("엔터키");
      handleSearch();
    }
  };

  const handleSearch = () => {
    //console.log("작동 ㅇ");

    console.log("💗search", search);
    handleModalClose();
    navigate({
      pathname: "/search",
      search: `?q=${search}`,
    });
    setSearch("");
  };

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
      setSearch("");
    }
  };

  return (
    <div className="side__search__container__search">
      <form
        onSubmit={handleSearchOnClick}
        onKeyDown={handleSearchOnEnterKey}
        className="side__search__container__search__form"
        action="/explore"
        method="get"
      >
        <div className="side__search__container__search__form__div">
          <label htmlFor="searchInput">
            <button
              type="submit"
              className="side__search__container__search__form__btn"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <input
              id="searchInput"
              type="search"
              name="q"
              autoComplete="off"
              placeholder="트윙클 검색"
              onChange={onChange}
              value={search}
              className="side__search__container__search__form__input"
              onClick={handleModalOpen}
            />
          </label>
        </div>
        <div className="side__search__container__search__modal">
          <SearchModal
            handleModalClose={handleModalClose}
            isModalOpen={isModalOpen}
            hover={"hover--bg--light"}
            filterKeywordArr={filterKeywordArr}
            searchKeyword={search}
          ></SearchModal>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
