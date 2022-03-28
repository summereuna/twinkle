//이메일, 비번으로 새로운 계정 생성 및 로그인 하기위해 아래 메서드 임포트하기
//getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  //🔥 error 스테이드를 만들자. 디폴트 값으로 비어 있는 텍스트 주기
  const [error, setError] = useState("");
  const auth = getAuth();
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
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
        setNewAccount(false);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      //🔥에러가 생기면 error 스테이트에 넣어서 에러 메세지 띄우기
      //console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <p>로고 넣기</p>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          name="email"
          onChange={onChange}
        ></input>
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          name="password"
          onChange={onChange}
        ></input>
        <input type="submit" value={newAccount ? "Create Account" : "Login"} />
        {/*🔥 error 보여주기*/}
        {error}
      </form>
      <div>
        <button>Continue with Google</button>
        <button>Continue with GitHub</button>
      </div>
    </div>
  );
};

export default Auth;
