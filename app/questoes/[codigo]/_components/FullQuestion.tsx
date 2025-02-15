import QuestionBody from "@/app/ui/questionList/QuestionBody";

export default function FullQuestion({
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
    <div className="flex flex-col">
      <div className={`border-b-1 p-3 flex flex-row`}>
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
          <div className="mt-[10px] ml-2 text-xs">{question.Cargo}</div>
        </div>
      </div>

      <QuestionBody question={question} />
    </div>
  );
}
