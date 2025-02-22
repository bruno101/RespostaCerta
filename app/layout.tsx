import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import NavLinks from "./navlinks";

const roboto = Lato({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Questões Discursivas",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased z-0 relative`}>
        <div>

          <div className="bg-cyan-700 w-full h-[25vh] sm:h-[45vh] pt-5 pl-5 sm:pl-7"></div>

          <NavLinks />

          <div className="mb-10 min-h-[400px] bg-white border-1 mt-10 lg:mt-0 md:ml-4 md:mr-4 md:rounded-lg">
          {children}</div>

        </div>
      </body>
    </html>
  );
}
