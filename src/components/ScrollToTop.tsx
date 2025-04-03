import React from 'react';
import { FaAngleLeft } from 'react-icons/fa6';

const ScrollToTop = () => {
  return (
    <div className="rotate-90 h-9 w-9 sm:w-12 sm:h-12 bg-[#8888] hover:bg-[#555] duration-300 ease-in-out rounded-full flex items-center justify-center cursor-pointer">
      <FaAngleLeft size={20} color="white" />
    </div>
  );
};

export default ScrollToTop;
