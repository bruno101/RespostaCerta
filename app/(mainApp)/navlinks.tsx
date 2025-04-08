"use client";
import { useState } from "react";
import "../globals.css";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation"; // Add usePathname
import Image from "next/image";
import { Menu, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust the import path based on your shadcn setup

const navItems = [
  { name: "Questões", href: "/questoes" },
  { name: "Cadernos", href: "/cadernos" },
  { name: "Simulados", href: "/simulados" },
  { name: "Minhas Respostas", href: "/painel/questoes-respondidas" },
];

export default function TopMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-cyan-800 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <a href="/" className="flex items-center">
            {" "}
            {/* Wrap logo and name in a link */}
            <Image
              src="/logo.png"
              alt="Resposta Certa Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white text-xl font-semibold ml-2">
              Resposta Certa
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith(item.href) ||
                  (item.name === "Simulados" && pathname === "/gerar-simulado") // Check if the current path starts with the item's href
                    ? "bg-cyan-700 text-white" // Active style
                    : "text-white hover:bg-cyan-700" // Default style
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex">
            {/* Authentication Section */}
            <div className="flex items-center ml-1 mr-5">
              {session ? (
                <Select
                  value=""
                  onValueChange={(value) => {
                    switch (value) {
                      case "painel":
                        router.push("/painel");
                        break;
                      case "admin":
                        router.push("/admin");
                        break;
                      case "correction":
                        router.push("/corrigir-questoes");
                        break;
                      case "logout":
                        signOut();
                        break;
                    }
                  }}
                >
                  <SelectTrigger className="w-[90px] h-[50px] [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-white text-white border-cyan-700 hover:bg-cyan-600 focus:ring-0 data-[state=open]:bg-cyan-600 shadow-cyan-700">
                    <Image
                      src={
                        session.user?.image ||
                        "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
                      }
                      alt="User Profile"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="text-cyan-900 cursor-pointer focus:text-cyan-500"
                      value="painel"
                    >
                      Meu Painel
                    </SelectItem>
                    {(session.user as any)?.role === "admin" && (
                      <SelectItem
                        className="text-cyan-900 cursor-pointer focus:text-cyan-500"
                        value="admin"
                      >
                        Painel de Administração
                      </SelectItem>
                    )}
                    {((session.user as any)?.role === "admin" ||
                      (session.user as any)?.role === "corretor") && (
                      <SelectItem
                        className="text-cyan-900 cursor-pointer focus:text-cyan-500"
                        value="correction"
                      >
                        Correção de Questões
                      </SelectItem>
                    )}
                    <SelectItem
                      className="text-cyan-900 cursor-pointer focus:text-cyan-500"
                      value="logout"
                    >
                      Sair
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <>
                  <a
                    href="/signin"
                    className="text-white hover:bg-cyan-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Entrar
                  </a>
                  <a
                    href="/signup"
                    className="hidden md:inline text-white hover:bg-cyan-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Criar conta
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-white hover:bg-cyan-700 p-2 rounded-md focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-cyan-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname.startsWith(item.href) ||
                  (item.name === "Simulados" && pathname === "/gerar-simulado") // Check if the current path starts with the item's href
                    ? "bg-cyan-700 text-white" // Active style
                    : "text-white hover:bg-cyan-700" // Default style
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
