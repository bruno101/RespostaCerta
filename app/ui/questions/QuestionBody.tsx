"use client";

import IQuestion from "@/app/interfaces/IQuestion";

export default function QuestionBody({ question }: { question: IQuestion }) {
  return (
    <div>
      {question.TextoMotivador && (
        <div className="rich-text-editor px-10 pt-5 text-[15px] sm:text-[17px] text-gray-900">
          <div
            dangerouslySetInnerHTML={{ __html: question.TextoMotivador }}
          ></div>
          <br />
          <hr className="bg-green-1000 w-1/2 border-1"></hr>
        </div>
      )}
      {
        <div
          dangerouslySetInnerHTML={{ __html: question.Questao }}
          className="rich-text-editor p-5 text-[15px] sm:text-[17px] text-gray-800"
        ></div>
      }
    </div>
  );
}
