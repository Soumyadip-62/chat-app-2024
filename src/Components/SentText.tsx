import { Message } from "@/lib/types/chatlist.type";
import React from "react";

const SentText = ({ date, message, senderId, time }: Message) => {
  return (
    <div className="self-end max-w-[530px] text-end ">
      <p className="text-base bg-[#6E00FF] text-white p-3 rounded-[20px] mb-1 text-left">
        {message}
      </p>
      <span className="pr-2 text-sm">
        {date} - {time}
      </span>
    </div>
  );
};

export default SentText;
