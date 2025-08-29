import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";

interface Usuario {
  UsrNme: string;
  UsrCpf: string;
  UsrEml: string;
  UsrId: number;
  UsrTpoId: number;
}

type EletropostoSelecionado = {
  UndId: number;
  PostoRecarga: string;
  Contagem: number;
};

const Header = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [eletroposto, setEletroposto] = useState<EletropostoSelecionado | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogado");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
    const posto = localStorage.getItem("eletropostoSelecionado");
    if (posto) {
      setEletroposto(JSON.parse(posto));
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("usuarioLogado"); // Vai limpar o localStorage
    router.push("/login");
  };

  return (
    <div className="w-full bg-gray-800 rounded-b-3xl shadow-md p-5 flex flex-col items-start hover:shadow-lg transition">
      <div className="flex items-center justify-between gap-28">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{usuario?.UsrNme?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-lg text-white">
              {usuario?.UsrNme ?? "Usuário"}
            </span>
            {eletroposto && (
              <span className="text-sm text-white flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {eletroposto.PostoRecarga}
              </span>
            )}
          </div>
        </div>
        <div>
          <LogOut onClick={handleLogout} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default Header;
