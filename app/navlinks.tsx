"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./globals.css"

export default function NavLinks() {
  const pathName = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items array
  const navItems = [
    { name: "Filtro de Questões", href: "/" },
    { name: "Cadernos", href: "/cadernos" },
    { name: "Simulados", href: "/simulados" },
  ];

  return (
    <div className="-mt-[21vh] sm:-mt-[41vh]">
      <nav className="block w-full max-w-screen px-4 pt-4 mx-auto top-3 lg:px-8">
        <div className="lg:hidden container flex items-center justify-between mx-auto text-slate-800">
          <button
            className="relative h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={toggleMobileMenu}
            type="button"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </span>
          </button>

          <Link href="/" className="text-2xl text-white font-bold ml-3 -mt-2">
            Questões Discursivas
          </Link>

          <button className="text-l text-white font-bold ml-auto -mt-1">
            Entrar
          </button>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 left-0 min-h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }  z-50`}
          >
            <div className="flex flex-row items-center border-b pb-4">
              <Link
                href="/"
                className="cursor-pointer font-bold text-xl pt-4 ps-4"
              >
                Questões Discursivas
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="absolute top-4 right-4 text-slate-600 hover:text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col h-full gap-4 p-4">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1 text-lg gap-x-2 text-slate-600 hover:text-slate-400"
                >
                  <Link href={item.href} className="flex items-center">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hidden lg:block container flex flex-wrap items-center justify-between mx-auto text-slate-800">
          {/* Desktop Menu */}
          <div className="flex flex-row">
            <Link href="/" className="text-2xl text-white font-bold">
              Questões Discursivas
            </Link>
            <button className="text-l text-white font-bold ml-auto">
              Entrar
            </button>
          </div>

          <div className="flex mt-10 flex-row items-center gap-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center py-2 px-4 text-lg text-white hover:bg-[#0a89a8] rounded-t-md ${pathName===item.href || (pathName.startsWith("/questoes") && item.href==="/")? "active":""}`}
              >
                <div className="flex items-center">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
