//이메일, 비번으로 새로운 계정 생성 및 로그인 하기위해 아래 메서드 임포트하기
//getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import AuthForm from "components/AuthForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { doc, setDoc } from "firebase/firestore";
import { dbService } from "fbase";

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

    const user = auth.currentUser;
    setDoc(doc(dbService, "users", `${user.uid}`), {
      uid: user.uid,
      displayName: user.displayName
        ? user.displayName
        : `${user.email.substring(0, user.email.indexOf("@"))}`,
      email: user.email,
      photoURL: "",
      headerURL: "",
      bio: "",
      like: [],
      follower: [],
      following: [],
      createdAt: user.metadata.createdAt,
    });
  };

  return (
    <main>
      <div id="body-content">
        <div className="auth__container">
          <div className="auth__title__container">
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" />
            <h1 className="auth__title">지금 일어나고 있는 일</h1>
            <h2 className="auth__subtitle">오늘 트윙클을 시작하세요.</h2>
          </div>
          <div className="auth__btns">
            {/*🔥 버튼 만들고 onClick 이벤트에 onSocialClick 함수 연결*/}
            <button
              className="btn btn--grey"
              name="google"
              onClick={onSocialClick}
            >
              <FontAwesomeIcon icon={faGoogle} /> Google 계정으로 계속하기
            </button>
            <button
              className="btn btn--grey"
              name="github"
              onClick={onSocialClick}
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub 계정으로 계속하기
            </button>
            <div className="line__box">
              <div className="line"></div>
              <span> 또는 </span>
              <div className="line"></div>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
