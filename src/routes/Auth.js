import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const onSubmit = (event) => {
    event.preventDefault();
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
        <input type="submit" value="Login" />
      </form>
      <div>
        <button>Continue with Google</button>
        <button>Continue with GitHub</button>
      </div>
    </div>
  );
};

export default Auth;
