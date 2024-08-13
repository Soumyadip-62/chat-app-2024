/* eslint-disable react/no-unescaped-entities */
import GoogleIcon from "@/UI/icons/GoogleIcon";
import PasswordField from "@/UI/PasswordField";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db, serverTimestamp, setDoc, getDoc, doc } from "../../firebase";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "@/Redux/slices/UserSlice";
import Cookies from "universal-cookie";
import { collection, getDocs } from "firebase/firestore";
import Login from "./Login";
import SignUp from "./SignUp";

const AuthComponent = () => {
  const cookies = new Cookies();
  const [issignUp, setissignUp] = useState(false);
  const dispatch = useDispatch();
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);

      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      console.log("Users list - - - - -", userDoc);

      dispatch(
        addUser({
          avatar: result.user.photoURL!,
          email: result.user.email!,
          uid: result.user.uid!,
          name: result.user.displayName!,
          token: result.user.refreshToken,
        })
      );
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          createdAt: new Date(),
        });

        cookies.set("user-token", {
          token: result.user.refreshToken,
         
        });
      } else {
        cookies.set("user-token", {
          token: result.user.refreshToken,
        });
        cookies.set("user", {
          avatar: result.user.photoURL!,
          email: result.user.email!,
          id: result.user.uid!,
          name: result.user.displayName!,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="size-full flex justify-center items-center">
      <div className="login_card max-w-[650px] w-full">
        {issignUp ? (
          <SignUp toggleSignUp={() => setissignUp(false)} />
        ) : (
          <Login toggleSignUp={() => setissignUp(true)} />
        )}
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
