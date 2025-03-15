import React, { useState } from "react";

const FlipCard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-80 h-90 font-[cursive] text-2xl text-center perspective cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side (Question) */}
        <div className="absolute w-full h-full flex items-center justify-center bg-[#6A0DAD] linear-gradient(135deg, #6A0DAD, #4B0082) text-white p-4 border-4 border-[#6A2C70] rounded-lg shadow-lg transform backface-hidden">
          {question}
        </div>

        {/* Back Side (Answer) */}
        <div className="absolute w-full h-full flex items-center justify-center bg-[#FF5733] text-white p-4 border-4 border-[#F08A5D] rounded-lg shadow-lg transform rotate-y-180 backface-hidden">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
