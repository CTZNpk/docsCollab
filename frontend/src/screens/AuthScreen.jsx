import React, { useState } from "react";
import TextInput from "../components/TextInput";
import useAuth from "../hooks/useAuth";

export default function AuthScreen() {
  const { handleSignUp, handleSignIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const { email, password } = formData;
      await handleSignIn({ email, password });
    } else {
      const { username, email, password } = formData;
      await handleSignUp({ username, email, password });
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen md:flex-row bg-[url('/background.jpeg')]
      bg-cover bg-center"
    >
      <div
        className="min-h-screen  text-black 
        flex items-center justify-center  text-lg md:text-4xl p-5 md:p-[100px]"
      >
        <form
          className="flex flex-col gap-3 md:gap-5 bg-blue-400 bg-opacity-75 
          rounded-xl p-[50px]"
          onSubmit={handleSubmit}
        >
          <h1 className="font-bold text-center md:m-10">
            {isLogin ? "LOGIN" : "SIGNUP"}
          </h1>
          {!isLogin && (
            <>
              <TextInput
                id="username"
                placeholder="Enter Username"
                onChange={handleChange}
              />
            </>
          )}
          <TextInput
            id="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />
          <TextInput
            id="password"
            isPass={true}
            placeholder="Enter Password"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 p-5 rounded-xl 
            mt-[15px] text-white font-bold"
          >
            {isLogin ? "Login" : "SignUp"}
          </button>
          <div className="text-center mt-10">
            <span>
              {isLogin ? "Need an account? " : "Already have an account? "}
              <a
                href="#"
                onClick={toggleAuth}
                className="text-blue-900 underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </a>
            </span>
          </div>{" "}
        </form>
      </div>
    </div>
  );
}
