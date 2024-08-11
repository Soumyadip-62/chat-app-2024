/* eslint-disable react/no-unescaped-entities */
import GoogleIcon from "@/UI/icons/GoogleIcon";
import PasswordField from "@/UI/PasswordField";

import React from "react";

const AuthComponent = () => {
  return (
    <div className="size-full flex justify-center items-center">
      <div className="login_card max-w-[650px] w-full">
        <div className="mb-20">
          <h1 className="text-6xl mb-6 text-center  font-semibold">
            Login To ChatBox
          </h1>
          <p className="text-center text-2xl">One to one personal chats</p>
        </div>
        <form action="" className="w-full">
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="email" className="mb-2 ml-1 text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your mail"
              className="common-input"
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label
              htmlFor="password"
              className="mb-2 ml-1 text-lg font-semibold"
            >
              Password
            </label>
            <PasswordField />
          </div>

          <div>
            <p>
              Don't have an account? <a href="#">Sign up</a>
            </p>
          </div>

          <button className="custom-button mb-4">Login</button>
          <button className="custom-button !bg-white !text-black">
            <i className="mr-2">
              <GoogleIcon />
            </i>{" "}
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthComponent;
