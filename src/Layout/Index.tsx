/* eslint-disable react-hooks/exhaustive-deps */
import { assets } from "@/assets";
import AuthComponent from "@/Components/auth/AuthComponent";
import ChatList from "@/Components/ChatList";
import Searchbar from "@/Components/Searchbar";
import UserDetails from "@/Components/UserDetails";
import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Cookies from "universal-cookie";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const userData = useAppSelector((state) => state.rootstate.userdata);
  const openSidebar = useAppSelector(
    (state) => state.rootstate.counter.openSideBar
  );
  const cookies = new Cookies();
  const router = useRouter();

  useEffect(() => {
    if (!userData || !cookies.get('user-token')) {
      router.push("/auth/login");
    }
  }, [router, userData]);

  return (
    <main className="flex items-start justify-start w-full p-6 container lg:py-6 px-4">
      <>
        <div
          className={`max-w-[480px] w-full space-y-4 lg:absolute lg:max-w-[calc(100%-30px)] transition-all duration-500 ease-in-out z-[99] lg:w-full  ${
            openSidebar
              ? "lg:translate-x-0"
              : "lg:-translate-x-[calc(100%+32px)]"
          }`}
        >
          <UserDetails />
          <Searchbar />
          <ChatList />
        </div>
        <div
          className={`max-w-[calc(100%-480px)] w-full search_bar chat_body ml-8 rounded-[25px] h-[calc(100vh-62px)] lg:max-w-full transition-all duration-300 ease-in-out lg:ml-0 lg:m-0  ${
            openSidebar ? "md:opacity-0" : "md:opacity-100"
          }`}
        >
          {children}
        </div>
      </>
    </main>
  );
};

export default Layout;
