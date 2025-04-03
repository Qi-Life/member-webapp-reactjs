import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const MHolisticHeathLanding = () => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false);

  const handleTouchStart = () => {
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    localStorage.setItem('isStartholistic', "0")
  }, [])

  return (
    <div className="h-screen flex flex-wrap flex-col items-center justify-center">
      <h2 className="flex flex-col items-center text-[47px] text-[#39353D] leading-[58px] font-medium mb-10">
        <span className="animate-slide-up">HOLISTIC</span>
        <span className="animate-slide-up delay-150">WELLNESS</span>
        <span className="animate-slide-up delay-300">ASSESSMENT</span>
      </h2>
      <button
        className={`border border-[#39353D] w-[90%] p-[10px] rounded-2xl text-[20px] animate-slide-up ${isHovered ? "bg-[#297D824D]" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate('/holistic-health/m-start')}>
        Take it now
      </button>
    </div>
  );
};

export default MHolisticHeathLanding;
