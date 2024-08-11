import { assets } from "@/assets";
import AuthComponent from "@/Components/auth/AuthComponent";
import ChatList from "@/Components/ChatList";
import Searchbar from "@/Components/Searchbar";
import { useAppSelector } from "@/Redux/hooks";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const userData = useAppSelector((state) => state.rootstate.userdata);
  const cookies = new Cookies();

  const [isLoggedIn, setisLoggedIn] = useState(false);
  useEffect(() => {
    if (cookies.get("user-token")) {
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
    }
  }, [userData]);

  return (
    <main className="flex items-start justify-start w-full p-6 container">
      {!isLoggedIn ? (
        <AuthComponent />
      ) : (
        <>
          {" "}
          <div className="max-w-[480px] w-full space-y-8">
            <Searchbar />
            <ChatList />
          </div>
          <div className="max-w-[calc(100%-480px)] w-full search_bar ml-8 rounded-[25px] h-[calc(100vh-62px)]">
            {children}
          </div>
        </>
      )}
    </main>
  );
};

export default Layout;
