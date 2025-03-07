import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DesktopMenu({
  navItems,
}: {
  navItems: { name: string; href: string }[];
}) {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row">

        <Link href="/" className="flex text-2xl text-white font-bold">
        <Image
          alt={"logo"}
          src={
            "https://img.icons8.com/?size=100&id=mocKqJgwSoT7&format=png&color=0000000"
          }
          width={100}
          height={100}
          className="w-11 h-11 mr-2 my-auto -mt-1"
        />
        Resposta Certa
        </Link>
        {session === null && (
          <Link className="ml-auto mr-5" href="/signup">
            <button className="focus:bg-cyan-600 focus:outline focus:border-0 focus:outline-2 focus:outline-cyan-300 hover:bg-cyan-600 rounded-3xl px-4 py-1 border-white border-1 text-l text-white font-bold ">
              Criar conta
            </button>
          </Link>
        )}
        {session && (
          <div className="text-white ml-auto mr-5">
            <Select
              value={""}
              onValueChange={(value) => {
                switch (value) {
                  case "painel":
                    router.push("/painel");
                    break;
                  case "admin":
                    router.push("/admin");
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
                    session?.user?.image
                      ? session?.user?.image
                      : "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
                  }
                  alt="Circle Image"
                  width={64}
                  height={64}
                  className="object-cover w-9 h-9 rounded-full overflow-hidden"
                />
                <SelectValue placeholder="" className="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="text-cyan-700 cursor-pointer focus:text-cyan-400"
                  value="painel"
                >
                  Meu Painel
                </SelectItem>
                {(session?.user as any)?.role === "admin" && (
                  <SelectItem
                    className="text-cyan-700 cursor-pointer focus:text-cyan-400"
                    value="admin"
                  >
                    Painel de Administração
                  </SelectItem>
                )}
                <SelectItem
                  className="text-cyan-700 cursor-pointer focus:text-cyan-400"
                  value="logout"
                >
                  Sair
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {session === null && (
          <Link href="/signin" className="mr-5">
            <button className=" rounded-3xl px-4 py-1 bg-[#15bdb2] focus:outline focus:outline-2 focus:outline-blue-400 hover:bg-[#2ee8dc] focus:bg-[#2ee8dc] text-l text-white font-bold ">
              Entrar
            </button>
          </Link>
        )}
      </div>

      <div className="flex mt-10 flex-row items-center gap-6">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`box-border flex items-center pt-2 pb-4 px-4 text-lg text-white hover:bg-[#0a89a8] rounded-t-md ${
              pathName === item.href ||
              (pathName.startsWith("/questoes") && item.href === "/")
                ? "active"
                : ""
            }`}
          >
            <div className="flex items-center">{item.name}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
