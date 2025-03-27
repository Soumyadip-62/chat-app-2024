import { messages } from "@/lib/mock/messages.mock";
import React, { useEffect, useRef, useState } from "react";
import SentText from "./SentText";
import Recievedtext from "./Recievedtext";
import { Message } from "@/lib/types/messages.type";
import { auth } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import moment from "moment";

interface ChatBodyProps {
  messageList: Message[];
}

const ChatBody = ({ messageList }: ChatBodyProps) => {
  const userData = useAppSelector((state) => state.rootstate.userdata.user);
  const endOfMessagesRef = useRef<any>(null);
  const [formattedMessages, setFormattedMessages] = useState<
    { date: string; chatlist: Message[] }[]
  >([]);

  useEffect(() => {
    const groupedMessages: { [date: string]: Message[] } = {};

    messageList.forEach((msg) => {
      const dateKey = moment(msg.timeStamp.toDate()).format("YYYY-MM-DD");// Extract YYYY-MM-DD

      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      groupedMessages[dateKey].push(msg);
    });

    // Convert object into an array with the desired format
    const formattedArray = Object.entries(groupedMessages).map(
      ([date, chatlist]) => ({
        date: moment(date).format("Do MMMM YYYY"),
        chatlist,
      })
    );

    setFormattedMessages(formattedArray);

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
        {formattedMessages.map(({ date, chatlist }, dateIdx) => (
          <div key={date}>
            <h3 className="text-center py-2">{date}</h3>
            <div className="flex flex-col space-y-4 h-full">
              {chatlist.map((item, idx) => {
                const isLastElement =
                  dateIdx === formattedMessages.length - 1 &&
                  idx === chatlist.length - 1;

                return item.senderId?.id === userData?.id ? (
                  <SentText
                    {...item}
                    key={item.id || `${date}-${idx}`}
                    id={isLastElement ? "last-element" : undefined}
                  />
                ) : (
                  <Recievedtext
                    {...item}
                    key={item.id || `${date}-${idx}`}
                    id={isLastElement ? "last-element" : undefined}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatBody;
