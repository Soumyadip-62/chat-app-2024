import { assets } from "@/assets";
import { auth, db } from "@/firebase";
import { chatlist } from "@/lib/mock/chatlist.mock";

import { useAppSelector } from "@/Redux/hooks";
import { addChatRoom, ChatRoom } from "@/Redux/slices/ChatroomSlice";
import DoubleTick from "@/UI/icons/DoubleTick";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";

const ChatList = () => {
  const cookies = new Cookies();
  const userData = useAppSelector((state) => state.rootstate.userdata.user);
  const ChatRoomList = useAppSelector(
    (state) => state.rootstate.chatroom.chatRoomList
  );
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
      return usersList;
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  };

  const GetChatList = async () => {
    if (!userData?.id) {
      console.error("User ID is undefined");
      return;
    }

    try {
      const chatListRef = collection(db, "chatroom");
      const currentUserRef = doc(db, "users", userData.id);

      const q = query(
        chatListRef,
        where("users", "array-contains", currentUserRef)
      );

      const querySnapshot = await getDocs(q);
      const rooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(rooms);

      rooms.map(async (item) => {
        addChatRoom({
          lastMessage: item?.lastMessage!,
          lastMessageTimeStamp: item.lastMessageTimeStamp,
          messages: item.messages,
          users: item.users,
          userimg: await getUserData(item.id),
        });
      });

      // setChatRooms(rooms);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  };

  useEffect(() => {
    if (cookies.get("user")) {
      GetChatList();
    }
  }, [userData]);

  return (
    <div className="search_bar px-5 pr-2 py-7 rounded-[25px] h-[calc(100vh-220px)]">
      <h3 className="text-2xl mb-4 font-bold">People</h3>
      <ul className="h-[calc(100%-40px)] overflow-auto pr-1">
        {chatlist?.map((item, idx) => (
          <li
            className="border-b-[1px] py-3.5 px-2 last:mb-0 last:border-b-0 rounded-lg hover:bg-blue-200"
            key={idx}
          >
            <Link href="/" className="flex items-start ">
              <figure className="size-[50px] rounded-full overflow-hidden mr-4">
                <Image
                  src={item.userImg!}
                  alt="user1"
                  width={50}
                  height={50}
                  className="size-full object-cover"
                />
              </figure>
              <div className="max-w-[calc(100%-64px)] flex w-full">
                <div className="w-[calc(100%-65px)]">
                  <h4 className="text-lg font-bold">{item.userName}</h4>
                  <p className="text-base text-gray-500 font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.lastMessage}
                  </p>
                </div>

                <div className="ml-auto flex flex-col items-end">
                  <p>{item.time}</p>

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
