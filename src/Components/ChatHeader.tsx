import { assets } from "@/assets";
import { db } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import { toggleSidebar } from "@/Redux/slices/globalSlice";
import { User } from "@/Redux/slices/UserSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Popover } from "@headlessui/react";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";

const ChatHeader = ({ avatar, createdAt, email, id, name, uid }: User) => {
  const dispatch = useDispatch()
  const userdata = useAppSelector((state) => state.rootstate.userdata.user);
  const router = useRouter()
  console.log(id, "chat_id")

  const handleDeleteChat = async () => {
    console.log("delete chat")

    const userId = userdata?.id || userdata?.uid;
    if (!userId) {
      console.log(userdata, "userdata")
      console.error("User UID is undefined. Cannot get chat document.");
      return;
    } else {

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      console.log(userDoc.data(), "user");
      await updateDoc(userRef, {
        deletedChats: arrayUnion(id)
      })

      router.push("/")


    }

  }



  return (
    <div className="flex items-center pb-5 border-b border-white/10 space-x-3">
      <button className="hidden lg:block text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors duration-300" onClick={() => dispatch(toggleSidebar())}>
        <ArrowLeft size={20} />
      </button>
      <Avatar src={avatar!} alt={name!} />
      <div className="flex flex-col min-w-0">
        <h2 className="text-base font-bold text-gray-100 truncate">{name}</h2>
        <p className="text-xs text-gray-400 truncate">{email}</p>
      </div>

      <div className="!ml-auto">
        <Popover className="relative">
          <Popover.Button className='outline-none text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors duration-300'>
            <MoreVertical size={20} />
          </Popover.Button>

          <Popover.Panel className="absolute z-10 right-0 mt-2 w-44">
            <div className="flex flex-col glass-panel rounded-[16px] shadow-2xl p-1.5 border border-white/10 backdrop-blur-xl">
              <button 
                className="text-red-400 hover:text-white whitespace-nowrap font-medium text-sm text-left px-3.5 py-2 rounded-xl hover:bg-red-600/80 transition-all duration-200" 
                onClick={handleDeleteChat}
              >
                Delete chat
              </button>
              <button 
                className="text-red-400 hover:text-white whitespace-nowrap font-medium text-sm text-left px-3.5 py-2 rounded-xl hover:bg-red-600/80 transition-all duration-200"
              >
                Block user
              </button>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  );
};

export default ChatHeader;
