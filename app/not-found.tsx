import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-t-4 border-t-cyan-500 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-600">
            <FileQuestion className="h-6 w-6" />
            <CardTitle className="text-xl font-bold">
              Página não encontrada
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="text-9xl font-bold text-cyan-200">404</div>
          </div>

          <p className="text-gray-700 text-center">
            A página que você está procurando não existe ou foi movida.
          </p>

          <div className="rounded-md bg-cyan-50 p-4 border border-cyan-100">
            <p className="text-sm text-cyan-800">
              Verifique se a URL está correto ou use o link abaixo para acessar
              a página inicial.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Link href="/">
            <button className="flex text-white px-3 py-2 rounded-lg font-bold text-[15px] gap-2 mt-3 bg-cyan-700 hover:bg-[#0891b2] focus:bg-[#0891b2] focus:outline focus:outline-cyan-300 focus:outline-offset-1">
              <Home className="h-4 w-4 mt-1" />
              Página inicial
            </button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
