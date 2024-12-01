import { auth } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import { addUser, removeUser } from "@/Redux/slices/UserSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import LogoutIcon from "@/UI/icons/LogoutIcon";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";

// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

const UserDetails = () => {
  const userData = useAppSelector((state) => state.rootstate.userdata);
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const router = useRouter();
  let [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (cookies.get("user")) {
      dispatch(addUser(cookies.get("user")));
      console.log(cookies.get("user"));
    }
  }, []);

  const handleLogout = () => {
    cookies.remove("user");
    cookies.remove("user-token");
    router.push("/");
    dispatch(removeUser());
  };

  return (
    <div className="flex w-full items-center p-3 px-5 search_bar rounded-2xl space-x-4 bg-white justify-start">
      {/* <figure className="leading-[0] rounded-full size-[48px] overflow-hidden border-[3px] ">
        <Image
          src={userData.user?.avatar!}
          alt="userImg"
          width={50}
          height={50}
        />
      </figure> */}
      <Avatar
        src={userData.user?.avatar!}
        alt={userData.user?.name!}
        isEditable
      />

      <div>
        <h3 className="text-lg font-semibold">{userData.user?.name}</h3>
        <p className="text-sm">{userData.user?.email}</p>
      </div>

      <button
        className="!ml-auto hover:opacity-50"
        onClick={() => setIsOpen(true)}
      >
        <LogoutIcon />
      </button>

      <Dialog
        open={isOpen}
        className="size-full fixed top-0 left-0 z-[999] bg-black/50"
        id="dialog"
        onClose={() => setIsOpen(false)}
      >
        <DialogPanel className="max-w-[550px] m-auto h-full flex">
          <div className=" m-auto w-full h-auto max-h-[calc(100%-200px)] bg-white">
            <button onClick={() => setIsOpen(false)}>Deactivate</button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default UserDetails;
