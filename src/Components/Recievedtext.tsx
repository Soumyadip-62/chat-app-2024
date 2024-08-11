import { Message } from "@/lib/types/chatlist.type";
import React from "react";

const Recievedtext = ({ date, message, senderId, time }: Message) => {
  return (
    <div className="self-start max-w-[530px]">
      <p className="text-base bg-[#e7e7e7] p-3 rounded-[20px] mb-1">
        {message}
      </p>
      <span className="pl-2 text-sm">
        {date} - {time}
      </span>
    </div>
  );
};

export default Recievedtext;
