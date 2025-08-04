import { Fuel, Home, TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  return (
    <div
      className={`bg-green-500 flex items-center justify-center h-20 ${className}`}
    >
      <div className="flex items-center justify-between gap-20">
        <Link href="/home">
          <Home className="w-9 h-9 text-white" />
        </Link>
        <Link href="/links/abastecimento">
          <Fuel className="w-9 h-9 text-white" />
        </Link>
        <Link href="/links/falhas">
          <TriangleAlert className="w-9 h-9 text-white" />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
