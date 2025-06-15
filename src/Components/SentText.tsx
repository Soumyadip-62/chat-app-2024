import { Message } from "@/lib/types/messages.type";
import Image from "next/image";
import React from "react";

const SentText = ({ senderId, text, timeStamp, image, id }: Message) => {
console.log(image, "Image data in sent ")

  return (
    <div className="self-end max-w-[530px] text-end " id={id}>
      <div className="text-base bg-[#6E00FF] text-white p-3 rounded-[20px] mb-1 text-left">
        {image && (
          <div className="grid  grid-flow-row gap-2 grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))]">
            {image.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt="image"
                width={340}
                height={340}
                className="mb-1 w-full h-full object-cover"
              />
            ))}
          </div>
        )}
        <p>{text}</p>
      </div>
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
