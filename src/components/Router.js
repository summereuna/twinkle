import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  //React Router v.6 부터는 <Redirect /> 대신 <Route />의 element 속성으로 <Navigate replace to="url"/>을 사용
  Navigate,
} from "react-router-dom";
//절대경로로 바꿈
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import PropTypes from "prop-types";
import Follow from "../routes/Follow";
import Explore from "routes/Explore";
import Search from "routes/Search";

//로그인한 유저 정보 userObj 받기
const AppRouter = ({
  isLoggedIn,
  userObj,
  handleUserUpdate,
  allUserIdList,
}) => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {/* 로그인한 상태면 /으로, 아니면 /login으로 */}
        {isLoggedIn ? (
          <>
            {/*정해진 url외에 다른 url로 접근시 모두 "/"로 리다이렉트하기*/}
            <Route path="*" element={<Navigate replace to="/" />} />
            <Route path="/" element={<Home userObj={userObj} />}></Route>
            <Route
              path="/explore"
              element={<Explore userObj={userObj} />}
            ></Route>
            <Route
              path="/search"
              element={<Search userObj={userObj} />}
            ></Route>
            <Route
              path="/:id/*"
              element={
                <Profile
                  userObj={userObj}
                  handleUserUpdate={handleUserUpdate}
                />
              }
            ></Route>
            {/*중첩 라우팅 위해 뒤에 * 달기*/}
            <Route
              path="/:id/following"
              end="true"
              element={<Follow userObj={userObj} state={"following"} />}
            />
            <Route
              path="/:id/follower"
              end="true"
              element={<Follow userObj={userObj} state={"follower"} />}
            />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={<Auth allUserIdList={allUserIdList} />}
            ></Route>
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

AppRouter.propTypes = {
  isLoggedIn: PropTypes.bool,
  userObj: PropTypes.object,
};

export default AppRouter;
