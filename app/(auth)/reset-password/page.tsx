"use client";

import { FormEvent, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenError("Token de redefinição inválido ou expirado");
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Ocorreu um erro. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError) {
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
                Erro na Redefinição
              </p>
            </div>
            <div className="flex flex-col bg-slate-50 rounded-b-lg pb-[20px] px-10 sm:px-20">
              <div className="py-6 text-center">
                <p className="text-red-600 mb-4">{tokenError}</p>
                <Link
                  href="/forgot-password"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Solicitar novo link de redefinição
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Redefinir Senha
            </p>
            <p className="font-bold text-[12px] mb-4 text-gray-400 ml-auto mr-auto">
              Crie uma nova senha para sua conta
            </p>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-b-lg pb-[20px] px-10 sm:px-20">
            {success ? (
              <div className="py-6 text-center">
                <p className="text-green-600 mb-4">
                  Senha redefinida com sucesso! Redirecionando para o login...
                </p>
              </div>
            ) : (
              <form className="flex flex-col" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    {error}
                  </div>
                )}

                <label className="text-xs font-bold mt-3 mb-1">
                  Nova Senha
                </label>
                <div className="flex w-full ml-auto mr-auto">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6+ caracteres"
                    className="w-full shadow-sm px-2 border-1 rounded-l-md w-[250px] py-1"
                    required
                  />
                  <button
                    className="w-2/12 bg-white border-1 shadow-sm rounded-r-md flex items-center justify-center transition duration-150 ease hover:bg-blue-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                  </button>
                </div>

                <label className="text-xs font-bold mt-3 mb-1">
                  Confirmar Senha
                </label>
                <div className="flex w-full ml-auto mr-auto">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="w-full shadow-sm px-2 border-1 rounded-l-md w-[250px] py-1"
                    required
                  />
                  <button
                    className="w-2/12 bg-white border-1 shadow-sm rounded-r-md flex items-center justify-center transition duration-150 ease hover:bg-blue-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                  >
                    {showConfirmPassword ? <BiSolidHide /> : <BiSolidShow />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md border-1 focus:outline focus:outline-blue-400 focus:outline-2 focus:bg-blue-200 hover:bg-blue-200 bg-white w-[250px] py-1 text-black ml-auto mr-auto mt-5 mb-2"
                >
                  {isSubmitting ? "Processando..." : "Redefinir Senha"}
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
