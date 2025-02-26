"use client";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiLogoGoogle } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";
import Image from "next/image";

export default function Page() {
  const [error, setError] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigningIn(true);
    try {
      const formData = new FormData(event.currentTarget);

      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.ok) return router.push("/");
      if (res?.error === "Invalid Password") {
        setError("Senha incorreta.");
        setSigningIn(false);
      } else if (res?.error === "Invalid Email") {
        setSigningIn(false);

        setError("Email incorreto.");
      } else if (res?.error) {
        setSigningIn(false);
        setError("Ocorreu um erro. Tente novamente.");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
        setSigningIn(false);
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-slate-50">
      <div className="flex h-[100vh]">
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
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4">
                {error}
              </div>
            )}
            <button
              className="flex rounded-md bg-blue-500 hover:bg-blue-400 focus:outline focus:outline-2 focus:outline-blue-700 focus:bg-blue-400 w-[250px] py-1 text-white mx-auto my-5"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <BiLogoGoogle className="w-6 h-6 mt-[0px] ml-auto mr-2" />
              <p className="mr-auto">Entrar com o Google</p>
            </button>
            <div className="flex">
              <hr className="w-[104px] mt-[10px] ml-auto" />
              <p className="text-[13px] mx-3 text-slate-600">ou</p>
              <hr className="w-[104px] mt-[10px] mr-auto" />
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label className="text-xs font-bold mt-3 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@dominio.com"
                className="shadow-sm px-2 border-1 rounded-md w-[250px] py-1 ml-auto mr-auto"
              />
              <label className="text-xs font-bold mt-3 mb-1">Senha</label>
              <div className="flex w-full ml-auto mr-auto">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="6+ caracteres"
                  className="w-full shadow-sm px-2 border-1 rounded-l-md w-[250px] py-1"
                  name="password"
                />
                <button
                  className="w-2/12 bg-white border-1 shadow-sm rounded-r-md  
flex items-center justify-center transition duration-150 ease hover:bg-blue-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                </button>
              </div>
              <Link
                href="/forgot-password"
                className="text-[10px] text-cyan-700 hover:text-cyan-500 focus:text-cyan-500 font-bold ml-auto mt-[4px]"
              >
                Esqueceu a senha?
              </Link>
              <button className="rounded-md border-1 focus:outline focus:outline-blue-400 focus:outline-2 focus:bg-blue-200  hover:bg-blue-200 bg-white w-[250px] py-1 text-black ml-auto mr-auto mt-5 mb-2">
                {signingIn ? "Entrando..." : "Entrar"}
              </button>
            </form>
            <p className="text-xs text-[#888] mx-auto">
              Ainda não possui uma conta?{" "}
              <Link
                href="/signup"
                className="transition duration-150 ease hover:text-cyan-900 focus:text-cyan-900"
              >
                <u>Registre-se.</u>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
