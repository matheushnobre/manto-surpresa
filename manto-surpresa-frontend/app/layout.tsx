import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fredoka } from "next/font/google";
import "./globals.css";
import Header from "../components/header/Header";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Manto Surpresa | Caixas Surpresa de Camisas de Futebol",
  description:
    "Receba uma camisa de futebol surpresa e viva a emoção de descobrir seu próximo manto. Escolha sua caixa e surpreenda-se!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-Br" className={cn("font-sans", geist.variable)}>
      <body className={fredoka.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
