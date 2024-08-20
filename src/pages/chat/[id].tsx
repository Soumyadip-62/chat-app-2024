import ChatBody from "@/Components/ChatBody";
import ChatHeader from "@/Components/ChatHeader";
import InputBox from "@/Components/InputBox";
import React from "react";

const chat = () => {
  return (
    <div className="px-10 py-5 h-full">
      <ChatHeader />
      <ChatBody />
      <InputBox />
    </div>
  );
};

export default chat;
