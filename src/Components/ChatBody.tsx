import { messages } from "@/lib/mock/messages.mock";
import React, { useState } from "react";
import SentText from "./SentText";
import Recievedtext from "./Recievedtext";

const ChatBody = () => {
  const [currentUser, setcurrentUser] = useState(2);
  return (
    <div className="py-4 h-[calc(100%-160px)] overflow-auto -mr-3 pr-3">
      <div className="flex flex-col space-y-4">
        {messages.map((item, idx) => {
          return item.sender_id === currentUser ? (
            <SentText message={item.messaage} senderId={item.sender_id} {...item} />
          ) : (
            <Recievedtext message={item.messaage} senderId={item.sender_id} {...item} />
          );
        })}
      </div>
    </div>
  );
};

export default ChatBody;
