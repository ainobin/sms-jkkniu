// src/components/ui/Input.js
import React from 'react';

const Input = ({ type, name, value, onChange, placeholder, className }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} px-4 py-2 border rounded-md w-full outline-none focus:ring-2 focus:ring-[#008337]`}
    />
  );
};

export default Input;
