"use client";

import React from "react";
import { Fuel, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const EscolherPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Cards */}
        <div className="space-y-6">
          {/* Abastecimento */}
          <button
            type="button"
            className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center gap-4"
            onClick={() => router.push("/abastecimento")}
          >
            <div className="text-green-600">
              <Fuel className="h-20 w-20" strokeWidth={1.5} />
            </div>
            <span className="text-gray-700 font-medium text-lg">
              Abastecimento
            </span>
          </button>

          {/* Falhas */}
          <button
            type="button"
            className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center gap-4"
            onClick={() => router.push("/checklist")}
          >
            <div className="text-green-600">
              <Check className="h-20 w-20" strokeWidth={1.5} />
            </div>
            <span className="text-gray-700 font-medium text-lg">Checklist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscolherPage;
