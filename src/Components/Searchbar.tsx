import SearchIcon from "@/UI/icons/SearchIcon";
import React from "react";

const Searchbar = () => {
  return (
    <div className="shadow-xl rounded-[16px] w-full h-16 bg-white flex items-center justify-normal px-4 search_bar">
      <input type="text" className="bg-transparent w-full outline-none text-black p-4 text-lg font-medium" placeholder="Search "/>
      <button>
        <SearchIcon/>
      </button>
    </div>
  );
};

export default Searchbar;
