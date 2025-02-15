import React from "react";

export default function TextInput({
  id,
  placeholder,
  onChange,
  isPass = false,
  className = "",
}) {
  return (
    <input
      type={isPass ? "password" : "text"}
      id={id}
      name={id}
      className={`
        w-full
        px-4
        py-3
        text-gray-700
        bg-white
        border
        border-gray-300
        rounded-lg
        transition-all
        duration-200
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-transparent
        ${className}
      `}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
