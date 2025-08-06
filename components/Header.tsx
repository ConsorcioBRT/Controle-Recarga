import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-start hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/leerob.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="text-xl">Jorge da Silva</span>
          <span className="text-sm text-gray-600">Cruzeiro</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
