import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import UploadBox from "./UploadBox";
import AnimatedButton from "./AnimatedButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null);
  const [response, setResponse] = useState(() => {
    return JSON.parse(localStorage.getItem("responseData")) || null;
  });
  const [loading, setLoading] = useState(false);

  // Ensure local storage is updated correctly
  useEffect(() => {
    if (response) {
      localStorage.removeItem("responseData"); // Clear before setting new data
      localStorage.setItem("responseData", JSON.stringify(response));
    }
  }, [response]);

  // Function to handle file upload
  const handleUpload = async () => {
    if (!pdf) {
      alert("Please upload a PDF first.");
      return;
    }

    localStorage.removeItem("responseData"); // Clear previous response before making a new request

    const formData = new FormData();
    formData.append("file", pdf);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/extract-qa-from-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("API Response:", res.data);
      setResponse(res.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#2a2a3b] to-[#f09561] min-h-screen w-screen">
      <Navbar />
      <div className="flex items-center justify-center flex-col gap-4 mt-5 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#f09561] font-bold font-[cursive]">
          📒ZapNotes
        </h1>
        <h3 className="text-lg sm:text-xl md:text-2xl text-[#f09561] font-bold font-[cursive]">
          Capture, Organize, and Elevate Your Notes Effortlessly! ⚡
        </h3>
      </div>

      {/* Upload Box Component */}
      <UploadBox image={pdf} setImage={setPdf} />

      {/* Upload Button */}
      <AnimatedButton handleUpload={handleUpload} loading={loading} />

      {/* Display Extracted Topics */}
      {response && (response.length!==0) &&  (
        <div className="flex flex-col justify-center items-center">
          <h2 className="font-[cursive] p-4 mt-4 mb-2 text-3xl text-white">
            TOPICS:
          </h2>
        </div>
      )}
      {response && (response.length!==0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-16 py-3 sm:place-items-center md:place-items-start">
          {response.chapters.map((item, index) => (
            <li
              key={index}
              className="text-[#f5f5f5] text-center bg-white/10 backdrop-blur-md font-[cursive] border-2 shadow-lg shadow-[#2a2a3b] p-2 list-none w-2/3 mb-3 cursor-pointer rounded-2xl"
              onClick={() =>
                navigate(`/chapter/${index}`, {
                  state: {
                    chapter: item.chapter,
                    questions: item.questions,
                    answers: item.answers,
                  },
                })
              }
            >
              {index + 1}.&emsp;{item.chapter}
            </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
