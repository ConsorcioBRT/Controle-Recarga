import React from "react";
import { Avatar } from "./ui/avatar";

const Header = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-start hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        <Avatar className="bg-gray-300" />
        <span className="text-xl">Jorge da Silva</span>
      </div>
    </div>
  );
};

export default Header;
