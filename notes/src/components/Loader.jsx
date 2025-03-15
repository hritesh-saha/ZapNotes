import React from "react";

const Loader = () => {
  return (
    <div className="relative w-32 h-24 mx-auto">
      {/* Bouncing Ball */}
      <div className="absolute bottom-8 left-[50px] h-8 w-8 bg-[#FF5733] rounded-full animate-bounce" />
      
      {/* Steps */}
      <div
        className="absolute right-0 top-0 h-[7px] w-[45px] rounded-md shadow-[0_5px_0_#f2f2f2,-35px_50px_0_#f2f2f2,-70px_95px_0_#f2f2f2] animate-[loading-step_1s_ease-in-out_infinite]"
      />

      <style>
        {`
          @keyframes loading-step {
            0% {
              box-shadow: 0 10px 0 rgba(0, 0, 0, 0),
                0 10px 0 #f2f2f2,
                -35px 50px 0 #f2f2f2,
                -70px 90px 0 #f2f2f2;
            }
            100% {
              box-shadow: 0 10px 0 #f2f2f2,
                -35px 50px 0 #f2f2f2,
                -70px 90px 0 #f2f2f2,
                -70px 90px 0 rgba(0, 0, 0, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
