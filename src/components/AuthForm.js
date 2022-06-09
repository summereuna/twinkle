import React, { useState, useEffect } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  //error 스테이드를 만들자. 디폴트 값으로 비어 있는 텍스트 주기
  const [error, setError] = useState("");

  //email, password에 사용하는 이벤트
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  //form에 사용하는 이벤트
  const onSubmit = async (event) => {
    event.preventDefault();
    //form submit하면 newAccount 스테이트로 확인하자!
    //newAccount가 참이면 계정 새로 만들고, 거짓이면 로그인하기
    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
        //⚠️ 에러 발생 지점: 라우터이동 후 state 변경하기 때문, 삭제
        //setNewAccount(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      //에러가 생기면 error 스테이트에 넣어서 에러 메세지 띄우기
      //console.log(error.message);
      setError(error.message);
    }
  };

  //클린업 펑션 넣음
  useEffect(() => {
    return () => setNewAccount(false);
  }, []);

  //가입해야하는지 로그인해야 하는지 토글하는 함수: newAccount의 이전 값과 반대되는 값 리턴하기
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="이메일"
          required
          value={email}
          name="email"
          onChange={onChange}
        ></input>
        <input
          type="password"
          placeholder="비밀번호"
          required
          value={password}
          name="password"
          onChange={onChange}
        ></input>
        <input type="submit" value={newAccount ? "가입하기" : "로그인"} />
        {/*error 보여주기*/}
        {error}
      </form>
      {/*newAccount(새로운 계정)가 참이면 로그인, 거짓이면 가입하기가 되는 토글 만들기 */}
      <button onClick={toggleAccount}>
        {newAccount ? "로그인" : "가입하기"}
      </button>
    </>
  );
};

export default AuthForm;
