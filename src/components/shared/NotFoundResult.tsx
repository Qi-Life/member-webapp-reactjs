import React from "react";

const NotFoundResult = ({ message = "No results found!" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50 py-20 px-4">
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-gray-600">{message}</h1>
    </div>
  );
};

export default NotFoundResult;
