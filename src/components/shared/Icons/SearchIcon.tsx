import React from 'react';

const SearchIcon = (props: any) => {
  const { w, h } = props;
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width={w} height={h} viewBox="0 0 28.284 28.284">
        <g id="Group_450" data-name="Group 450" transform="translate(0 14.142) rotate(-45)">
          <g
            id="Ellipse_31"
            data-name="Ellipse 31"
            transform="translate(0 0)"
            fill="none"
            stroke="#707070"
            strokeWidth="2"
          >
            <circle cx="10" cy="10" r="10" stroke="none" />
            <circle cx="10" cy="10" r="9" fill="none" />
          </g>
          <line
            id="Line_24"
            data-name="Line 24"
            y2="8"
            transform="translate(10 18.5)"
            fill="none"
            stroke="#707070"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
};

export default SearchIcon;
