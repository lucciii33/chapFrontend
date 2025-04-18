import React from "react";

const DogLoader = () => {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-teal-500 animate-spin"></div>
        <div className="absolute inset-3 rounded-full bg-blue-100" />
      </div>
    </div>
  );
};

export default DogLoader;
