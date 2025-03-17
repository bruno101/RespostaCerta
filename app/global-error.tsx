"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-t-4 border-t-red-500 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <CardTitle className="text-xl font-bold">Ocorreu um erro</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Desculpe, encontramos um problema ao processar sua solicitação.
          </p>

          <div className="rounded-md bg-red-50 p-4 border border-red-100">
            <p className="text-sm text-red-800">
              {error.message ||
                "Ocorreu um erro inesperado. Por favor, tente novamente."}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Código de referência: {error.digest}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500">
            Se o problema persistir, entre em contato com o suporte técnico.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <CustomButton
            onClick={reset}
            bgColor="cyan"
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Tentar novamente
          </CustomButton>
          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Voltar para a página inicial
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
