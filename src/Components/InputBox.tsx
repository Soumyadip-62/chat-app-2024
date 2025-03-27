import { auth, db } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import { ChatRoom } from "@/Redux/slices/ChatroomSlice";
import ClipIcon from "@/UI/icons/ClipIcon";
import Sendicon from "@/UI/icons/Sendicon";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { ChangeEvent, useState } from "react";

interface InputBoxProps {
  chatRoomid: string;
}
const InputBox = ({ chatRoomid }: InputBoxProps) => {
  const userdata = useAppSelector((state) => state.rootstate.userdata.user);
  const [inputValue, setinputValue] = useState("");
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setinputValue(event.target.value);
  };

  const currentuser = auth.currentUser;

  const HandleMessageSubmit = async () => {
    const messageref = collection(db, "messages");
    try {
      const newmessage = await addDoc(messageref, {
        text: inputValue,
        senderId: doc(db, "users", userdata?.id),
        timeStamp: Timestamp.now(),
      });
      console.log(newmessage);

      console.log(chatRoomid);
      if (chatRoomid && newmessage.id) {
        const chatroomRef = doc(db, "chatroom", chatRoomid);
        await updateDoc(chatroomRef, {
          messages: arrayUnion(newmessage),
          lastMessage: inputValue,
          lastMessageTimeStamp: Timestamp.now(),
        }).then((item) => setinputValue(""));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlekeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      // Add a new line when Shift + Enter is pressed
      event.preventDefault(); // Prevent default Enter behavior
      setinputValue((prevValue) => prevValue + "\n");
    } else if (event.key === "Enter") {
      console.log("Enter key pressed!");

      HandleMessageSubmit();
    }
  };

  return (
    <div className="w-full flex border-2 border-black/30 items-end px-4 py-2.5 rounded-xl h-16">
      <div className="relative !cursor-pointer size-11 p-3">
        <input
          type="file"
          className="absolute size-full opacity-0 top-0 left-0 !cursor-pointer z-50"
        />
        <ClipIcon />
      </div>
      <textarea
        name="chat_input"
        className="w-full outline-none rounded-xl h-full p-1 resize-none bg-transparent font-medium"
        placeholder="Type a message"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handlekeyDown}
      />
      <button
        className="size-11 min-w-14 flex items-center justify-center bg-[#6E00FF] rounded-lg"
        onClick={HandleMessageSubmit}
      >
        <Sendicon />
      </button>
    </div>
  );
};

export default InputBox;
