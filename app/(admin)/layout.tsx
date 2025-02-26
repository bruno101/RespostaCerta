"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoMenuSharp } from "react-icons/io5";
import { FaFileCircleQuestion, FaUser, FaUserCheck } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const iconStyle = "mt-[11px] text-cyan-300 mr-2";
  const menuItems = [
    {
      title: "Questões",
      link: "/",
      icon: <FaFileCircleQuestion className={iconStyle} />,
    },
    {
      title: "Simulados",
      link: "/admin/simulados",
      icon: <PiExamFill className={iconStyle} />,
    },
    {
      title: "Usuários",
      link: "/admin/usuarios",
      icon: <FaUser className={iconStyle} />,
    },
    {
      title: "Papéis",
      link: "/admin/papeis",
      icon: <FaUserCheck className={iconStyle} />,
    },
  ];
  return (
    <div className="flex flex-col w-full max-w-screen h-full min-h-[100vh] bg-slate-50">
      <div className="h-[40px] w-full flex bg-blue-400 fixed z-[11]">
        <button
          onClick={() => setShowMobileMenu((x) => !x)}
          className="my-auto ml-5 sm:hidden"
        >
          <IoMenuSharp className="text-white w-6 h-6" />
        </button>
        <Link
          href="/"
          className="text-white font-bold my-auto text-lg ml-5 mr-0 sm:mr-[180px]"
        >
          Resposta Certa
        </Link>
        <p className="hidden sm:flex text-white text-lg my-auto">
          Painel de Administração
        </p>
      </div>
      <div className="flex w-full h-full mt-[40px]">
        <nav
          className={`transition-all duration-300 transform ${
            showMobileMenu
              ? "w-[180px] sm:w-[300px] flex flex-col translate-x-0 opacity-100"
              : "w-0 sm:w-[300px] opacity-0 sm:opacity-100 -translate-x-full sm:translate-x-0 sm:flex sm:flex-col"
          } bg-slate-600 fixed z-10 h-full`}
        >
          <div className="flex flex-row pr-2 ml-2 mt-2">
            <div className="min-w-10 min-h-10 my-auto">
              <Image
                src={
                  session?.user?.image
                    ? session?.user?.image
                    : "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
                }
                alt="Circle Image"
                width={64}
                height={64}
                className="object-cover w-8 h-8 rounded-full overflow-hidden mx-auto mt-1"
              />
            </div>

            <div className="flex flex-wrap mt-2 ml-2 mr-2">
              <p className="text-cyan-200">{session?.user?.name}</p>
            </div>
          </div>
          <div className="h-10 w-full bg-slate-800 text-slate-400 px-2 text-sm mt-2">
            <p className="mt-[10px]">GERENCIAR RECURSOS</p>
          </div>
          {menuItems.map((item, index: number) => (
            <Link key={index} href={item.link}>
              <div className="h-10 hover:bg-slate-500 text-white pl-3 flex">
                {item.icon}
                <p className="mt-[7px] text-cyan-300">{item.title}</p>
              </div>
            </Link>
          ))}
        </nav>
        <div className="w-full sm:ml-[300px] min-h-[calc(100vh-40px)]">{children}</div>
      </div>
    </div>
  );
}
