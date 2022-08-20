import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Recommendation from "./Recomendation";

const SideSection = () => {
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="side__container">
      <div className="side-box">
        <div className="side__search">
          <form onSubmit={onSubmit}>
            <button type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <input type="text" placeholder="트윙클 검색" />
          </form>
        </div>
      </div>
      <div className="side-box">
        <div className="side__trends">
          <h3>나를 위한 트렌드</h3>
          <div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="side-box">
        <div className="side_recommendation">
          <h3>팔로우 추천</h3>
          <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default SideSection;
