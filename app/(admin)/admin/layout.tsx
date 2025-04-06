"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoMenuSharp } from "react-icons/io5";
import { FaFileCircleQuestion, FaUser, FaUserCheck } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import { FaFilter } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const iconStyle = "mt-[11px] text-cyan-100 mr-2";
  const menuItems = [
    {
      title: "Questões",
      link: "/admin",
      icon: <FaFileCircleQuestion className={iconStyle} />,
    },
    {
      title: "Filtros",
      link: "/admin/filtros",
      icon: <FaFilter className={iconStyle} />,
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
      <div className="h-[40px] w-full flex bg-blue-400 fixed z-[11] shadow-md">
        <button
          onClick={() => setShowMobileMenu((x) => !x)}
          className="my-auto ml-5 sm:hidden"
        >
          <IoMenuSharp className="text-white w-6 h-6" />
        </button>
        <Link
          href="/"
          className="flex text-white font-bold my-auto text-lg sm:mr-[180px]"
        >
          <Image
            alt={"logo"}
            src={
              "https://img.icons8.com/?size=100&id=mocKqJgwSoT7&format=png&color=0000000"
            }
            width={100}
            height={100}
            className="w-8 h-8 my-auto ml-4 mr-2"
          />
          Resposta Certa
        </Link>
        <Link href="/admin" className="hidden sm:flex my-auto">
          <p className=" text-white text-lg">Painel de Administração</p>
        </Link>
      </div>
      <div className="flex w-full h-full mt-[40px]">
        <nav
          className={`transition-all duration-300 transform ${
            showMobileMenu
              ? "w-[180px] sm:w-[300px] flex flex-col translate-x-0 opacity-100"
              : "w-0 sm:w-[300px] opacity-0 sm:opacity-100 -translate-x-full sm:translate-x-0 sm:flex sm:flex-col"
          } bg-cyan-800 fixed z-10 h-full`}
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
              <p className="text-cyan-100">{session?.user?.name}</p>
            </div>
          </div>
          <div className="h-10 w-full bg-cyan-950 text-cyan-200 px-2 text-sm mt-2">
            <p className="mt-[10px] flex text-[13px] font-bold">
              <MdManageAccounts className="mt-[-3px] h-6 w-6 mr-[6px]" />
              GERENCIAR RECURSOS
            </p>
          </div>
          {menuItems.map((item, index: number) => (
            <Link key={index} href={item.link}>
              <div className="h-10 hover:bg-cyan-500 hover:text-white focus:bg-cyan-500 focus:text-white text-white pl-3 flex">
                {item.icon}
                <p className="mt-[7px] text-cyan-100">{item.title}</p>
              </div>
            </Link>
          ))}
        </nav>
        <div className="w-full sm:w-[calc(100%-300px)] sm:ml-[300px] min-h-[calc(100vh-40px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
