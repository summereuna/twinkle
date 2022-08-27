import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  //React Router v.6 부터는 <Redirect /> 대신 <Route />의 element 속성으로 <Navigate replace to="url"/>을 사용한다.
  Navigate,
} from "react-router-dom";
//절대경로로 바꿈
import Auth from "routes/Auth";
import Home from "routes/Home";
//Navigation 컴포넌트와 profile 루트를 가져온다.
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import PropTypes from "prop-types";

//App에서 AppRouter로 보낸 prop인 isLoggedIn 받기
//로그인한 유저 정보 userObj 받기
const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      {/*&&의 의미: <Navigation />이 존재하려면 isLoggedIn이 참이어야 한다*/}
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {/* 로그인한 상태면 /으로, 아니면 /login으로 */}
        {isLoggedIn ? (
          <>
            {/*정해진 url외에 다른 url로 접근시 모두 "/"로 리다이렉트하기*/}
            <Route path="*" element={<Navigate replace to="/" />} />
            {/*로그인한 유저정보(userObj)를 prop으로 Home컴포넌트에 보내기*/}
            <Route path="/" element={<Home userObj={userObj} />}></Route>
            <Route
              path="/:id/*"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            ></Route>
            {/*중첩 라우팅 위해 뒤에 * 달기*/}
          </>
        ) : (
          <>
            <Route path="/" element={<Auth />}></Route>
            {/*여기도*/}
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

AppRouter.propTypes = {
  refreshUser: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  userObj: PropTypes.object,
};

export default AppRouter;
