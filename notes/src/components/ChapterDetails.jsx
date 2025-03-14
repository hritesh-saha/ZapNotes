import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai"; // Import React Icon
import FlipCard from "./Flipcard";

const ChapterDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapter, questions = [], answers = [] } = location.state || {};

  return (
    <div className="bg-gradient-to-b from-[#2a2a3b] to-[#f09561] min-h-screen w-screen p-12">
      {/* Back Button */}
      <button 
        className="flex items-center text-white font-bold mb-4 hover:text-gray-300 hover:border-gray-300 transition cursor-pointer p-3 border-2 border-white rounded-2xl shadow-md shadow-[#2a2a3b]"
        onClick={() => navigate("/")}
      >
        <AiOutlineArrowLeft className="text-2xl mr-2 font-bold" />
        Back to Home
      </button>

      <h2 className="text-white text-3xl text-center font-[cursive] font-extrabold">{chapter}</h2>
      
      <div className="gap-4 mt-8 grid grid-cols-1 md:grid-cols-3 place-items-center">
        {questions.map((q, i) => (
          <FlipCard key={i} question={q} answer={answers[i] || "No answer provided"} />
        ))}
      </div>
    </div>
  );
};

export default ChapterDetails;
