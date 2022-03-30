import { authService } from "fbase";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    //home으로 돌아가기 위해 react router dom의 useNavigate() 메서드 사용
    navigate("/");
  };

  return (
    <>
      <button onClick={onLogOutClick}>로그아웃</button>
    </>
  );
};
