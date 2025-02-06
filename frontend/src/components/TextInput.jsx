import React from "react";

export default function TextInput({ id, placeholder, onChange }) {
  return (
    <input
      type="text"
      id={id}
      name={id}
      className="p-5 rounded-lg bg-gray-200 
            focus:border-blue-500 focus:ring-4 focus:ring-blue-500 outline-none"
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
