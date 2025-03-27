import { Message } from "@/lib/types/messages.type";
import React from "react";

const SentText = ({ senderId, text, timeStamp, id }: Message) => {
  return (
    <div className="self-end max-w-[530px] text-end " id={id}>
      <p className="text-base bg-[#6E00FF] text-white p-3 rounded-[20px] mb-1 text-left">
        {text}
      </p>
      <span className="pr-2 text-xs">
        {(() => {
          const hours = timeStamp.toDate().getHours();
          const minutes = timeStamp.toDate().getMinutes();
          const ampm = hours >= 12 ? "PM" : "AM";
          const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
          const formattedMinutes = minutes.toString().padStart(2, "0");
          return `${formattedHours}:${formattedMinutes} ${ampm}`;
        })()}
      </span>
    </div>
  );
};

export default SentText;
