import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.scss";
import FloatingWhatsAppButton from "./components/wppbtn";
import { CategoryProvider } from "./context/CategoryContext";

const geist = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });

export const metadata: Metadata = {
  title: "Tens Oportunidade",
  description: "Serviços e Soluções Ache num clique",
  icons: {
    icon: "/favicon.ico"
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <FloatingWhatsAppButton />
        <CategoryProvider>{children}</CategoryProvider>
      </body>
    </html>
  );
}