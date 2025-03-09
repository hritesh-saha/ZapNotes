import React, { useState } from 'react'
import Navbar from './Navbar'

const Home = () => {
  const[image,setImage]= useState(null);

  const handleFileChange = (event) =>{
    const file=event.target.files[0];
    if(file){
      setImage(file);
    }
  }

  return (
    <div className='bg-gradient-to-b from-[#2a2a3b] to-[#f09561] h-screen w-screen'>
        <Navbar/>
        <div className='flex items-center justify-center flex-col gap-6 mt-5'>
        <h1 className='text-5xl text-[#f09561] font-bold font-[cursive]'>📒ZapNotes</h1>
        <h3 className='text-[#f09561] font-bold ml-4 text-2xl font-[cursive]'>Capture, Organize, and Elevate Your Notes Effortlessly! ⚡</h3>
        </div>
        <div className="flex justify-center">
        <div className='flex items-center mt-6 p-6 bg-stone-800 hover:bg-stone-700 rounded-xl shadow-md transition-all duration-300'>
        <label htmlFor="PdfUpload" className='w-56 h-56 border-dashed border-2 border-gray-400 flex flex-col items-center justify-center bg-stone-900 cursor-pointer rounded-lg hover:bg-stone-800 hover:text-stone-200'>
              <span className='text-lg font-bold text-white font-[cursive] hover:text-stone-200'>Upload PDF</span>
              <span className='text-sm font-bold text-white mt-2 font-[cursive] hover:text-stone-200'>(Upload only .pdf)</span>
            </label>
          <input id='PdfUpload' type="file" accept='application/pdf' className='hidden' onChange={handleFileChange} />
        </div>
        </div>
    </div>
  )
}

export default Home