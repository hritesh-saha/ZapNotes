import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import FlipCard from "./Flipcard";

const TopicDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { topic, questions = [], answers = [] } = location.state || {};

  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 6;

  // Memoize the combined flashcard data to avoid re-calculating on every render
  const allFlashcards = useMemo(
    () =>
      questions.map((q, i) => ({
        question: q,
        answer: answers[i] || "No answer provided",
      })),
    [questions, answers]
  );

  // Calculate pagination variables
  const totalPages = Math.ceil(allFlashcards.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentFlashcards = allFlashcards.slice(startIndex, endIndex);

  // Handlers for changing the page
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="bg-gradient-to-b from-[#2a2a3b] to-[#f09561] min-h-screen w-screen p-6 sm:p-12">
      <button
        className="flex items-center text-white font-bold mb-4 hover:text-gray-300 hover:border-gray-300 transition cursor-pointer p-3 border-2 border-white rounded-2xl shadow-md shadow-[#2a2a3b]"
        onClick={() => navigate("/")}
      >
        <AiOutlineArrowLeft className="text-2xl mr-2 font-bold" />
        <span className="hidden md:inline">Back to Home</span>
      </button>

      <h2 className="text-white text-3xl text-center font-[cursive] font-extrabold mb-4">
        {topic}
      </h2>

      {/* The grid now maps over the sliced 'currentFlashcards' array */}
      <div className="px-4 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-center place-items-center">
        {currentFlashcards.map((card, i) => (
          <div key={i} className="w-full max-w-[280px] flex justify-center">
            <FlipCard question={card.question} answer={card.answer} />
          </div>
        ))}
      </div>

      {/* ✨ 5. Pagination Controls UI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 font-bold text-white bg-white/10 border border-white/30 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            Previous
          </button>

          <span className="font-bold text-white font-[cursive]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 font-bold text-white bg-white/10 border border-white/30 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicDetails;
