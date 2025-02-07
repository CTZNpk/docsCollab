import React from "react";

export default function Drawer({ isOpen }) {
  return (
    <div
      className={`fixed left-0 h-full w-[300px] bg-blue-100 shadow-xl 
        transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div
        className="font-bold bg-blue-800 text-white p-10 text-center
        text-3xl"
      >
        My Documents
      </div>
      <div className="p-5 text-2xl">
        <div className="border-b-2 border-blue-900 p-5 "> THIS IS A Doc</div>
        <div className="border-b-2 border-blue-900 p-5 "> THIS IS A Doc</div>
        <div className="border-b-2 border-blue-900 p-5 "> THIS IS A Doc</div>
        <div className="border-b-2 border-blue-900 p-5 "> THIS IS A Doc</div>
        <div className="border-b-2 border-blue-900 p-5 "> THIS IS A Doc</div>
      </div>
    </div>
  );
}
