import { Message } from "@/lib/types/messages.type";
import Image from "next/image";
import React from "react";

const SentText = ({ senderId, text, timeStamp, image, id }: Message) => {
console.log(image, "Image data in sent ")

  return (
    <div className="self-end max-w-[70%] text-end" id={id}>
      <div className="text-sm bg-gradient-to-br from-violet-600 to-indigo-600 text-white py-2.5 px-4 rounded-[18px] rounded-tr-none mb-1 text-left shadow-lg shadow-violet-950/20 border border-violet-500/20">
        {image && (
          <div className="grid grid-flow-row gap-2 grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] mb-2 overflow-hidden rounded-lg">
            {image.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt="image"
                width={340}
                height={340}
                className="w-full h-full object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        <p className="leading-relaxed break-words whitespace-pre-wrap">{text}</p>
      </div>
      <span className="pr-1 text-[10px] text-gray-500 font-medium">
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
