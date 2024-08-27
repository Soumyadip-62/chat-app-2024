/* eslint-disable react/no-unescaped-entities */
import PasswordField from "@/UI/PasswordField";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { ChangeEvent, FormEventHandler, useState } from "react";
import { auth, db, doc, getDoc } from "../../firebase";
import { useDispatch } from "react-redux";
import { addUser, User } from "@/Redux/slices/UserSlice";
import Cookies from "universal-cookie";

type Loginform = {
  email: string;
  password: string;
};

const Login = ({ toggleSignUp }: { toggleSignUp: () => void }) => {
  const cookies = new Cookies();
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
      <div className="mb-20">
        <h1 className="text-6xl mb-6 text-center  font-semibold sm:text-4xl sm:mb-2">
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
            name="email"
            value={loginForm?.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full mb-3">
          <label htmlFor="password" className="mb-2 ml-1 text-lg font-semibold">
            Password
          </label>
          <PasswordField
            name="password"
            value={loginForm?.password}
            onChange={handleChange}
          />
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
