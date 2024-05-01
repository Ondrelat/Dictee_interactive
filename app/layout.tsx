import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from './components/sessionWraper';
import Navbar from './ui/navbar';
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dictée Interactive",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr">
      <Head>
        <title>Dictée Interactive</title>
        <meta name="keywords" content="Dictée, Orthographe, dictée interactive, dictée audio en ligne, Correction en temps réel, Dictée en temps réel" />
        <meta name="description" content="Avec Dictée Interactive, améliorez votre orthographe grâce à des dictées avec correction en temps réel et des aides interactives personnalisées." />
        <link rel="icon" href="/favicon.ico" type="x-icon" />
      </Head>
      <SessionWrapper>
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
      </SessionWrapper>
    </html>
  );
}