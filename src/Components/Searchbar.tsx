import { db } from "@/firebase";
import { User } from "@/Redux/slices/UserSlice";
import SearchIcon from "@/UI/icons/SearchIcon";
import { collection, getDocs, query, where } from "firebase/firestore";
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
        // const q = query(
        //   usersCollection,
        //   where("name", ">=", inputValue),
        //   where("name", "<=", inputValue + "\uf8ff")
        // );
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
        <div className="absolute bottom-[-100%] left-0 z-30 w-full bg-white search_bar rounded-lg p-4 ">
          <ul>
            {searchResults.map((item, idx) => (
              <li
                className="font-medium text-sm hover:font-bold transition-all duration-500 ease-in-out cursor-pointer"
                key={idx}
              >
                {item.name}
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
