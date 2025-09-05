// TypingIndicator.js
import React from "react";
import Lottie from "lottie-react";
import typingAnimation from "./typing.json"; // make sure path is correct

const TypingIndicator = () => {
  return (
    <div style={{ width: 60, height: 30 }}>
      <Lottie animationData={typingAnimation} loop={true} />
    </div>
  );
};

export default TypingIndicator;
