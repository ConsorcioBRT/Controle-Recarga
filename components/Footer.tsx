"use client";
import { AlertTriangle, Fuel, Home } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    pathname === path
      ? "text-gray-800 font-bold" // cor quando está ativo
      : "text-gray-400";

  return (
    <div
      className={`bg-white flex items-center justify-center h-16 ${className}`}
    >
      <div className="flex items-center justify-between gap-16">
        <Link href="/terminal" className="flex flex-col items-center">
          <Home className={`w-5 h-5 ${linkClasses("/terminal")}`} />
          <span className={linkClasses("/terminal")}>Menu</span>
        </Link>

        <Link href="/abastecimento" className="flex flex-col items-center">
          <Fuel className={`w-5 h-5 ${linkClasses("/abastecimento")}`} />
          <span className={linkClasses("/abastecimento")}>Recarga</span>
        </Link>

        <Link href="/falhas" className="flex flex-col items-center">
          <AlertTriangle className={`w-5 h-5 ${linkClasses("/falhas")}`} />
          <span className={linkClasses("/falhas")}>Falhas</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
