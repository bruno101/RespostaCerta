"use client"
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import LoadingSkeletons from "@/app/ui/questions/LoadingSkeletons";

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<LoadingSkeletons />}>
      <VerifyAccount />
    </Suspense>
  );
}

function VerifyAccount() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    async function verify() {
      try {
        await axios.post("/api/auth/verify-user", {
          token,
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
      }
    }
    if (!token) {
      setError("Token de redefinição inválido ou expirado");
    } else {
      verify();
    }
  }, [token]);

  if (error) {
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
                Erro na Confirmação
              </p>
            </div>
            <div className="flex flex-col bg-slate-50 rounded-b-lg pb-[20px] px-10 sm:px-20">
              <div className="py-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Link
                  href="/signup"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Criar conta
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
        <div className="flex max-w-[500px] flex-col ml-auto mr-auto mt-auto mb-auto shadow-xl border-[1px] rounded-lg">
          <div className="flex flex-col border-b-1 rounded-t-lg bg-white">
            <Image
              className="mx-auto mt-[30px] mb-5"
              alt="logo"
              src="/logo.png"
              width={50}
              height={50}
            />
            <p className="font-bold text-[17px] mb-6 ml-auto mr-auto">
              Ativação de Conta
            </p>
          </div>
          <div className="flex flex-col bg-slate-50 rounded-b-lg pb-[20px] px-10 sm:px-20">
            {success ? (
              <div className="py-6 text-center">
                <p className="text-green-600">
                  Conta ativada com sucesso! Redirecionando para o login...
                </p>
              </div>
            ) : (
                <div className="py-6 text-center">
                <p className="text-cyan-600">
                  Aguarde enquanto ativamos sua conta...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
