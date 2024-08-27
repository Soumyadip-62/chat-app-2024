import { assets } from "@/assets";
import { User } from "@/Redux/slices/UserSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import ThreeDot from "@/UI/icons/ThreeDot";
import Image from "next/image";
import React from "react";

const ChatHeader = ({ avatar, createdAt, email, id, name, uid }: User) => {
  return (
    <div className="flex items-start pb-6 border-b border-[#B4ABAB] space-x-3">
      <Avatar src={avatar!} alt={name!}  />
      
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
