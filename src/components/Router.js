import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

//App에서 AppRouter로 보낸 prop인 isLoggedIn 받기
const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      <Routes>
        {/* 로그인한 상태면 /으로, 아니면 /login으로 */}
        {isLoggedIn ? (
          <Route path="/" element={<Home />}></Route>
        ) : (
          <Route path="/" element={<Auth />}></Route>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
