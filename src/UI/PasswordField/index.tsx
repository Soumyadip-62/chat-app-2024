import React, { HTMLAttributes, useState } from "react";
import EyeOpenIcon from "../icons/EyeOpenIcon";
import EyeCloseicon from "../icons/EyeCloseicon";

interface PasswordFieldprops extends HTMLAttributes<HTMLInputElement> {
  value?: string;
  name?: string;
}
const PasswordField = ({ value, name, ...props }: PasswordFieldprops) => {
  const [showPassword, setshowPassword] = useState(false);

  const togglePassword = () => {
    setshowPassword(!showPassword);
  };
  return (
    <div className="flex common-input bg-white">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={value}
        className="size-full outline-0 bg-transparent outline-none"
        name={name}
        {...props}
      />

      <button className="" onClick={togglePassword}>
        {showPassword ? <EyeOpenIcon /> : <EyeCloseicon />}
      </button>
    </div>
  );
};

export default PasswordField;
