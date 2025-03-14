import React from "react";

const UploadBox = ({ image, setImage }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveFile = (event) => {
    event.stopPropagation(); // Prevent accidental triggering of file upload
    setImage(null);
  };

  return (
    <div>
      {/* Upload Box */}
      <div className="flex justify-center">
        <div className="flex items-center mt-6 p-6 bg-stone-800 hover:bg-stone-700 rounded-xl shadow-md transition-all duration-300">
          <div className="relative">
            <label
              htmlFor="PdfUpload"
              className="w-56 h-56 border-dashed border-2 border-gray-400 flex flex-col items-center justify-center bg-stone-900 cursor-pointer rounded-lg hover:bg-stone-800 hover:text-stone-200"
            >
              {image ? (
                <span className="text-lg font-bold text-white font-[cursive] overflow-hidden text-ellipsis whitespace-nowrap w-[90%] text-center px-4">
                  {image.name}
                </span>
              ) : (
                <>
                  <span className="text-lg font-bold text-white font-[cursive] hover:text-stone-200">
                    Upload PDF
                  </span>
                  <span className="text-sm font-bold text-white mt-2 font-[cursive] hover:text-stone-200">
                    (Upload only .pdf)
                  </span>
                </>
              )}
            </label>
            <input
              id="PdfUpload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {image && (
              <button
                className="absolute bottom-14 left-1/2 transform -translate-x-1/2 mt-3 px-5 py-1 bg-[#f09561] text-white rounded-md hover:text-orange-600 cursor-pointer font-[cursive]"
                onClick={handleRemoveFile}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBox;
