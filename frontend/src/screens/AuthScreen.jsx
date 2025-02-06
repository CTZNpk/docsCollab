import React from "react";
import TextInput from "../components/TextInput";

export default function AuthScreen({ isLogin }) {
  return (
    <div
      className="flex flex-col min-h-screen md:flex-row bg-[url('/background.jpeg')]
      bg-cover bg-center "
    >
      <div
        className="min-h-screen  text-black 
        flex items-center justify-center text-5xl p-[100px]"
      >
        <form
          className="flex flex-col gap-5 bg-blue-400 bg-opacity-75 
          rounded-xl p-[50px]"
        >
          <h1 className="font-bold text-center m-10">
            {isLogin ? "LOGIN" : "SIGNUP"}
          </h1>

          {!isLogin && (
            <>
              <TextInput id="username" placeholder="Enter Username" />
            </>
          )}

          <TextInput id="email" placeholder="Enter Email" />

          <TextInput id="password" placeholder="Enter Password" />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 p-5 rounded-xl 
            mt-[15px] text-white font-bold"
          >
            {isLogin ? "Login" : "SignUp"}
          </button>
        </form>
      </div>
    </div>
  );
}
