import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from './components/sessionWraper';
import Navbar from './ui/navbar';
import Footer from './footer';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr">
      <head>
        <title>Dictée Interactive - Améliorez votre orthographe</title>
        {/* Autres balises meta, liens vers des fichiers CSS et JS, etc. */}
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}