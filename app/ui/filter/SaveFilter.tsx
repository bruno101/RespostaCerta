"use client"; // Required for client-side interactivity

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // shadcn Dialog components
import { Input } from "@/components/ui/input"; // shadcn Input
import { BookOpen, Check, Router } from "lucide-react"; // Icons from lucide-react
import CustomButton from "@/components/ui/custom-button";
import ISelector from "@/app/interfaces/ISelector";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { generateNotebook } from "@/app/actions/generateNotebook";

export default function SaveFilter({
  filtered,
  router,
}: {
  filtered: ISelector[];
  router: AppRouterInstance;
}) {
  const [cadernoName, setCadernoName] = useState(""); // State for the caderno name
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [saving, setSaving] = useState(false);

  const handleGenerateCaderno = async () => {
    // Logic to generate the caderno
    try {
      setSaving(true);
      const data = await generateNotebook(filtered, cadernoName);
      if ("id" in data) {
        toast.success("Caderno criado com sucesso", {
          description: "Redirecionando para caderno criado",
        });
        router.push(`cadernos/${data.id}`);
      } else {
        throw new Error("Erro criando caderno");
      }
    } catch (e) {
      toast.error("Erro criando caderno", {
        description: "Por favor tente novamente",
      });
      console.error(e);
    } finally {
      setSaving(false);
      setIsDialogOpen(false); // Close the dialog after generating
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <CustomButton
          bgColor="teal"
          className="ml-auto mr-5 mb-[70px] mt-1 px-4 py-2"
        >
          <BookOpen className="w-4 h-4 mr-2" /> {/* Icon */}
          Gerar Caderno
        </CustomButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-teal-600 flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> {/* Icon */}
            Gerar Caderno
          </DialogTitle>
          <DialogDescription>
            Escolha um nome para o seu novo caderno.
          </DialogDescription>
        </DialogHeader>

        {/* Input for caderno name */}
        <div className="mt-4">
          <Input
            value={cadernoName}
            onChange={(e) => setCadernoName(e.target.value)}
            placeholder="Nome do caderno"
            className="w-full"
          />
        </div>

        {/* Dialog footer with action buttons */}
        <DialogFooter className="mt-4">
          <button
            onClick={() => setIsDialogOpen(false)} // Close the dialog
            className="border-1 border-teal-500 text-teal-800 px-4 py-2 text-sm hover:bg-teal-100 rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            disabled={saving || !cadernoName}
            onClick={handleGenerateCaderno} // Generate the caderno
            className="disabled:opacity-50 px-4 py-2 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> {/* Icon */}
            {saving ? "Salvando..." : "Confirmar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
