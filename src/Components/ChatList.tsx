import { assets } from "@/assets";
import { auth, db } from "@/firebase";
import { chatlist } from "@/lib/mock/chatlist.mock";

import { useAppSelector } from "@/Redux/hooks";
import { addChatRoom, ChatRoom } from "@/Redux/slices/ChatroomSlice";
import {  toggleSidebar } from "@/Redux/slices/globalSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import DoubleTick from "@/UI/icons/DoubleTick";
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
      return usersList.filter((item) => item?.uid !== userData?.id).at(0);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  };

  useEffect(() => {
    if (!cookies.get("user")) return;

    if (!userData?.id) {
      console.error("User ID is undefined");
      return;
    }

    const chatListRef = collection(db, "chatroom");
    const currentUserRef = doc(db, "users", userData.id);

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

        // Update the local state with the sorted rooms
        setchatRoomList(sortedRooms);

        console.log("Rooms:", rooms);
      } catch (error) {
        console.error("Failed to fetch chat rooms:", error);
      }
    });

    // Cleanup the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, [userData]);

  return (
    <div className="search_bar px-5 pr-2 py-7 rounded-[25px] h-[calc(100vh-220px)] lg:bg-white">
      <h3 className="text-2xl mb-4 font-bold">Peoples</h3>
      <ul className="h-[calc(100%-40px)] overflow-auto pr-1">
        {chatRoomList?.map((item, idx) => (
          <li
            className="border-b-[1px] py-3.5 px-2 last:mb-0 last:border-b-0 rounded-lg hover:bg-blue-200"
            key={idx}
          >
            <Link
              href={`/chat/${item.chatId}`}
              className="flex items-start space-x-2"
              onClick={() => dispatch(toggleSidebar())}
            >
              <Avatar src={item.userimg} alt={item.userName!} />

              <div className="max-w-[calc(100%-64px)] flex w-full">
                <div className="w-[calc(100%-65px)]">
                  <h4 className="text-lg font-bold">{item.userName}</h4>
                  <p className="text-base text-gray-500 font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.lastMessage}
                  </p>
                </div>

                <div className="ml-auto flex flex-col items-end">
                  <p>
                    {(item.lastMessageTimeStamp || Timestamp.now())
                      .toDate()
                      .toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                  </p>

                  <i>
                    <DoubleTick />
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
