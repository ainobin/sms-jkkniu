// src/components/ui/Button.js
import React from 'react';

const Button = ({ onClick, className, children }) => {
  return (
    <button 
      onClick={onClick} 
      className={`${className} py-2 px-4 rounded-md font-medium cursor-pointer transition duration-300 ease-in-out hover:opacity-80`}
    >
      {children}
    </button>
  );
};

export default Button;
