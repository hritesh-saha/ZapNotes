import { useRef,useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const StylishDropdown = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className="relative w-full max-w-[280px] font-[cursive]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-2xl border-2 border-white/20 bg-white/10 p-3 text-center text-[#f5f5f5] shadow-lg shadow-[#2a2a3b] backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-[#f09561]"
      >
        <span>{selectedOption ? selectedOption.label : "Select an Option"}</span>
        <FaChevronDown
          className={`h-5 w-5 text-gray-300 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full origin-top-right rounded-2xl border-2 border-white/20 bg-[#2a2a3b]/80 shadow-lg backdrop-blur-md">
          <ul className="p-2">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className="cursor-pointer rounded-lg p-3 text-center text-white transition-colors hover:bg-[#f09561]/50"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StylishDropdown;