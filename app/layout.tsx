import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from './components/sessionWraper';
import Navbar from './ui/navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dictée Interactive",
  description: "Avec Dictée Interactive, améliorez votre orthographe grâce à des dictées avec correction en temps réel et des aides interactives personnalisées.",
  keywords: "Dictée, Orthographe, dictée interactive, dictée audio en ligne, Correction en temps réel, Dictée en temps réel",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <SessionWrapper>
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
      </SessionWrapper>
    </html>
  );
}