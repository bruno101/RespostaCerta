import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { handleSignIn, handleSignOut } from "@/lib/auth.js";

export default function DesktopMenu({
  navItems,
}: {
  navItems: { name: string; href: string }[];
}) {
  const { data: session } = useSession();
  const pathName = usePathname();

  return (
    <>
      <div className="flex flex-row">
        <Link href="/" className="text-2xl text-white font-bold">
          Questões Discursivas
        </Link>
        {/*<button className="hover:bg-cyan-600 rounded-3xl px-4 py-1 border-white border-1 text-l text-white font-bold ml-auto mr-5">
              Criar conta
            </button>*/}
        <button
          onClick={() => {
            session ? handleSignOut() : handleSignIn();
          }}
          className="ml-auto mr-5 rounded-3xl px-4 py-1 bg-[#15bdb2] hover:bg-[#2ee8dc] text-l text-white font-bold "
        >
          {session ? "Sair" : "Entrar"}
        </button>
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
