"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="h-[100vh] w-[100vw] bg-slate-50">
      <div className="flex h-[90vh]">
        <div className="flex flex-col ml-auto mr-auto mt-auto mb-auto shadow-xl border-[1px] rounded-lg">
          <div className="flex flex-col border-b-1 rounded-t-lg bg-white">
            <Image
              className="mx-auto mt-[30px] mb-5"
              alt="logo"
              src="/request.png"
              width={50}
              height={50}
            />
            <p className="font-bold text-[17px] mb-2 ml-auto mr-auto">
              Entrar no Resposta Certa
            </p>
            <p className="font-bold text-[12px] mb-4 text-gray-400 ml-auto mr-auto">
              Treine sua escrita e conquiste sua vaga!
            </p>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-b-lg pb-[20px] px-10 sm:px-20">
            <button
              className="rounded-md bg-blue-500 hover:bg-blue-400 focus:outline focus:outline-2 focus:outline-blue-700 focus:bg-blue-400 w-[250px] py-1 text-white ml-auto mr-auto my-5"
                onClick={() => signIn("google", {callbackUrl: "/"})}
            >
              Entrar com o Google
            </button>
            <div className="flex">
              <hr className="w-[104px] mt-[10px] ml-auto" />
              <p className="text-[13px] mx-3 text-slate-600">ou</p>
              <hr className="w-[104px] mt-[10px] mr-auto" />
            </div>
            <input
              placeholder="exemplo@dominio.com"
              className="shadow-sm px-2 border-1 rounded-md w-[250px] py-1 ml-auto mr-auto mt-5"
            />
            <button className="rounded-md border-1 focus:outline focus:outline-blue-400 focus:outline-2 focus:bg-blue-200  hover:bg-blue-200 bg-white w-[250px] py-1 text-black ml-auto mr-auto my-5">
              Continuar com Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
