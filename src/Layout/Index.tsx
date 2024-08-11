import { assets } from "@/assets";
import ChatList from "@/Components/ChatList";
import Searchbar from "@/Components/Searchbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex items-start justify-start w-full p-6 container">
      <div className="max-w-[480px] w-full space-y-8">
        <Searchbar />
        <ChatList />
      </div>
      <div className="max-w-[calc(100%-480px)] w-full search_bar ml-8 rounded-[25px] h-[calc(100vh-62px)]">{children}</div>
    </main>
  );
};

export default Layout;
