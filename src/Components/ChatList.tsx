/* eslint-disable react-hooks/exhaustive-deps */
import { assets } from "@/assets";
import { auth, db } from "@/firebase";
import { chatlist } from "@/lib/mock/chatlist.mock";

import { useAppSelector } from "@/Redux/hooks";
import { addChatRoom, ChatRoom } from "@/Redux/slices/ChatroomSlice";
import { toggleSidebar } from "@/Redux/slices/globalSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import { CheckCheck } from "lucide-react";
import { unsubscribe } from "diagnostics_channel";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";

const ChatList = () => {
  const cookies = new Cookies();
  const userData = useAppSelector((state) => state.rootstate.userdata.user);
  const ChatRoomList = useAppSelector(
    (state) => state.rootstate.chatroom.chatRoomList
  );
  const [chatRoomList, setchatRoomList] = useState<ChatRoom[]>([]);
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;

  const getUserData = async (Chatid: string) => {
    try {
      const ChatRoomSnap = await getDoc(doc(db, "chatroom", Chatid));
      const Chatroom = ChatRoomSnap.data() as ChatRoom;

      const usersList = await Promise.all(
        Chatroom.users.map(async (item) =>
          (await getDoc(doc(db, "users", item?.id!))).data()
        )
      );
      console.log(usersList.at(0));
      // Work from this section tommorrow just filter the logged in user from users list
      return usersList.filter((item) => item?.uid !== (userData?.id || userData?.uid)).at(0);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  };

  useEffect(() => {
    if (!cookies.get("user")) return;

    const userId = userData?.id || userData?.uid;
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    const chatListRef = collection(db, "chatroom");
    const currentUserRef = doc(db, "users", userId);

    const q = query(
      chatListRef,
      where("users", "array-contains", currentUserRef)
    );

    // Set up the snapshot listener
    const unsubscribe = onSnapshot(q, async (chatList) => {
      try {
        const rooms = await Promise.all(
          chatList.docs.map(async (doc) => {
            const data = doc.data();
            const userData = await getUserData(doc.id);
            return {
              id: doc.id,
              lastMessage: data?.lastMessage,
              lastMessageTimeStamp: data?.lastMessageTimeStamp,
              messages: data?.messages,
              users: data?.users,
              userimg: userData?.avatar,
              userName: userData?.name,
              chatId: doc.id,
            };
          })
        );

        const sortedRooms = rooms.sort((a, b) => {
          return (b.lastMessageTimeStamp || 0) - (a.lastMessageTimeStamp || 0);
        });

        // Dispatch actions to update the chat room state in the store
        sortedRooms.forEach((room) => {
          dispatch(addChatRoom(room));
        });






        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        const userdata = userDoc.data()




        // Update the local state with the sorted rooms
        setchatRoomList(sortedRooms.filter(room => !userdata?.deletedChats?.includes(room.chatId as string)));



        console.log("Rooms:", sortedRooms);
      } catch (error) {
        console.error("Failed to fetch chat rooms:", error);
      }
    });

    // Cleanup the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, [userData]);

  return (
    <div className="glass-panel px-4 py-6 rounded-[24px] h-[calc(100vh-220px)] lg:bg-[#121624] lg:border-white/10">
      <h3 className="text-xl mb-4 font-bold text-gray-100 px-2 flex items-center justify-between">
        <span>Chats</span>
        <span className="text-xs bg-violet-600/30 text-violet-300 px-2.5 py-1 rounded-full font-semibold">
          {chatRoomList?.length || 0}
        </span>
      </h3>
      <ul className="h-[calc(100%-40px)] overflow-auto pr-1 space-y-1">
        {chatRoomList?.map((item, idx) => (
          <li
            className="border-b border-white/5 py-3 px-2 last:mb-0 last:border-b-0 hover:rounded-xl hover:bg-white/5 transition-all duration-300"
            key={idx}
          >
            <Link
              href={`/chat/${item.chatId}`}
              className="flex items-center space-x-3"
              onClick={() => dispatch(toggleSidebar())}
            >
              <Avatar src={item.userimg} alt={item.userName!} />

              <div className="max-w-[calc(100%-56px)] flex w-full items-center justify-between min-w-0">
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="text-sm font-bold text-gray-100 truncate">{item.userName}</h4>
                  <p className="text-xs text-gray-400 mt-1 whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <p className="text-xs text-gray-500 whitespace-nowrap mb-1">
                    {(item.lastMessageTimeStamp || Timestamp.now())
                      .toDate()
                      .toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                  </p>

                  <i className="text-violet-400">
                    <CheckCheck size={16} />
                  </i>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
