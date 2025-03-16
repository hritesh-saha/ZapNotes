import React from 'react'
import { AiOutlineThunderbolt } from "react-icons/ai";
import { MdQuiz } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ chapters }) => {
    const navigate=useNavigate();
    const handleQuizClick = () => {
        if (!chapters || chapters.length === 0) {
          alert("No quiz data available. Upload a PDF first!");
          return;
        }
        navigate("/quiz", { state: { chapters } });
      };

  return (
    <div className='h-[10vh] px-5 py-3 border border-black shadow-sm shadow-stone-900'>
        <div className='flex justify-between h-full'>
            <div className='text-2xl pt-0.5 lg:pt-1.5 font-bold text-[#f09561] flex flex-row-reverse font-[cursive]'>
                <AiOutlineThunderbolt/> ZapNotes
            </div>
            <div className='flex flex-row justify-between text-[#f09561] mr-6 md:mr-22'>
                <h1 className='pt-1 lg:pt-2 text-2xl hover:text-orange-600 cursor-pointer font-bold flex flex-row font-[cursive]'
                onClick={handleQuizClick}>
                    <MdQuiz className='mt-1 mr-2 '/>Quiz
                </h1>
                {/* <div className='ml-6 w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center hover:text-orange-600 cursor-pointer font-bold'>H</div> */}
            </div>
        </div>
    </div>
  )
}

export default Navbar