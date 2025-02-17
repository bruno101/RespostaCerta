import { Dispatch, SetStateAction } from "react";

export default function Search({
  keyWords,
  setKeyWords
}: {
  keyWords: string;
  setKeyWords: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="min-w-[200px] ml-3 mr-10 mt-6">
      <div className="relative flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute w-5 h-7 top-2.5 left-2.5 text-slate-600"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clipRule="evenodd"
          />
        </svg>

        <input
          className="h-12 w-full bg-transparent placeholder:text-gray-500 text-gray-600 text-sm border border-[2px] rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-400 shadow-sm focus:shadow"
          placeholder="Faça uma busca por palavra chave"
          value={keyWords}
          onChange={(e)=>{setKeyWords(e.target.value)}}
        />
      </div>
    </div>
  );
}
