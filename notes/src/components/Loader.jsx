import React, { useState, useEffect } from "react";

const Loader = () => {
  const loadingMessages = [
    "Analyzing PDF...",
    "Extracting key topics...",
    "Building flashcards...",
    "Just a moment...",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // The modulo operator (%) ensures the index loops back to 0
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 5000); // Change text every 5s

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative h-24 w-24">
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f09561]"></div>
        <div className="absolute inset-0 h-full w-full animate-spin rounded-full border-2 border-transparent border-t-[#f09561] [animation-duration:1s]"></div>
        <div className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] animate-reverse-spin rounded-full border-2 border-transparent border-t-white/80 [animation-duration:1.5s]"></div>
        <div className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] animate-spin rounded-full border-2 border-transparent border-t-white/60 [animation-duration:2.5s]"></div>
      </div>

      <p className="font-[cursive] text-lg text-white animate-pulse">
        {loadingMessages[currentIndex]}
      </p>

      <style>
        {`
          @keyframes reverse-spin {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
          .animate-reverse-spin {
            animation: reverse-spin linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;