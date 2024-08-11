import { assets } from "@/assets";
import ThreeDot from "@/UI/icons/ThreeDot";
import Image from "next/image";
import React from "react";

const ChatHeader = () => {
  return (
    <div className="flex items-start pb-6 border-b border-[#B4ABAB]">
      <figure className="size-[60px] overflow-hidden rounded-full mr-5">
        <Image
          src={assets.user1}
          alt="user_name"
          width={50}
          height={50}
          className="size-full object-cover"
        />
      </figure>
      <div>
        <h2 className="text-lg font-bold">John Doe</h2>
        <p>Online</p>
      </div>

      <div className="ml-auto">
        <button>
          <ThreeDot />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
