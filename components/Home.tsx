"use client";
import { Fuel, TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-8">
      {/* Texto seja bem-vindo */}
      <div className="text-center mt-12">
        <p className="text-gray-600 text-lg">SEJA</p>
        <h1 className="text-5xl font-extrabold text-green-600">BEM-VINDO</h1>
      </div>

      {/* Cards para Abastecimento e Falhas */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-20 w-full max-w-xs">
        {/* Card Abastecimento */}
        <Link
          href="/links/abastecimento"
          className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
        >
          <Fuel className="w-20 h-20 text-green-500" />
          <span className="mt-4 text-lg font-semibold text-gray-600">
            Abastecimento
          </span>
        </Link>

        {/* Card Falhas */}
        <Link
          href="/links/falhas"
          className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
        >
          <TriangleAlert className="w-20 h-20 text-orange-500" />
          <span className="mt-4 text-lg font-semibold text-gray-600">Falhas</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
