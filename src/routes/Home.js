import React, { useState } from "react";

const Home = () => {
  const [tweet, setTweet] = useState("");
  const onSubmit = (event) => {
    event.preventDefault();
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
    //console.log(tweet);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="무슨 일이 일어나고 있나요?"
          maxLength={120}
          value={tweet}
          onChange={onChange}
        />
        <input type="submit" value="트윙클하기" />
      </form>
    </div>
  );
};

export default Home;
