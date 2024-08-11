/* eslint-disable react/no-unescaped-entities */
import GoogleIcon from "@/UI/icons/GoogleIcon";
import PasswordField from "@/UI/PasswordField";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { addUser } from "@/Redux/slices/UserSlice";
import Cookies from "universal-cookie";

const AuthComponent = () => {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);

      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      dispatch(
        addUser({
          avatar: result.user.photoURL!,
          email: result.user.email!,
          id: result.user.uid!,
          name: result.user.displayName!,
          token: result.user.refreshToken,
        })
      );
      if (!userDoc.exists()) {
        // If the user doesn't exist, add them to the 'users' collection
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          createdAt: new Date(),
        });
        cookies.set("user-token", {
          token: result.user.refreshToken,
          user: {
            avatar: result.user.photoURL!,
            email: result.user.email!,
            id: result.user.uid!,
            name: result.user.displayName!,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="size-full flex justify-center items-center">
      <div className="login_card max-w-[650px] w-full">
        <div className="mb-20">
          <h1 className="text-6xl mb-6 text-center  font-semibold">
            Login To ChatBox
          </h1>
          <p className="text-center text-2xl">One to one personal chats</p>
        </div>
        <form className="w-full">
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
        </form>
        <button
          className="custom-button !bg-white !text-black"
          onClick={signInWithGoogle}
        >
          <i className="mr-2">
            <GoogleIcon />
          </i>{" "}
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default AuthComponent;
