import React from "react";

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
  return (
    <div
      className={`w-[360px] lg:w-[30%] ${
        currentCard === cardData?.heading
          ? "bg-richblack-900/80 backdrop-blur-md shadow-[0_0_30px_rgba(31,162,255,0.4)] border-[1px] border-blue-500 scale-105 z-10"
          : "bg-[#050505] border-[1px] border-white/5 hover:border-white/20 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      }  text-richblack-25 h-[300px] box-border cursor-pointer rounded-2xl transition-all duration-300 relative overflow-hidden`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      {/* Subtle glow for active card */}
      {currentCard === cardData?.heading && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 to-caribbeangreen-200 shadow-[0_0_10px_rgba(31,162,255,0.8)]"></div>
      )}
      <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
        <div
          className={` ${
            currentCard === cardData?.heading && "text-richblack-800"
          } font-semibold text-[20px]`}
        >
          {cardData?.heading}
        </div>

        <div className="text-richblack-400">{cardData?.description}</div>
      </div>

      <div
        className={`flex justify-between ${
          currentCard === cardData?.heading ? "text-blue-300" : "text-richblack-300"
        } px-6 py-3 font-medium`}
      >
        {/* Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        {/* Flow Chart */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessionNumber} Lession</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
