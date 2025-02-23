"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import QuestionBody from "./QuestionBody";
import QuestionComments from "./QuestionComments";
import IQuestion from "@/app/interfaces/IQuestion";

export default function QuestionList({
  question,
  index,
}: {
  question: IQuestion;
  index: number;
}) {
  const [minimized, setMinimized] = useState(false);
  return (
    <div className="border-1 ml-5 mr-5 mb-4 rounded-lg">
      <div className={`${!minimized && "border-b-1"} p-3 flex`}>
        <div className="flex flex-wrap ml-5 w-[85%] ">
          <div className="flex flex-row min-h-8">
            <div className="flex flex-col bg-gray-50 border-1 px-2 py-1 rounded-l-md font-bold text-sm h-full">
              <p className="mt-auto mb-auto">{(index + 1).toString()}</p>
            </div>
            <div className="max-w-20 flex flex-row break-all flex-wrap bg-gray-50 border-r-1 border-y-1 px-2 py-1 rounded-r-md text-gray-700 min-h-6 text-[11px]">
              <p className="mt-auto mb-auto">{question.Codigo}</p>
            </div>
          </div>
          <div className="ml-3 mt-4 font-bold text-md">{question.Banca}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-3 mt-6 ml-2"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="mt-[23px] ml-2 text-xs">{question.Instituicao}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-3 mt-6 ml-2"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
          <div className="mt-[23px] ml-2 text-xs">{question.Cargo}</div>
        </div>
        <button
          onClick={() => setMinimized((x) => !x)}
          className="mt-4 mr-6 w-8 pl-[4px] h-8 rounded-lg ml-auto hover:bg-slate-100 focus:bg-slate-200 focus:outline focus:outline-3 focus:outline-blue-200"
        >
          <Image
            src={`https://img.icons8.com/material-outlined/24/${
              minimized ? "maximize" : "minimize"
            }-window.png`}
            alt={minimized ? "maximize-window" : "minimize-window"}
            width="24"
            height="24"
            className="h-6 w-6"
          />
        </button>
      </div>
      {!minimized && (
        <>
          <QuestionBody question={question} />
          <button className="ml-7 mb-10 text-sm text-white bg-cyan-700 font-bold px-4 py-2 rounded-lg hover:bg-cyan-600 focus:outline focus:outline-5 focus:outline-cyan-200 focus:outline-offset-2">
            <Link href={`/questoes/${question.Codigo}`} prefetch={false}>
              Ver questão
            </Link>
          </button>
        </>
      )}
    </div>
  );
}
