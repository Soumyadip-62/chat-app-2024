import { messages } from "@/lib/mock/messages.mock";
import React, { useEffect, useRef, useState } from "react";
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
  const endOfMessagesRef = useRef<any>(null);
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messageList]);
  // const [currentUser, setcurrentUser] = useState(2);
  const currentUser = auth.currentUser;
  return (
    <div className="py-4 h-[calc(100%-160px)]  overflow-auto -mr-3 pr-3">
      <div className="flex flex-col space-y-4 h-full">
        {messageList.map((item, idx) => {
          const isLastElement = idx === messageList.length - 1;
          return item.senderId?.id === userData?.id ? (
            <SentText
              {...item}
              key={idx}
              id={isLastElement ? "last-element" : undefined}
            />
          ) : (
            <Recievedtext
              {...item}
              key={idx}
              id={isLastElement ? "last-element" : undefined}
            />
          );
        })}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatBody;
