/* eslint-disable react-hooks/exhaustive-deps */
import { auth } from "@/firebase";
import { useAppSelector } from "@/Redux/hooks";
import { addUser, removeUser } from "@/Redux/slices/UserSlice";
import Avatar from "@/UI/CustomAvatar/Avatar";
import { LogOut } from "lucide-react";
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
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (cookies.get("user")) {
      dispatch(addUser(cookies.get("user")));
      console.log(cookies.get("user"));
    }
  }, []);

  const handleLogout = () => {
    cookies.remove("user");
    cookies.remove("user-token");
    router.push("/auth/login");
    dispatch(removeUser());
    setIsOpen(false)
  };

  return (
    <div className="flex w-full items-center p-3 px-5 glass-panel rounded-2xl space-x-4 justify-start">
      <Avatar
        src={userData.user?.avatar!}
        alt={userData.user?.name!}
        isEditable
      />

      <div className="flex flex-col min-w-0">
        <h3 className="text-base font-bold text-gray-100 truncate">{userData.user?.name}</h3>
        <p className="text-xs text-gray-400 truncate">{userData.user?.email}</p>
      </div>

      <button
        className="!ml-auto text-gray-400 hover:text-red-400 hover:scale-105 transition-all duration-300 p-2 rounded-lg hover:bg-white/5"
        onClick={() => setIsOpen(true)}
        title="Logout"
      >
        <LogOut size={20} />
      </button>

      <Dialog
        open={isOpen}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        id="dialog"
        onClose={() => setIsOpen(false)}
      >
        <DialogPanel className="max-w-md w-full glass-panel rounded-[24px] p-6 shadow-2xl border border-white/10 flex flex-col space-y-6 animate-in fade-in zoom-in duration-300">
          <div>
            <h3 className="text-2xl font-bold text-gray-100">Confirm Logout</h3>
            <p className="text-gray-400 mt-2">Are you sure you want to log out of ChatBox?</p>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button 
              onClick={() => setIsOpen(false)} 
              className="px-4 py-2.5 text-sm font-semibold border border-white/10 rounded-xl hover:bg-white/5 text-gray-300 transition-all duration-300"
            >
              Cancel
            </button>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600/90 hover:bg-red-500 rounded-xl transition-all duration-300 shadow-lg shadow-red-950/20 border border-red-500/10"
            >
              Logout
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default UserDetails;
