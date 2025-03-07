import { SharedSelection } from "@heroui/system";
import Selector from "./Selector";
import { Dispatch, MouseEventHandler, SetStateAction, useEffect } from "react";
import Search from "./Search";
import ISelector from "@/app/interfaces/ISelector";

export default function Filter({
  onSelectionChange,
  selected,
  onFilter,
  empty,
  keyWords,
  setKeyWords,
  selectors,
}: {
  onSelectionChange: (name: string, key: string[]) => void;
  selected: { options: string[]; name: string }[];
  onFilter: MouseEventHandler<HTMLButtonElement>;
  empty: MouseEventHandler<HTMLButtonElement>;
  keyWords: string;
  setKeyWords: Dispatch<SetStateAction<string>>;
  selectors: ISelector[];
}) {
  return (
    <div className="w-full">
      <Search keyWords={keyWords} setKeyWords={setKeyWords} />
      <p className="ml-5 mt-3 mb-3 text-[15px] font-bold">Filtrar por</p>
      <div className="ml-3 mr-3 flex flex-wrap gap-3">
        {selectors.map((selector, index) => {
          return (
            <Selector
              name={selector.name}
              key={index}
              options={[...selector.options]}
              onSelectionChange={onSelectionChange}
              selected={[...selected[index].options]}
            />
          );
        })}
      </div>
      <hr className="m-6" />
      <div className="flex flex-row mb-5">
        <button
          onClick={empty}
          className="ml-auto mr-1 text-sm font-bold px-4 mt-1 pt-2 rounded-lg hover:bg-gray-100 flex flex-row"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 mr-1 mt-[0.5]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>

          <p>Limpar</p>
        </button>
        <div className="p-1">
          <button
            onClick={onFilter}
            className="mr-7 text-sm text-white bg-cyan-700 font-bold px-4 py-2 rounded-lg hover:bg-cyan-600 focus:outline focus:outline-5 focus:outline-cyan-200 focus:outline-offset-2"
          >
            Buscar questões
          </button>
        </div>
      </div>
    </div>
  );
}
