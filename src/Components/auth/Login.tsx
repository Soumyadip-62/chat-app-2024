/* eslint-disable react/no-unescaped-entities */
import PasswordField from "@/UI/PasswordField";
import React, { FormEventHandler } from "react";

const Login = ({ toggleSignUp }: { toggleSignUp: () => void }) => {
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <div className="mb-20">
        <h1 className="text-6xl mb-6 text-center  font-semibold">
          Login To ChatBox
        </h1>
        <p className="text-center text-2xl">One to one personal chats</p>
      </div>
      <form className="w-full" onSubmit={handleFormSubmit}>
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
          <label htmlFor="password" className="mb-2 ml-1 text-lg font-semibold">
            Password
          </label>
          <PasswordField />
        </div>

        <div>
          <p>
            Don't have an account?
            <button onClick={toggleSignUp}>Sign up</button>
          </p>
        </div>

        <button className="custom-button mb-4">Login</button>
      </form>
    </>
  );
};

export default Login;
