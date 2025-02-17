"use client";

export default function QuestionBody({
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
  return (
    <div>
      {question.TextoMotivador && (
        <div className="px-10 pt-5 text-[17px] text-gray-900">
          <div
            dangerouslySetInnerHTML={{ __html: question.TextoMotivador }}
          ></div>
          <br />
          <hr className="bg-green-1000 w-1/2 border-1"></hr>
        </div>
      )}
      {<div
        dangerouslySetInnerHTML={{ __html: question.Questao }}
        className="p-5 text-[17px] text-gray-800"
      ></div>}
    </div>
  );
}
