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

const ChatList = () => {
  const chatList = useAppSelector(
    (state) => state.rootstate.chatroom.chatRoomList
  );
  const userData = useAppSelector((state) => state.rootstate.userdata);

  const dispatch = useDispatch();
  const currentUser = auth.currentUser;
  

 
  const chatroomRef = collection(db, "chatroom");
  const GetUserImg = async (chatid: string) => {
    const chatroom = await getDoc(doc(db, "chatroom", chatid));
    const chatroomData = chatroom.data();
    const users = await Promise.all(
      chatroomData?.users.map(async (item: any) => {
        {
          const data = (await getDoc(doc(db, "users", item.id))).data();
          return data;
        }
      })
    );

    const otherUser = await users.filter(
      (item) => item.id !== currentUser?.uid
    );
    if (otherUser.length > 0) {
      return otherUser.at(0);
    }
  };

  const getChatList = async () => {
    const currentUserRef = doc(db, "users", userData.user?.id);
    const chatroomQuery = query(
      chatroomRef,
      where("users", "array-contains", currentUserRef)
    );
    const chatList = await getDocs(chatroomQuery);

    const chatListSnap = chatList.docs.map((item) => {
      return {
        id: item.id,
        ...item.data(),
      };
    });

    chatListSnap.map(async (item: any) =>
      dispatch(
        addChatRoom({
          userimg: (await GetUserImg(chatListSnap?.at(0)?.id!)).avatar as any,
          lastMessage: item.lastMessage,
          lastMessageTimeStamp: item.lastMessageTimeStamp,
          messages: item.messages,
          users: item.users,
          userName: (await GetUserImg(chatListSnap?.at(0)?.id!)).name,
        })
      )
    );
  };
  useEffect(() => {
   
    getChatList();
  }, []);

  return (
    <div className="search_bar px-5 pr-2 py-7 rounded-[25px] h-[calc(100vh-220px)]">
      <h3 className="text-2xl mb-4 font-bold">People</h3>
      <ul className="h-[calc(100%-40px)] overflow-auto pr-1">
        {chatList?.map((item, idx) => (
          <li
            className="border-b-[1px] py-3.5 px-2 last:mb-0 last:border-b-0 rounded-lg hover:bg-blue-200"
            key={idx}
          >
            <Link href="/" className="flex items-start ">
              <figure className="size-[50px] rounded-full overflow-hidden mr-4">
                <Image
                  src={item.userimg!}
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
                  <p></p>

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
