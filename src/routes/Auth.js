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
  faVimeoV,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { doc, setDoc } from "firebase/firestore";
import { dbService } from "fbase";
import welcomeimage from "../img/nasa.jpeg";

const Auth = ({ allUserIdList }) => {
  const auth = getAuth();

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(auth, provider);

    const user = auth.currentUser;

    //소셜로 가입한 유저, 이미 가입했는지 체크
    if (!allUserIdList.includes(user.uid)) {
      if (user.photoURL) {
        //photoURL O: 유저 컬렉션에 새 유저 추가
        setDoc(doc(dbService, "users", `${user.uid}`), {
          uid: user.uid,
          displayName: user.displayName
            ? user.displayName
            : `${user.email.substring(0, user.email.indexOf("@"))}`,
          email: user.email,
          photoURL: user.photoURL,
          headerURL: "",
          bio: "",
          like: [],
          follower: [],
          following: [],
          createdAt: user.metadata.createdAt,
        });
      } else {
        //photoURL X: 유저 컬렉션에 새 유저 추가
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
      }
    } else {
      //유저 컬렉션에 이미 있는 유저면 아무것도 안함
    }
  };

  return (
    <main>
      <div id="loginPage">
        <div id="loginPage__container">
          <img src={`${welcomeimage}`} alt="img" className="loginPage__img" />
          <div className="body-content__auth">
            <div className="auth__container">
              <div className="auth__title__container">
                <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" />
                <h1 className="auth__title">지금 일어나고 있는 일</h1>
                <h2 className="auth__subtitle">오늘 트윙클을 시작하세요.</h2>
              </div>
              <div className="auth__btns">
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
        </div>
        <footer className="loginPage__footer">
          <div className="loginPage__footer__box">
            <span>&copy; {new Date().getFullYear()} Twinkle</span>
          </div>
          <div className="loginPage__footer__box footer__box__verticalBar">
            {" "}
            |{" "}
          </div>
          <div className="loginPage__footer__box">
            <span> Twitter 클론 사이트 </span>
          </div>
          <div className="loginPage__footer__box footer__box__verticalBar">
            {" "}
            |{" "}
          </div>
          <div className="loginPage__footer__box">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="loginPage__footer__box__icon"
            />
            <span> summereuna@gmail.com</span>
          </div>
          <div className="loginPage__footer__box footer__box__verticalBar">
            {" "}
            |{" "}
          </div>
          <div className="loginPage__footer__box">
            <a
              href="https://github.com/summereuna"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="loginPage__footer__box__icon"
              />
              <span> github</span>
            </a>
          </div>
          <div className="loginPage__footer__box footer__box__verticalBar">
            {" "}
            |{" "}
          </div>
          <div className="loginPage__footer__box">
            <a
              href="https://velog.io/@summereuna"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faVimeoV}
                className="loginPage__footer__box__icon"
              />
              <span> blog</span>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Auth;
