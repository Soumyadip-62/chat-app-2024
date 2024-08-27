import ChatBody from "@/Components/ChatBody";
import ChatHeader from "@/Components/ChatHeader";
import InputBox from "@/Components/InputBox";
import { auth, db, doc, getDoc } from "@/firebase";
import { Message } from "@/lib/types/messages.type";
import { useAppSelector } from "@/Redux/hooks";
import { ChatRoom } from "@/Redux/slices/ChatroomSlice";
import { User } from "@/Redux/slices/UserSlice";
import { onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

const Chat = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("Chatid ----", id);

  const userData = useAppSelector((state) => state.rootstate.userdata.user);
  const openSidebar = useAppSelector((state) => state.rootstate.counter.openSideBar);

  const dispatch = useDispatch();
  const currentUser = auth.currentUser;
  const [otherUser, setotherUser] = useState<User>();
  const [messages, setmessages] = useState<Message[]>([]);
  const [chatRoom, setchatRoom] = useState<ChatRoom>();

 

  

  useEffect(() => {
    if (!id) {
      console.error("Chat ID is not available");
      return;
    }

    const chatroomRef = doc(db, "chatroom", id as string);

    // Set up the snapshot listener
    const unsubscribe = onSnapshot(chatroomRef, async (chatRoomSnap) => {
      try {
        const chatroomData = chatRoomSnap.data();

        if (chatRoomSnap.exists() && chatroomData) {
          setchatRoom(chatroomData as ChatRoom); // Set chat room data

          // Fetch all users in the chat room
          const usersList = await Promise.all(
            chatroomData.users.map(async (item: { id: string }) =>
              (await getDoc(doc(db, "users", item.id))).data()
            )
          );

          // Fetch all messages in the chat room
          const messagelist = await Promise.all(
            chatroomData.messages.map(async (item: { id: string }) => {
              if (!item.id) {
                console.warn("Message ID is missing");
                return null; // Skip this message
              }

              try {
                const messageRef = doc(db, "messages", item.id);
                const messageSnap = await getDoc(messageRef);
                return messageSnap.data(); // Return message data if document exists
              } catch (error) {
                console.error(
                  `Error fetching message with ID: ${item.id}`,
                  error
                );
                return null; // Handle errors during fetching
              }
            })


          );
         

          setmessages(messagelist); // Set messages data
          setotherUser(
            usersList.filter((item) => item?.uid !== userData?.id).at(0)
          ); // Set other user data
        }
      } catch (error) {
        console.error("Could not fetch chat room data:", error);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [id]); // Dependency array includes chatId

  return (
    <div className={`px-10 py-5 h-full lg:p-0`}>
      <ChatHeader {...otherUser} />
      <ChatBody messageList={messages} />
      
      <InputBox chatRoomid={id as string} />
    </div>
  );
};

export default Chat;
