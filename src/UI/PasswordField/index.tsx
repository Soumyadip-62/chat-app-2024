import React, { HTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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

      <button className="text-gray-400 hover:text-gray-600 focus:outline-none" onClick={togglePassword} type="button">
        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
};

export default PasswordField;
