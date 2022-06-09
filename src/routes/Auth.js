import React from "react";

//이메일, 비번으로 새로운 계정 생성 및 로그인 하기위해 아래 메서드 임포트하기
//getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import AuthForm from "components/AuthForm";

const Auth = () => {
  const auth = getAuth();

  //소셜로그인 버튼 클릭하면 실행될 함수 생성
  const onSocialClick = async (event) => {
    //console.log(event.target.name);
    const {
      target: { name },
    } = event;
    let provider;
    //타겟의 name에 따라(즉, 무슨 버튼이 눌리는지에 따라)
    if (name === "google") {
      //provider 구글로 설정
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      //provider 깃헙으로 설정
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <p>로고 넣기</p>
      <AuthForm />
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
