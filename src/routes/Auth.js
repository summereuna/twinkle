//🔥 이메일, 비번으로 새로운 계정 생성 및 로그인 하기위해 아래 메서드 임포트하기
//🔥 getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //🔥 새로운 계정 만들기
  const [newAccount, setNewAccount] = useState(true);
  //🔥 getAuth()를 auth로 명명
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
  //🔥 createUserWithEmailAndPassword() 메서드와 signInWithEmailAndPassword()메서드가 promise를 리턴하기 때문에 async await을 사용하자!
  const onSubmit = async (event) => {
    event.preventDefault();
    //🔥 form submit하면 newAccount 스테이트로 확인하자!
    //🔥 newAccount가 참이면 계정 새로 만들고, 거짓이면 로그인하기
    //🔥🔥 그리고 트라이 캣치 구문 사용해서 혹시 모를 오류를 대비하자.
    try {
      //🔥 얻게되는 data확인 위해 data라는 변수를 정하고 newAccount가 참일 땐 data에 계정생성하는 메서드 넣고,
      //newAccount가 거짓일 땐 data에 로그인하는 메서드 넣자.
      let data;
      if (newAccount) {
        //🔥 파라미터로 auth, email, password를 보내면 된다.
        data = await createUserWithEmailAndPassword(auth, email, password);
        setNewAccount(false);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
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
        {/*🔥 계정 새로 만들어야 하면 로그인 버튼 대신 계정 새로 만드는 버튼 보여주기*/}
        <input type="submit" value={newAccount ? "Create Account" : "Login"} />
      </form>
      <div>
        <button>Continue with Google</button>
        <button>Continue with GitHub</button>
      </div>
    </div>
  );
};

export default Auth;
