import { useAppSelector } from "@/Redux/hooks";
import { addUser, removeUser } from "@/Redux/slices/UserSlice";
import LogoutIcon from "@/UI/icons/LogoutIcon";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";

const UserDetails = () => {
  const userData = useAppSelector((state) => state.rootstate.userdata);
  const cookies = new Cookies();
  const dispatch = useDispatch();

  useEffect(() => {
    

    if (cookies.get('user')) {
      dispatch(addUser(cookies.get('user')))
    }
  }, [])
  

  const handleLogout = () => {
    cookies.remove("user-token");
    dispatch(removeUser());
  };

  return (
    <div className="flex w-full items-center p-3 px-5 search_bar rounded-2xl space-x-4 bg-white justify-start">
      <figure className="leading-[0] rounded-full size-[48px] overflow-hidden border-[3px] ">
        <Image
          src={userData.user?.avatar!}
          alt="userImg"
          width={50}
          height={50}
        />
      </figure>

      <div>
      
        <h3 className="text-lg font-semibold">{userData.user?.name}</h3>{" "}
        <p className="text-sm">{userData.user?.email}</p>
      </div>

      <button className="!ml-auto hover:opacity-50" onClick={handleLogout}>
        <LogoutIcon />
      </button>
    </div>
  );
};

export default UserDetails;
