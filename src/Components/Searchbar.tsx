import { auth, db } from "@/firebase";
import { User } from "@/Redux/slices/UserSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import SearchIcon from "@/UI/icons/SearchIcon";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Searchbar = () => {
  const [inputValue, setinputValue] = useState<string>("");
  const [searchResults, setsearchResults] = useState<User[]>([]);

  const handleInputOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setinputValue(event.target.value);
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersCollection = collection(db, "users");

        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        setsearchResults(
          usersList.filter((item) =>
            item.name?.toLowerCase().includes(inputValue)
          )
        );
        console.log("Users List:", usersList);
        return usersList;
      } catch (error) {
        console.error("Error getting users:", error);
        return [];
      }
    };
    if (inputValue) {
      getUsers();
    } else {
      setsearchResults([]);
    }
  }, [inputValue]);

  const handleNewChat = async (uid: string) => {
    console.log("New Chat Button Clicked");
    const currentUser = auth.currentUser;

    const chatroomRef = collection(db, "chatroom");

    const q = query(
      chatroomRef,
      where("users", "array-contains", uid),
    
    );

    const getChatSnap = await getDocs(q);

    const chatRooms = getChatSnap.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      

     console.log(chatRooms);
     

    if (true ) {
      console.log("chat already exists");
    } else {
      const newChatroom = await addDoc(chatroomRef, {
        users: [currentUser?.uid, uid],
        messeges: [],
        lastMessage: "Start a Conversation",
        lastMessageTimeStamp: Timestamp.now(),
      });
    }
  };
  return (
    <div className="shadow-xl rounded-[16px] w-full h-16 bg-white flex items-center justify-normal px-4 search_bar relative">
      <input
        type="text"
        className="bg-transparent w-full outline-none text-black p-4 text-lg font-medium"
        placeholder="Search "
        value={inputValue}
        onChange={handleInputOnchange}
      />

      {searchResults.length > 0 && (
        <div className="absolute top-[70px] left-0 z-30 w-full bg-white search_bar rounded-lg px-4 py-2">
          <ul>
            {searchResults.map((item, idx) => (
              <li
                className="font-medium text-sm hover:opacity-45 transition-all duration-500 ease-in-out cursor-pointer py-2 flex items-center space-x-3"
                key={idx}
                onClick={() => handleNewChat(item.uid!)}
              >
                <Avatar src={item.avatar!} alt={item.name!} />
                <p className="text-base">{item.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button>
        <SearchIcon />
      </button>
    </div>
  );
};

export default Searchbar;
