import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//파이어베이스에서 데이터 베이스 가져오기
import "firebase/database";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase(Firebase 프로젝트 앱)
const app = initializeApp(firebaseConfig);
//굳이 firebase 전체 다 안내보내고 authService만 export할 수 있다.
//authService 사용하고 싶을 때 마다 getAuth(app) 호출해야 하니까 app.js에서 단 한 번만 호출하고 export 시키면 된다.
export const authService = getAuth(app);
