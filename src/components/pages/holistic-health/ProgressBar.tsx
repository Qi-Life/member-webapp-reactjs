import React from 'react';

const ProgressBar = ({ progress, progressColor }: any) => {
  return (
    <div className="w-full h-[7px] bg-gray-300 rounded-full">
      <div
        className={`h-full rounded-full transition-all duration-500 bg-[${progressColor}]`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

ProgressBar.defaultProps = {
  progress: 0,
  progressColor: '#297D82'
}

export default ProgressBar;
