import React from 'react'
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className='h-[10vh] px-5 py-3 border border-black shadow-sm shadow-stone-900'>
        <div className='flex justify-between h-full'>
            <div className='text-2xl pt-1 font-bold text-[#f09561] flex flex-row-reverse font-[cursive]'>
                <AiOutlineThunderbolt/> ZapNotes
            </div>
            <div className='flex flex-row justify-between text-[#f09561] mr-6'>
                <h1 className='pt-3 hover:text-orange-600 cursor-pointer font-bold flex flex-row'>
                    <FaHistory className='mt-1 mr-2'/>History
                </h1>
                <div className='ml-6 w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center hover:text-orange-600 cursor-pointer font-bold'>H</div>
            </div>
        </div>
    </div>
  )
}

export default Navbar