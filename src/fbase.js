//Firebase Web v.9
//참고: https://firebase.google.com/docs/web/modular-upgrade#refactor_to_the_modular_style
//Follow this pattern to import other Firebase services
//import { } from 'firebase/<service>';

//앱 초기화 가져오기
import { initializeApp } from "firebase/app";
//파이어베이스에서 인증 시스템 가져오기
import { getAuth } from "firebase/auth";
//파이어베이스에서 데이터 베이스 가져오기
import { getFirestore } from "firebase/firestore";
//파이어베이스에서 스토리지 가져오기
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

//파이어베이스 앱 초기화 하기
const app = initializeApp(firebaseConfig);

//어스 서비스 내보내기
//굳이 firebase 전체 다 안내보내고 authService만 export할 수 있다.
//authService 사용하고 싶을 때 마다 getAuth(app) 호출해야 하니까 app.js에서 단 한 번만 호출하고 export 시키면 된다.
export const authService = getAuth(app);

//디비 서비스 내보내기
export const dbService = getFirestore();

//스토리지(사진 업로드)
export const storageService = getStorage();
