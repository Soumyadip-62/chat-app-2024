import { messages } from "@/lib/mock/messages.mock";
import React, { useState } from "react";
import SentText from "./SentText";
import Recievedtext from "./Recievedtext";
import { Message } from "@/lib/types/messages.type";
import { auth } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";

interface ChatBodyProps {
  messageList: Message[];
}

const ChatBody = ({ messageList }: ChatBodyProps) => {
  const userData = useAppSelector((state) => state.rootstate.userdata.user);

  // const [currentUser, setcurrentUser] = useState(2);
  const currentUser = auth.currentUser;
  return (
    <div className="py-4 h-[calc(100%-160px)] overflow-auto -mr-3 pr-3">
      <div className="flex flex-col space-y-4">
        {messageList.map((item, idx) => {
          return item.senderId?.id === userData?.id ? (
            <SentText {...item} />
          ) : (
            <Recievedtext {...item} />
          );
        })}
      </div>
    </div>
  );
};

export default ChatBody;
