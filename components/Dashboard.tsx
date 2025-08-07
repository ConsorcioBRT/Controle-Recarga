import React from "react";
import { Separator } from "./ui/separator";

const Administrador = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl">Dashboard</h1>
        <Separator className="mt-2 mb-5" />
      </div>

      {/* Corpo da Página */}
      <div className="grid grid-cols-4 gap-6 p-10">
        {/* Quatidade Eletropostos */}
        <div className="bg-gray-700 rounded-lg shadow-lg flex items-center justify-center gap-5 p-3 hover:bg-gray-500">
          <div>
            <h1 className="text-white">Eletropostos</h1>
          </div>
          <div className="bg-white rounded-full p-12">
            <span className="text-4xl">5</span>
          </div>
        </div>

        {/* Quatidade Operadores */}
        <div className="bg-gray-700 rounded-lg shadow-lg flex items-center justify-center gap-5 p-3 hover:bg-gray-500">
          <div>
            <h1 className="text-white">Operadores</h1>
          </div>
          <div className="bg-white rounded-full p-12">
            <span className="text-4xl">15</span>
          </div>
        </div>

        {/* Quatidade Veículos */}
        <div className="bg-gray-700 rounded-lg shadow-lg flex items-center justify-center gap-5 p-3 hover:bg-gray-500">
          <div>
            <h1 className="text-white">Veículos</h1>
          </div>
          <div className="bg-white rounded-full p-12">
            <span className="text-4xl">40</span>
          </div>
        </div>

        {/* Quatidade Consorciadas */}
        <div className="bg-gray-700 rounded-lg shadow-lg flex items-center justify-center gap-5 p-3 hover:bg-gray-500">
          <div>
            <h1 className="text-white">Consorciadas</h1>
          </div>
          <div className="bg-white rounded-full p-12">
            <span className="text-4xl">7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administrador;
