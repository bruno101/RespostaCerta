import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

const roboto = Lato({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resposta Certa",
  description:
    "Questões discursivas de concursos públicos para você praticar e aprimorar suas respostas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased z-0 relative`}>
        <AuthProvider> {children}</AuthProvider>
      </body>
    </html>
  );
}
