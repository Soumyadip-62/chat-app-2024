import { assets } from "@/assets";
import { chatlist } from "@/lib/mock/chatlist.mock";
import DoubleTick from "@/UI/icons/DoubleTick";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ChatList = () => {
  return (
    <div className="search_bar px-5 py-7 rounded-[25px] h-[calc(100vh-160px)]">
      <h3 className="text-2xl mb-4 font-bold">People</h3>

      <ul>
        {chatlist.map((item, idx) => (
          <li
            className="border-b-[1px] py-3.5 px-2  last:mb-0 last:border-b-0 rounded-lg hover:bg-blue-200"
            key={idx}
          >
            <Link
              href="/"
              className="flex items-start "
            >
              <figure className="size-[50px] rounded-full overflow-hidden mr-4">
                <Image
                  src={item.userImg!}
                  alt="user1"
                  width={50}
                  height={50}
                  className="size-full object-cover"
                />
              </figure>
              <div className="max-w-[calc(100%-64px)] flex w-full">
                <div className="w-[calc(100%-65px)]">
                  <h4 className="text-lg font-bold">{item.userName}</h4>
                  <p className="text-base text-gray-500 font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.lastMessage}
                  </p>
                </div>

                <div className="ml-auto flex flex-col items-end">
                  <p>{item.time}</p>
                  <i>
                    <DoubleTick />
                  </i>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
