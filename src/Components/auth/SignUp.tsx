import { auth, db, doc, setDoc } from "@/firebase";
import { addUser } from "@/Redux/slices/UserSlice";
import PasswordField from "@/UI/PasswordField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { ChangeEvent, FormEventHandler, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";

type InputData = {
  user_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = ({ toggleSignUp }: { toggleSignUp: () => void }) => {
  const dispatch = useDispatch();

  const cookies = new Cookies();

  const [inputData, setinputData] = useState<InputData>({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setinputData({
      ...inputData,
      [name]: value,
    });
  };
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputData.email,
        inputData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: inputData.user_name,
        email: inputData.email,
        createdAt: new Date(),
      });
      dispatch(
        addUser({
          email: user.email!,
          uid: user.uid!,
          name: inputData.user_name!,
          token: user.refreshToken,
        })
      );

      cookies.set("user-token", {
        token: user.refreshToken,
      });
      cookies.set("user", {
        email: user.email!,
        id: user.uid!,
        name: inputData.user_name!,
      });

      console.log("User registered successfully:", user);
    } catch (error) {
      console.error("Error registering user:", error);
      alert(error);
    }
  };

  return (
    <>
      <div className="mb-20">
        <h1 className="text-6xl mb-6 text-center  font-semibold sm:text-4xl sm:mb-2">
          SignUp To ChatBox
        </h1>
        <p className="text-center text-2xl">One to one personal chats</p>
      </div>
      <form className="w-full" onSubmit={handleFormSubmit}>
        <div className="flex flex-col w-full mb-3">
          <label htmlFor="email" className="mb-2 ml-1 text-lg font-semibold">
            User name
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="common-input"
            name="user_name"
            value={inputData.user_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col w-full mb-3">
          <label htmlFor="email" className="mb-2 ml-1 text-lg font-semibold">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your mail"
            className="common-input"
            name="email"
            value={inputData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col w-full mb-3">
          <label htmlFor="password" className="mb-2 ml-1 text-lg font-semibold">
            Password
          </label>
          <PasswordField
            name="password"
            value={inputData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col w-full mb-3">
          <label htmlFor="password" className="mb-2 ml-1 text-lg font-semibold">
            Confirm Password
          </label>
          <PasswordField
            name="confirmPassword"
            value={inputData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <p>
            Already have an account?{" "}
            <button onClick={toggleSignUp}>Login</button>
          </p>
        </div>

        <button className="custom-button mb-4">Sign Up</button>
      </form>
    </>
  );
};

export default SignUp;
