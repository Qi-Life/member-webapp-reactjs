import React from 'react';

const FilterIcon = () => {
  return (
    <svg
      className="h-8 w-8 text-white"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {' '}
      <path stroke="none" d="M0 0h24v24H0z" />{' '}
      <path d="M5.5 5h13a1 1 0 0 1 0.5 1.5L14 12L14 19L10 16L10 12L5 6.5a1 1 0 0 1 0.5 -1.5" />
    </svg>
  );
};

export default FilterIcon;
