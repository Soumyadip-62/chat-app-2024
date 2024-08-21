import ChatBody from "@/Components/ChatBody";
import ChatHeader from "@/Components/ChatHeader";
import InputBox from "@/Components/InputBox";
import { auth, db, doc, getDoc } from "@/firebase";
import { Message } from "@/lib/types/messages.type";
import { useAppSelector } from "@/Redux/hooks";
import { ChatRoom } from "@/Redux/slices/ChatroomSlice";
import { User } from "@/Redux/slices/UserSlice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Chat = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("Chatid ----", id);

  

  const userData = useAppSelector((state) => state.rootstate.userdata.user);
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;
  const [otherUser, setotherUser] = useState<User>();
  const [messages, setmessages] = useState<Message[]>([]);
  const [chatRoom, setchatRoom] = useState<ChatRoom>();

  const getChat = async () => {
    if (!id) {
      console.error("Chat ID is not available");
      return;
    }
    const chatroomRef = doc(db, "chatroom", id as string);
    try {
      const chatRoomSnap = await getDoc(chatroomRef);
      console.log(chatRoomSnap.data());

      if (chatRoomSnap.exists()) {
        const chatroom = chatRoomSnap.data();
        setchatRoom(chatRoom)

        const usersList = await Promise.all(
          chatroom.users.map(async (item: { id: string }) =>
            (await getDoc(doc(db, "users", item?.id!))).data()
          )
        );

        const messagelist = await Promise.all(
          chatroom.messages.map(async (item: { id: string }) => {
            if (!item.id) {
              console.warn("Message ID is missing");
              return null; // Skip this message
            }

            try {
              const messageRef = doc(db, "messages", item.id);
              const messageSnap = await getDoc(messageRef);

              // if (messageSnap.exists()) {
              return messageSnap.data(); // Return message data if document exists
              // } else {
              //   console.warn(`No message found with ID: ${item.id}`);
              //   return null; // Handle case where document doesn't exist
              // }
            } catch (error) {
              console.error(
                `Error fetching message with ID: ${item.id}`,
                error
              );
              return null; // Handle errors during fetching
            }
          })
        );
        console.log(messagelist);
        setmessages(messagelist)

        setotherUser(
          usersList.filter((item) => item?.uid !== userData?.id).at(0)
        );
      }
    } catch (error) {
      console.log("could not find chatroom", error);
    }
  };

  useEffect(() => {
    if (id) {
      getChat();
    }
  }, [id]);

  return (
    <div className="px-10 py-5 h-full">
      <ChatHeader {...otherUser} />
      <ChatBody messageList={messages} />
      <InputBox chatRoomid={id as string} />
    </div>
  );
};

export default Chat;
