"use client";
import "./globals.css";
import DesktopMenu from "./ui/navigation/DesktopMenu";
import MobileMenu from "./ui/navigation/MobileMenu";
import { SessionProvider } from "next-auth/react";

export default function NavLinks() {
  // Navigation items array
  const navItems = [
    { name: "Questões", href: "/" },
    { name: "Cadernos", href: "/cadernos" },
    { name: "Simulados", href: "/simulados" },
  ];

  return (
    <div className="-mt-[21vh] sm:-mt-[41vh]">
      <nav className="block w-full max-w-screen px-4 pt-4 mx-auto top-3 lg:px-8">
        <SessionProvider>
          <div className="lg:hidden container flex items-center justify-between mx-auto text-slate-800">
            <MobileMenu navItems={navItems} />
          </div>
          <div className="hidden lg:block container flex flex-wrap items-center justify-between mx-auto text-slate-800">
            <DesktopMenu navItems={navItems} />
          </div>
        </SessionProvider>
      </nav>
    </div>
  );
}
