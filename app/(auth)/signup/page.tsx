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
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameBlurred, setNameBlurred] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const nameValid = name.trim().length > 0;
  const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    email
  );
  const passwordValid = password.length >= 7;
  const formValid = nameValid && emailValid && passwordValid;
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigningUp(true);
    try {
      const formData = new FormData(event.currentTarget);
      const signupResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signup`,
        {
          email: formData.get("email"),
          password: formData.get("password"),
          name: formData.get("name"),
        }
      );
      /*const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: formData.get("password"),
        redirect: false,
      });*/

      if (signupResponse) {
        router.push("/account-activation" + "?email=" + formData.get("email"));
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
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
              src="/logo.png"
              width={50}
              height={50}
            />
            <p className="font-bold text-[17px] mb-2 ml-auto mr-auto">
              Criar conta no Resposta Certa
            </p>
            <p className="font-bold text-[12px] mb-4 text-gray-400 ml-auto mr-auto">
              Treine sua escrita e conquiste sua vaga!
            </p>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-b-lg pb-[20px] px-10 sm:px-20">
            <button
              className="flex rounded-md bg-blue-500 hover:bg-blue-400 focus:outline focus:outline-2 focus:outline-blue-700 focus:bg-blue-400 w-[250px] py-1 text-white mx-auto my-5"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <BiLogoGoogle className="w-6 h-6 mt-[0px] ml-auto mr-2" />
              <p className="mr-auto">Criar conta com o Google</p>
            </button>
            <div className="flex">
              <hr className="w-[104px] mt-[10px] ml-auto" />
              <p className="text-[13px] mx-3 text-slate-600">ou</p>
              <hr className="w-[104px] mt-[10px] mr-auto" />
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              {error && <div className="">{error}</div>}
              <label className="text-xs font-bold mt-5 mb-1">Nome</label>
              <input
                type="text"
                name="name"
                onBlur={() => setNameBlurred(true)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${
                  nameValid && "border-0 outline outline-2 outline-green-400"
                } ${
                  !nameValid &&
                  nameBlurred &&
                  "border-0 outline outline-2 outline-red-400"
                } shadow-sm px-2 border-1 rounded-md w-[250px] py-1 ml-auto mr-auto`}
              />
              <label className="text-xs font-bold mt-3 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onBlur={() => setEmailBlurred(true)}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                placeholder="email@dominio.com"
                className={`${
                  emailValid && "border-0 outline outline-2 outline-green-400"
                } ${
                  !emailValid &&
                  emailBlurred &&
                  "border-0 outline outline-2 outline-red-400"
                } shadow-sm px-2 border-1 rounded-md w-[250px] py-1 ml-auto mr-auto`}
              />
              <label className="text-xs font-bold mt-3 mb-1">Senha</label>
              <div className="flex w-full ml-auto mr-auto">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ caracteres"
                  onBlur={() => setPasswordBlurred(true)}
                  className={`${
                    passwordValid &&
                    "border-0 outline outline-2 outline-green-400"
                  } ${
                    !passwordValid &&
                    passwordBlurred &&
                    "border-0 outline outline-2 outline-red-400"
                  } w-full shadow-sm px-2 border-1 rounded-l-md w-[250px] py-1`}
                  name="password"
                />
                <button
                  className={`${
                    passwordValid &&
                    "border-0 outline outline-2 outline-green-400"
                  } ${
                    !passwordValid &&
                    passwordBlurred &&
                    "border-0 outline outline-2 outline-red-400"
                  } w-2/12 bg-white border-1 shadow-sm rounded-r-md
flex items-center justify-center transition duration-150 ease hover:bg-blue-100`}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                </button>
              </div>
              <button
                disabled={formValid && !signingUp ? false : true}
                className={`${
                  formValid
                    ? "text-black focus:outline focus:outline-blue-400 focus:outline-2 focus:bg-blue-200  hover:bg-blue-200 bg-white"
                    : "text-slate-400 bg-white"
                } disabled:opacity-50 rounded-md border-1 w-[250px] py-1 ml-auto mr-auto mt-5 mb-2`}
              >
                {signingUp ? "Criando conta..." : "Criar conta"}
              </button>
            </form>
            <p className="text-xs text-[#888] mx-auto">
              Já possui uma conta?{" "}
              <Link
                href="/signin"
                className="transition duration-150 ease hover:text-cyan-900 focus:text-cyan-900"
              >
                <u>Faça login.</u>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
