import { Suspense } from "react";
import FullQuestion from "./_components/FullQuestion";
import Question from "@/app/models/Question";
import { connectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  let question: {
    Disciplina: string;
    Banca: string;
    Ano: string;
    Nivel: string;
    Questao: string;
    Resposta: string;
    Criterios: string;
    TextoMotivador?: string;
    Codigo: string;
    Instituicao: string;
    Cargo: string;
  } = {
    Disciplina: "",
    Banca: "",
    Ano: "",
    Nivel: "",
    Questao: "",
    Resposta: "",
    Criterios: "",
    Codigo: "",
    Instituicao: "",
    Cargo: "",
  };
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all questions from the database
    const q = await Question.findById(new mongoose.Types.ObjectId(codigo));

    if (q) {
      question = {
        Codigo: q._id.toString(), // 👈 Convert ObjectId to string
        Disciplina: q.Disciplina,
        Banca: q.Banca,
        Ano: q.Ano,
        Nivel: q.Nivel,
        Instituicao: q.Instituicao,
        Cargo: q.Cargo,
        TextoMotivador: q.TextoMotivador,
        Questao: q.Questao,
        Criterios: q.Criterios,
        Resposta: q.Resposta,
      };
    } else {
      console.log("Not found");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }

  return (
    <div className="">
      <Suspense
        fallback={
            <div className="w-[90%] flex mt-[100px] ml-auto mr-auto mb-3 flex w-full">
            <Skeleton className=" h-20 w-20 rounded-full mr-5" />
            <div className="space-y-2 w-full ">
              <Skeleton className="h-7 mt-3 min-w-[250px] mr-10" />
              <Skeleton className="h-7 min-w-[200px] mr-10" />
            </div>
            
          </div>
        }
      >

        <FullQuestion question={question} />
      </Suspense>
    </div>
  );
}
