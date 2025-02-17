"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import QuestionBody from "./QuestionBody";
import QuestionComments from "./QuestionComments";

export default function QuestionList({
  question,
  index,
}: {
  question: {
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
  };
  index: number;
}) {
  const [minimized, setMinimized] = useState(false);
  return (
    <div className="border-1 ml-5 mr-5 mb-4 rounded-lg">
      <div className={`${!minimized && "border-b-1"} p-3 flex`}>
        <div className="flex flex-wrap ml-5 w-[85%] ">
          <div className="bg-gray-50 border-1 px-2 py-1 rounded-l-md font-bold text-sm h-8">
            {(index + 1).toString()}
          </div>
          <div className="bg-gray-50 border-r-1 border-y-1 px-2 py-1 rounded-r-md text-gray-700 h-8 text-sm">
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
          <div className="mt-[10px] ml-2 text-xs">{question.Cargo}</div>
        </div>
        {!minimized ? (
          <button
            onClick={() => setMinimized(true)}
            className="mr-6 w-12 ml-auto hover:outline-[20px] hover:outline-offset-2 hover:outline-gray-800"
          >
            <Image
              src="https://img.icons8.com/material-outlined/24/minimize-window.png"
              alt="minimize-window"
              width="24"
              height="24"
              className="h-6 w-6 mt-1"
            />
          </button>
        ) : (
          <button
            onClick={() => setMinimized(false)}
            className="mr-6 w-12 ml-auto hover:outline-[20px] hover:outline-offset-2 hover:outline-gray-800"
          >
            <Image
              src="https://img.icons8.com/material-outlined/24/maximize-window.png"
              alt="minimize-window"
              width="24"
              height="24"
              className="h-6 w-6 mt-1"
            />
          </button>
        )}
      </div>
      {!minimized && (
        <>
          <QuestionBody question={question} />
          {/*<button className="ml-7 mb-10 text-sm text-white bg-cyan-700 font-bold px-4 py-2 rounded-lg hover:bg-cyan-600 focus:outline focus:outline-5 focus:outline-cyan-200 focus:outline-offset-2">
            <Link href={`/questoes/${question.Codigo}`}>Ver questão</Link>
          </button>*/}
          <QuestionComments question={question} />
        </>
      )}
    </div>
  );
}
