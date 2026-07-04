/* eslint-disable react/no-unescaped-entities */
import PasswordField from "@/UI/PasswordField";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { ChangeEvent, FormEventHandler, useState } from "react";
import { auth, db, doc, getDoc } from "../../firebase";
import { useDispatch } from "react-redux";
import { addUser, User } from "@/Redux/slices/UserSlice";
import Cookies from "universal-cookie";
import Link from "next/link";
import { useRouter } from "next/router";

type Loginform = {
  email: string;
  password: string;
};

const LoginUI = ({ toggleSignUp }: { toggleSignUp?: () => void }) => {
  const cookies = new Cookies();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const userDetails = await signInWithEmailAndPassword(
      auth,
      loginForm.email,
      loginForm.password
    );

    const user = userDetails.user;
    const usersnap = await getDoc(doc(db, "users", user.uid));
    const userDoc = usersnap.data() as User;
    console.log(userDoc);

    if (usersnap.exists()) {
      dispatch(
        addUser({
          email: user.email!,
          uid: user.uid!,
          name: userDoc.name,
          token: user.refreshToken,
        })
      );

      cookies.set("user-token", {
        token: user.refreshToken,
      });
      cookies.set("user", {
        email: user.email!,
        id: user.uid!,
        name: userDoc.name,
        avatar: userDoc.avatar,
      });

      router.push("/");
    } else {
      alert("Wrong Email or Password");
    }
  };

  const [loginForm, setloginForm] = useState<Loginform>({
    email: "",
    password: "",
  });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setloginForm({
      ...loginForm,
      [name]: value,
    });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl mb-2 text-center font-bold text-gray-100 sm:text-3xl">
          Login to ChatBox
        </h1>
        <p className="text-center text-base text-gray-400">One-to-one personal chats</p>
      </div>
      <form className="w-full flex flex-col space-y-4" onSubmit={handleFormSubmit}>
        <div className="flex flex-col w-full">
          <label htmlFor="email" className="mb-1.5 ml-1 text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="common-input"
            name="email"
            value={loginForm?.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="password" className="mb-1.5 ml-1 text-sm font-medium text-gray-300">
            Password
          </label>
          <PasswordField
            name="password"
            value={loginForm?.password}
            onChange={handleChange}
          />
        </div>

        <div className="text-center text-sm text-gray-400 pt-2">
          <p>
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>

        <button className="custom-button !mt-6">Login</button>
      </form>
    </>
  );
};

export default LoginUI;
