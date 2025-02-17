"use client";
import { useState } from "react";
import QuestionAnswer from "./QuestionAnswer";
import UserComments from "./UserComments";

export default function QuestionComments({
  question,
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
}) {
  const [activeItem, setActiveItem] = useState(-1);
  return (
    <div>
      <div
        className={`pt-2 ${
          activeItem != -1 ? "border-b-1" : "rounded-b-lg"
        } border-t-1 bg-slate-50 text-[14px]`}
      >
        <button
          onClick={() => {
            setActiveItem(0);
          }}
          className={`${
            activeItem === 0 &&
            "bg-blue-200 text-cyan-800 font-bold border-b-3 border-b-blue-500"
          } py-4 px-5 hover:border-b-3 hover:border-b-blue-500`}
        >
          Questão comentada
        </button>
        <button
          onClick={() => {
            setActiveItem(1);
          }}
          className={`${
            activeItem === 1 &&
            "bg-blue-200 text-cyan-800 font-bold border-b-3 border-b-blue-500"
          } py-4 px-5 hover:border-b-3 hover:border-b-blue-500`}
        >
          Comentários de alunos
        </button>
      </div>
      {activeItem != -1 && (
        <div className="py-4 px-8 bg-slate-50 rounded-b-lg flex flex-col">
          <button
            className="ml-auto mb-2"
            onClick={() => {
              setActiveItem(-1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <div>
            {activeItem === 0 && <QuestionAnswer answer={question.Resposta} />}
            {activeItem === 1 && <UserComments/>}
          </div>
        </div>
      )}
    </div>
  );
}
