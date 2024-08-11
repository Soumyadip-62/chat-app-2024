import ClipIcon from "@/UI/icons/ClipIcon";
import Sendicon from "@/UI/icons/Sendicon";
import React from "react";

const InputBox = () => {
  return (
    <div className="w-full flex border items-end px-4 py-2.5 rounded-xl">
      <div className="relative !cursor-pointer size-11 p-3">
        <input
          type="file"
          className="absolute size-full opacity-0 top-0 left-0 !cursor-pointer z-50"
        />
        <ClipIcon />
      </div>
      <textarea
        name="chat_input"
        className="w-full outline-0 rounded-xl h-10 p-1 resize-none bg-transparent font-medium"
        placeholder="Type a message"
      />
      <button className="size-11 min-w-14 flex items-center justify-center bg-[#6E00FF] rounded-lg">
        <Sendicon />
      </button>
    </div>
  );
};

export default InputBox;
