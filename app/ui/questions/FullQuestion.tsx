"use client";
import IQuestion from "@/app/interfaces/IQuestion";
import Question from "@/app/models/Question";
import QuestionBody from "@/app/ui/questions/QuestionBody";
import QuestionComments from "@/app/ui/questions/QuestionComments";
import { Skeleton } from "@/components/ui/skeleton";
import mongoose from "mongoose";
import { useEffect, useState } from "react";

export default function FullQuestion({ codigo }: { codigo: string }) {
  const [question, setQuestion] = useState<IQuestion>({
    Disciplina: "",
    Banca: "",
    Ano: "",
    Nivel: "Superior",
    Questao: "",
    Resposta: "",
    Criterios: "",
    Codigo: "",
    Instituicao: "",
    Cargos: [""],
    Dificuldade: 6,
    TextoPlano: "",
    NotaMaxima: 10,
    Modalidades: [],
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/questions/${codigo}`);
        if (!res.ok) throw new Error("Failed to fetch question");

        const data = await res.json();
        setQuestion(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [codigo]);

  if (loading) {
    return (
      <div className="w-[90%] flex mt-[100px] ml-auto mr-auto mb-[100px] flex w-full">
        <Skeleton className=" h-20 w-20 rounded-full ml-5 mr-5" />
        <div className="space-y-2 w-full ">
          <Skeleton className="h-7 mt-3 min-w-[250px] mr-10" />
          <Skeleton className="h-7 min-w-[200px] mr-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className={`border-b-1 px-3 py-3 flex flex-row`}>
        <div className="flex flex-wrap ml-5 w-[85%] ">
          <div className="bg-gray-50 border-1 px-2 py-1 rounded-md text-gray-700 h-8 text-sm">
            {question.Codigo}
          </div>
          <div className="ml-3 mt-1 font-bold text-md">{question.Banca}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-3 mt-3 ml-2"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="mt-[10px] ml-2 text-xs">{question.Instituicao}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-3 mt-3 ml-2"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
          <div className="mt-[10px] ml-2 text-xs">{question.Cargos[0]}</div>
        </div>
      </div>

      <QuestionBody question={question} />

      <QuestionComments question={question} />
    </div>
  );
}
