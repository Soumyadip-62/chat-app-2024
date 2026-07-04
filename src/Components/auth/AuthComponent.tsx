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
    <div className="min-h-screen w-full flex justify-center items-center py-10 px-4">
      <div className="glass-panel max-w-[520px] w-full p-8 md:p-6 rounded-[24px] shadow-2xl flex flex-col">
        {issignUp ? (
          <SignUp  />
        ) : (
          <Login toggleSignUp={() => setissignUp(true)} />
        )}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
        <button
          className="w-full py-3.5 px-4 font-semibold rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
          onClick={signInWithGoogle}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default AuthComponent;
