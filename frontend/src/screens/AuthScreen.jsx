import React from "react";

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
              <h1> UserName </h1>
              <input
                type="text"
                id="name"
                name="name"
                className="p-2 rounded-lg"
              />
            </>
          )}

          <h1> Email </h1>
          <input
            type="text"
            id="email"
            name="email"
            className="p-2 rounded-lg"
          />

          <h1> Password </h1>
          <input
            type="password"
            id="password"
            name="password"
            className="p-2 rounded-lg"
          />

          <button
            type="submit"
            className="bg-blue-500 p-5 rounded-xl mt-[15px]"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
