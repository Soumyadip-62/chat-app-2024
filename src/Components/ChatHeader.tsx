import { assets } from "@/assets";
import { db } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import { toggleSidebar } from "@/Redux/slices/globalSlice";
import { User } from "@/Redux/slices/UserSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import BackArrowIcon from "@/UI/icons/BackArrowIcon";
import ThreeDot from "@/UI/icons/ThreeDot";
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

    if (!userdata?.id) {
      console.log(userdata, "userdata")
      console.error("User UID is undefined. Cannot get chat document.");
      return;
    } else {

      const userRef = doc(db, "users", userdata.id);
      const userDoc = await getDoc(userRef);
      console.log(userDoc.data(), "user");
      await updateDoc(userRef, {
        deletedChats: arrayUnion(id)
      })

      router.push("/")


    }

  }



  return (
    <div className="flex items-start  pb-6 border-b border-[#B4ABAB] space-x-3">
      <button className="self-center hidden lg:block" onClick={() => dispatch(toggleSidebar())}>
        <BackArrowIcon />
      </button>
      <Avatar src={avatar!} alt={name!} />
      <div>
        <h2 className="text-lg font-bold">{name}</h2>
        <p>{email}</p>
      </div>

      <div className="!ml-auto">
        <Popover className="relative">
          <Popover.Button className='outline-none'>   <ThreeDot /></Popover.Button>

          <Popover.Panel className="absolute z-10 right-3">
            <div className="flex flex-col bg-white rounded-lg shadow-lg p-2">
              <button className="text-red-500 whitespace-nowrap font-medium text-md text-left p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300" onClick={handleDeleteChat}>Delete chat</button>
              <button className="text-red-500 whitespace-nowrap font-medium text-md text-left p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300">Block user</button>

            </div>


          </Popover.Panel>
        </Popover>

      </div>
    </div>
  );
};

export default ChatHeader;
