import React from 'react';

interface DownIconProps {
    width?: string;
    height?: string;
    fillColor?: string;
    className?: string;
}

const DownIcon: React.FC<DownIconProps> = ({
    width = 'w-[10px]',
    height = ' h-[10px]',
    fillColor = 'fill-black',
    className = '',
}) => {
    return (
        <div className={`${className}`}>
            <svg className={`${width} ${height} ${fillColor}`}  viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.2841 1.69827L6.69827 6.28405C6.31262 6.6697 5.68737 6.6697 5.30173 6.28405L0.715944 1.69827C0.0938537 1.07618 0.534445 0.0125002 1.41421 0.0125002L10.5858 0.0124998C11.4656 0.0124997 11.9061 1.07618 11.2841 1.69827Z" fill="white" stroke="#424847" stroke-width="0.025" />
            </svg>

        </div>
    );
};


export default DownIcon;
