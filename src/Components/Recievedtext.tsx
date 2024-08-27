import { Message } from "@/lib/types/messages.type";
import React from "react";

const Recievedtext = ({ senderId, text, timeStamp, id }: Message) => {
  return (
    <div className="self-start max-w-[530px]" id={id}>
      <p className="text-base bg-[#e7e7e7] p-3 rounded-[20px] mb-1">{text}</p>
      <span className="pl-2 text-sm">{/* {date} - {time} */}</span>
    </div>
  );
};

export default Recievedtext;
