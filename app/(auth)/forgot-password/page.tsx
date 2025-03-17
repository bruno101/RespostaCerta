"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await axios.post("/api/auth/forgot-password", { email });
      setSuccess(true);
    } catch (error: any) {
      setError(error.response?.data?.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
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
              Recuperar Senha
            </p>
            <p className="font-bold text-[12px] mb-4 text-gray-400 ml-auto mr-auto">
              Enviaremos um link para redefinir sua senha
            </p>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-b-lg pb-[20px] px-10 sm:px-20">
            {success ? (
              <div className="py-6 text-center">
                <p className="text-green-600 mb-4">
                  Email enviado! Verifique sua caixa de entrada para o link de redefinição de senha.
                </p>
                <Link
                  href="/signin"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Voltar para o login
                </Link>
              </div>
            ) : (
              <form className="flex flex-col" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    {error}
                  </div>
                )}
                <label className="text-xs font-bold mt-5 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@dominio.com"
                  className="shadow-sm px-2 border-1 rounded-md w-[250px] py-1 ml-auto mr-auto"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md border-1 focus:outline focus:outline-blue-400 focus:outline-2 focus:bg-blue-200 hover:bg-blue-200 bg-white w-[250px] py-1 text-black ml-auto mr-auto mt-5 mb-2"
                >
                  {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                </button>
                <p className="text-xs text-[#888] mx-auto mt-2">
                  <Link
                    href="/signin"
                    className="transition duration-150 ease hover:text-cyan-900 focus:text-cyan-900"
                  >
                    <u>Voltar para o login</u>
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}