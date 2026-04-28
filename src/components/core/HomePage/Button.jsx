import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold transition-all duration-300 hover:scale-105 ${
          active 
            ? "bg-yellow-50 text-black shadow-[0_0_15px_rgba(255,214,10,0.5)] glow-effect" 
            : "bg-richblack-800 border border-richblack-700 shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)] hover:bg-richblack-700 hover:text-white hover:border-richblack-500"
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
