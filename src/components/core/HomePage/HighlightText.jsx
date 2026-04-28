import React from "react";

const HighlightText = ({text}) => {
  return (
    <span className="text-gradient font-bold drop-shadow-[0_0_10px_rgba(31,162,255,0.4)]">
      {" "}
      {text}
    </span>
  );
};

export default HighlightText;
