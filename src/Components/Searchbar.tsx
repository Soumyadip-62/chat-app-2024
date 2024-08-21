import { auth, db } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import {
  addChatRoom,
  ChatRoom,
  resetChatRoom,
} from "@/Redux/slices/ChatroomSlice";
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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Searchbar = () => {
  const [inputValue, setinputValue] = useState<string>("");
  const [searchResults, setsearchResults] = useState<User[]>([]);
  const userData = useAppSelector((state) => state.rootstate.userdata.user);
  const dispatch = useDispatch();

  const handleInputOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setinputValue(event.target.value);
  };

  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersCollection = collection(db, "users");

        const currentUser = auth.currentUser;

        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        setsearchResults(
          usersList.filter(
            (item) =>
              item.name?.toLowerCase().startsWith(inputValue) &&
              currentUser?.uid !== item.id
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

      rooms.map(async (item: any) => {
        dispatch(
          addChatRoom({
            lastMessage: item?.lastMessage!,
            lastMessageTimeStamp: item?.lastMessageTimeStamp,
            messages: item?.messages,
            users: item?.users,
            userimg: await getUserData(item.id).then((data) => data?.avatar),
            userName: await getUserData(item.id).then((data) => data?.name),
            chatId: item.id,
          })
        );
      });

      console.log(rooms);

      // setChatRooms(rooms);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  };

  const handleNewChat = async (uid: string) => {
    console.log("New Chat Button Clicked");
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No current user found");
      return;
    }

    const chatroomRef = collection(db, "chatroom");
    const userRef = doc(db, "users", uid);
    const currentUserRef = doc(db, "users", currentUser.uid);

    // Query chatrooms that contain the other user
    const q = query(chatroomRef, where("users", "array-contains", userRef));
    const getChatSnap = await getDocs(q);

    const chatRooms = await Promise.all(
      getChatSnap.docs.map(async (doc) => {
        const chatRoomData = doc.data();
        const chatRoomId = doc.id;
        const users = chatRoomData.users;

        // Check if the chatroom also contains the current user
        const containsCurrentUser = users.some(
          (userDoc: any) => userDoc.id === currentUser.uid
        );

        return containsCurrentUser ? { id: chatRoomId, ...chatRoomData } : null;
      })
    );

    // Filter out null values
    const existingChatRooms = chatRooms.filter((room) => room !== null);

    console.log("Existing ChatRooms:", existingChatRooms);

    if (existingChatRooms.length === 0) {
      // If no chatroom exists, create a new one
      const newChatroom = await addDoc(chatroomRef, {
        users: [currentUserRef, userRef],
        messages: [],
        lastMessage: "Start a Conversation",
        lastMessageTimeStamp: Timestamp.now(),
      });
      GetChatList();

      router.push(`/chat/${newChatroom.id}`);
      setinputValue("");
    } else {
      // If chatroom exists, navigate to it
      console.log("Chat already exists");
      router.push(`/chat/${existingChatRooms[0]?.id}`);
      setinputValue("");
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
