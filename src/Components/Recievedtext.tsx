import { Message } from "@/lib/types/messages.type";
import Image from "next/image";
import React from "react";

const Recievedtext = ({ senderId, text, timeStamp, image, id }: Message) => {
  return (
    <div className="self-start max-w-[530px]" id={id}>
      <div className="text-base bg-[#e7e7e7] p-3 rounded-[20px] mb-1">
        {image &&
          image.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt="image"
              width={340}
              height={340}
              className="mb-1"
            />
          ))}
        <p>{text}</p>
      </div>
      <span className="pl-2 text-xs">
        {" "}
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

export default Recievedtext;
