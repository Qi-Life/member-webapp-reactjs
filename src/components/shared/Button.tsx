import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', textColor = 'text-white', ...props }: any) => {
    const baseClasses = 'px-4 py-2 bg-[#059f83] hover:bg-[#166e5e] focus:outline-none font-medium text-center inline-flex items-center';
    const combinedClasses = `${baseClasses} ${textColor} ${className}`;

    return (
        <button type={type} onClick={onClick} className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;
