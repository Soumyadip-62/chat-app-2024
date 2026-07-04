import { auth, db, doc, setDoc } from "@/firebase";
import { addUser } from "@/Redux/slices/UserSlice";
import PasswordField from "@/UI/PasswordField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEventHandler, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";

type InputData = {
  user_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpUI = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cookies = new Cookies();

  const [inputData, setinputData] = useState<InputData>({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },

  } = useForm<InputData>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setinputData({
      ...inputData,
      [name]: value,
    });
  };
  const handleFormSubmit = async (data: InputData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: data.user_name,
        email: data.email,
        createdAt: new Date(),
      });
      dispatch(
        addUser({
          email: user.email!,
          uid: user.uid!,
          name: data.user_name!,
          token: user.refreshToken,
        })
      );

      cookies.set("user-token", {
        token: user.refreshToken,
      });

      router.push("/");
      cookies.set("user", {
        email: user.email!,
        id: user.uid!,
        name: data.user_name!,
      });

      console.log("User registered successfully:", user);
    } catch (error) {
      console.error("Error registering user:", error);
      alert(error);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl mb-2 text-center font-bold text-gray-100 sm:text-3xl">
          SignUp to ChatBox
        </h1>
        <p className="text-center text-base text-gray-400">One-to-one personal chats</p>
      </div>
      <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex flex-col w-full">
          <label htmlFor="user_name" className="mb-1.5 ml-1 text-sm font-medium text-gray-300">
            Username
          </label>
          <Controller
            control={control}
            name="user_name"
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter your username"
                className="common-input"
              />
            )}
          />
          {errors.user_name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.user_name.message}</p>}
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="email" className="mb-1.5 ml-1 text-sm font-medium text-gray-300">
            Email
          </label>
          <Controller
            control={control}
            name="email"
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Enter your email"
                className="common-input"
              />
            )}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="password" className="mb-1.5 ml-1 text-sm font-medium text-gray-300">
            Password
          </label>
          <Controller
            control={control}
            name="password"
            rules={{ required: 'Password is required', minLength: 6, min: 'Password must be at least 6 characters' }}
            render={({ field }) => (
              <PasswordField
                {...field}
              />
            )}
          />
          {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="confirmPassword" className="mb-1.5 ml-1 text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ required: 'Confirm password is required', minLength: 6, min: 'Password must be at least 6 characters' }}
            render={({ field }) => (
              <PasswordField
                {...field}
              />
            )}
          />
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword?.message}</p>}
        </div>

        <div className="text-center text-sm text-gray-400 pt-2">
          <p>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors duration-200">
              Login
            </Link>
          </p>
        </div>

        <button className="custom-button !mt-6">Sign Up</button>
      </form>
    </>
  );
};

export default SignUpUI;
