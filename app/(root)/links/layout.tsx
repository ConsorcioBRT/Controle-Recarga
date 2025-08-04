import { ReactNode } from "react";
import Footer from "@/components/Footer"; // ajuste o caminho se precisar

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
