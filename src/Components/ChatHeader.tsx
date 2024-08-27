import { assets } from "@/assets";
import { toggleSidebar } from "@/Redux/slices/globalSlice";
import { User } from "@/Redux/slices/UserSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import BackArrowIcon from "@/UI/icons/BackArrowIcon";
import ThreeDot from "@/UI/icons/ThreeDot";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";

const ChatHeader = ({ avatar, createdAt, email, id, name, uid }: User) => {
  const dispatch= useDispatch()
  return (
    <div className="flex items-start  pb-6 border-b border-[#B4ABAB] space-x-3">
      <button className="self-center hidden lg:block" onClick={()=>dispatch(toggleSidebar())}>
        <BackArrowIcon />
      </button>
      <Avatar src={avatar!} alt={name!} />
      <div>
        <h2 className="text-lg font-bold">{name}</h2>
        <p>{email}</p>
      </div>

      <div className="!ml-auto">
        <button>
          <ThreeDot />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
