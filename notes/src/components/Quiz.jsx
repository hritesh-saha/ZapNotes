// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import FlipCard from "./Flipcard";
// import { AiOutlineArrowLeft } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";

// const Quiz = () => {
//   const location = useLocation();
//   const navigate=useNavigate();
//   const { chapters } = location.state || { chapters: [] };

//   const [selectedQuestions, setSelectedQuestions] = useState([]);
//   //   console.log(chapters);

//   useEffect(() => {
//     if (chapters.chapters.length > 0) {
//       const allQuestions = [];

//       // Collect all questions from all chapters
//       chapters.chapters.forEach((chapter) => {
//         chapter.questions.forEach((question, index) => {
//           allQuestions.push({
//             question: question,
//             answer: chapter.answers[index],
//           });
//         });
//       });

//       // Shuffle the questions to ensure randomness
//       const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());

//       // Select a limited number of random questions (e.g., 5 questions)
//       setSelectedQuestions(shuffledQuestions.slice(0, 16));
//     }
//   }, [chapters]);

//   return (
//     <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2a2a3b] to-[#f09561] min-h-screen w-screen text-white p-4">
//       {/* Back Button */}
//       <div className="w-full flex justify-start">
//         <button
//           className="flex items-center text-white font-bold mb-4 hover:text-gray-300 hover:border-gray-300 transition cursor-pointer p-3 border-2 border-white rounded-2xl shadow-md shadow-[#2a2a3b]"
//           onClick={() => navigate("/")}
//         >
//           <AiOutlineArrowLeft className="text-2xl mr-2 font-bold" />
//           <span className="hidden md:inline">Back to Home</span>
//         </button>
//       </div>

//       <h1 className="text-3xl font-bold mb-6 font-[cursive]">
//         📚 Revision Quiz
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
//         {selectedQuestions.length > 0 ? (
//           selectedQuestions.map((qa, i) => (
//            <div key={i} className="w-full max-w-[280px] flex justify-center">
//             <FlipCard
//               question={qa.question}
//               answer={qa.answer}
//             />
//           </div>
//           ))
//         ) : (
//           <div className="flex justify-center items-center col-span-3 min-h-[150px]">
//             <p className="text-xl text-gray-300 font-cursive">
//               No questions available.
//             </p>
//           </div>
//         )}
//       </div>

//       <button
//         onClick={() => window.location.reload()}
//         className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-200"
//       >
//         🔄 Refresh for New Questions
//       </button>
//     </div>
//   );
// };

// export default Quiz;
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlipCard from "./Flipcard";
import { AiOutlineArrowLeft } from "react-icons/ai";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✨ 1. Destructure 'type' and 'data' from the new state object
  const { type, data } = location.state || { type: "", data: [] };

  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // This effect runs only when 'data' changes, preparing all questions
  useEffect(() => {
    if (data && data.length > 0) {
      const flattenedQuestions = data.flatMap((item) =>
        item.questions.map((question, index) => ({
          question: question,
          answer: item.answers[index],
        }))
      );
      setAllQuestions(flattenedQuestions);
    }
  }, [data]);

  // ✨ 2. A function to shuffle and select a new set of questions
  const generateNewQuiz = useCallback(() => {
    if (allQuestions.length > 0) {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      setSelectedQuestions(shuffled.slice(0, 16));
    }
  }, [allQuestions]);

  // This effect generates the first quiz once all questions are ready
  useEffect(() => {
    generateNewQuiz();
  }, [allQuestions, generateNewQuiz]);

  // ✨ 3. Create a dynamic title based on the 'type'
  const quizTitle =
    type === "chapters" ? "Chapters Revision Quiz" : "Topics Revision Quiz";

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2a2a3b] to-[#f09561] min-h-screen w-screen text-white p-4">
      <div className="w-full flex justify-start self-start px-4 sm:px-8 md:px-12">
        <button
          className="flex items-center text-white font-bold mb-4 hover:text-gray-300 hover:border-gray-300 transition cursor-pointer p-3 border-2 border-white rounded-2xl shadow-md shadow-[#2a2a3b]"
          onClick={() => navigate("/")}
        >
          <AiOutlineArrowLeft className="text-2xl mr-2 font-bold" />
          <span className="hidden md:inline">Back to Home</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 font-[cursive]">📚 {quizTitle}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center w-full px-4 sm:px-8 md:px-12">
        {selectedQuestions.length > 0 ? (
          selectedQuestions.map((qa, i) => (
            <div key={i} className="w-full max-w-[280px] flex justify-center">
              <FlipCard question={qa.question} answer={qa.answer} />
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center col-span-full min-h-[150px]">
            <p className="text-xl text-gray-300 font-cursive">
              No questions available.
            </p>
          </div>
        )}
      </div>

      {selectedQuestions.length > 0 && (
        // The "Refresh" button calls function without reloading the page
        <button
          onClick={generateNewQuiz}
          className="mt-8 rounded-lg border border-white/30 bg-white/20 px-6 py-3
             font-bold text-white shadow-lg backdrop-blur-sm
             transition-all duration-300 hover:bg-white/30 hover:shadow-xl"
        >
          🔄 Get New Questions
        </button>
      )}
    </div>
  );
};

export default Quiz;
