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
      <div className="">{children}</div>
    </main>
  );
};

export default Layout;
