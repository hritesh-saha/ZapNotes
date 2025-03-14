import { FaFileUpload } from "react-icons/fa";

const AnimatedButton = ({ handleUpload, loading }) => {
  return (
    <div className="flex justify-center mt-5">
      <button
        onClick={handleUpload}
        className="relative overflow-hidden rounded-3xl  bg-orange-500 text-white shadow-lg border-none cursor-pointer flex items-center font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {/* Background animation */}
        <span className="absolute inset-0 bg-[#2a1f1f] transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>

        <span className="relative flex items-center">
          {/* Icon Section */}
          <span className="w-12 h-10 bg-[#2a1f1f] flex justify-center items-center text-white pl-1 pb-1">
            <FaFileUpload size={20} />
          </span>
          {/* Text Section */}
          <span className="pr-6 pl-3 py-2  text-white transition-colors duration-200 group-hover:text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
            {loading ? "Uploading..." : "Upload PDF"}
          </span>
        </span>
      </button>
    </div>
  );
};

export default AnimatedButton;
