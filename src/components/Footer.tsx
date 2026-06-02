"use client";
import { Fuel, Gauge } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const pathname = usePathname();

  const [isBiogasPosto] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const posto = localStorage.getItem("eletropostoSelecionado");
      if (!posto) return false;
      return JSON.parse(posto).UndId === 21;
    } catch {
      return false;
    }
  });

  if (!isBiogasPosto) return null;

  const isActive = (path: string) => pathname === path;

  const itemClasses = (path: string) =>
    `flex flex-col items-center gap-0.5 px-5 py-1 rounded-xl transition-colors ${
      isActive(path) ? "bg-green-50" : "hover:bg-gray-100"
    }`;

  const iconClasses = (path: string) =>
    `w-5 h-5 ${isActive(path) ? "text-green-600" : "text-gray-500"}`;

  const labelClasses = (path: string) =>
    `text-xs font-semibold ${isActive(path) ? "text-green-600" : "text-gray-500"}`;

  return (
    <div
      className={`bg-white border-t border-gray-200 flex items-center justify-center h-16 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Recarga */}
        <Link href="/abastecimento" className={itemClasses("/abastecimento")}>
          <Fuel className={iconClasses("/abastecimento")} />
          <span className={labelClasses("/abastecimento")}>Recarga</span>
        </Link>

        {/* Manômetro */}
        <Link href="/manometro" className={itemClasses("/manometro")}>
          <Gauge className={iconClasses("/manometro")} />
          <span className={labelClasses("/manometro")}>Manômetro</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
