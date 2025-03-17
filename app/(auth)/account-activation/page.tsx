"use client"
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function VerifyAccount() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="h-[100vh] w-[100vw] bg-slate-50">
      <div className="flex h-[100vh]">
        <div className="flex flex-col ml-auto mr-auto mt-auto mb-auto shadow-xl border-[1px] rounded-lg">
          <div className="max-w-[400px] p-10 flex flex-col border-b-1 rounded-t-lg bg-white">
            <Image
              className="mx-auto mt-[10px] mb-5"
              alt="logo"
              src="/logo.png"
              width={50}
              height={50}
            />
            <p className="font-bold text-[17px] mb-2">
              Vamos verificar
            </p>
            <p className="font-bold text-[17px] mb-2 -mt-3 text-cyan-800">
              seu endereço de email
            </p>
            <p className="mx-auto text-[13px] mb-4 text-gray-700 ml-auto mr-auto">
              Para poder fazer login e aproveitar ao máximo o Resposta Certa, por favor clique
              no link de confirmação no email que enviamos para:
            </p>
            <div className="px-3 py-1 text-cyan-900 rounded-sm w-full bg-cyan-50 border-1 border-cyan-300"><p className="mb-[2px]">{email}</p></div>
            <p className="text-[12px] mt-4">
              <b>Não recebeu o email?</b> Cheque a sua pasta de spam, ele pode
              ter sido capturado por um filtro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
