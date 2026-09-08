import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manto Surpresa | Caixas Surpresa de Camisas de Futebol",
  description:
    "Receba uma camisa de futebol surpresa e viva a emoção de descobrir seu próximo manto. Escolha sua caixa e surpreenda-se!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-Br">
      <body className={nunito.className}>
        {children}
      </body>
    </html>
  );
}
