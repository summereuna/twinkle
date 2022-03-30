import { useState } from "react";

//이메일, 비번으로 새로운 계정 생성 및 로그인 하기위해 아래 메서드 임포트하기
//getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  //error 스테이드를 만들자. 디폴트 값으로 비어 있는 텍스트 주기
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
      if (newAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
        setNewAccount(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      //에러가 생기면 error 스테이트에 넣어서 에러 메세지 띄우기
      //console.log(error.message);
      setError(error.message);
    }
  };

  //가입해야하는지 로그인해야 하는지 토글하는 함수: newAccount의 이전 값과 반대되는 값 리턴하기
  const toggleAccount = () => setNewAccount((prev) => !prev);

  //🔥🔥소셜로그인 버튼 클릭하면 실행될 함수 생성
  const onSocialClick = async (event) => {
    //console.log(event.target.name);
    const {
      target: { name },
    } = event;
    let provider;
    //🔥🔥타겟의 name에 따라(즉, 무슨 버튼이 눌리는지에 따라)
    if (name === "google") {
      //🔥provider 구글로 설정
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      //🔥provider 깃헙으로 설정
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <p>로고 넣기</p>
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
      <div>
        {/*🔥 버튼 만들고 onClick 이벤트에 onSocialClick 함수 연결*/}
        <button name="google" onClick={onSocialClick}>
          Google 계정으로 계속하기
        </button>
        <button name="github" onClick={onSocialClick}>
          GitHub 계정으로 계속하기
        </button>
      </div>
    </div>
  );
};

export default Auth;
