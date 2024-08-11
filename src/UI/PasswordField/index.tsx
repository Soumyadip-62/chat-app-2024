import React, { HtmlHTMLAttributes, useState } from "react";
import EyeOpenIcon from "../icons/EyeOpenIcon";
import EyeCloseicon from "../icons/EyeCloseicon";

interface PasswordFieldprops extends HtmlHTMLAttributes<HTMLInputElement> {
  value?: string;
}
const PasswordField = ({ value, ...props }: PasswordFieldprops) => {
  const [showPassword, setshowPassword] = useState(false);

  const togglePassword = () => {
    setshowPassword(!showPassword);
  };
  return (
    <div className="flex common-input">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={value}
        className="size-full outline-0"
        {...props}
      />

      <button className="" onClick={togglePassword}>
        {showPassword ? <EyeOpenIcon /> : <EyeCloseicon />}
      </button>
    </div>
  );
};

export default PasswordField;
