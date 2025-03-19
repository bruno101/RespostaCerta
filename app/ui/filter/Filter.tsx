import { SharedSelection } from "@heroui/system";
import Selector from "./Selector";
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Search from "./Search";
import ISelector from "@/app/interfaces/ISelector";
import CustomButton from "@/components/ui/custom-button";
import {
  ArrowLeft,
  ArrowLeftCircle,
  SearchCheck,
  SearchIcon,
} from "lucide-react";

export default function Filter({
  onSelectionChange,
  selected,
  onFilter,
  empty,
  keyWords,
  setKeyWords,
  solved,
  setSolved,
  selectors,
}: {
  onSelectionChange: (name: string, key: string[]) => void;
  selected: { options: string[]; name: string }[];
  onFilter: MouseEventHandler<HTMLButtonElement>;
  empty: MouseEventHandler<HTMLButtonElement>;
  keyWords: string;
  setKeyWords: Dispatch<SetStateAction<string>>;
  solved: "" | "y" | "n";
  setSolved: Dispatch<SetStateAction<"" | "y" | "n">>;
  selectors: ISelector[];
}) {
  return (
    <div className="w-full">
      <div className="flex-col md:flex-row ml-3 space-y-3 md:space-y-0 mt-5">
        {
          //tbd
        }
        <button
          onClick={() => setSolved("")}
          disabled={solved === ""}
          className={`rounded-2xl py-1 px-3 mr-3 text-[15px] border-1 border-gray ${
            solved !== ""
              ? "text-slate-700 hover:bg-teal-500 hover:text-white"
              : "text-white bg-teal-500"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setSolved("n")}
          disabled={solved === "n"}
          className={`rounded-2xl py-1 px-3 mr-3 text-[15px] border-1 border-gray ${
            solved !== "n"
              ? "text-slate-700 hover:bg-teal-500 hover:text-white"
              : "text-white bg-teal-500"
          }`}
        >
          Não Resolvidas
        </button>
        <button
          onClick={() => setSolved("y")}
          disabled={solved === "y"}
          className={`rounded-2xl py-1 px-3 text-[15px] border-1 border-gray ${
            solved !== "y"
              ? "text-slate-700 hover:bg-teal-500 hover:text-white"
              : "text-white bg-teal-500"
          }`}
        >
          Resolvidas
        </button>
      </div>
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
        <div className="p-1 ml-auto">
          <button
            onClick={empty}
            className="items-center ml-auto mr-1 text-[14px] font-bold px-3 py-2 rounded-md hover:bg-gray-100 flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            Limpar
          </button>
        </div>
        <div className="p-1">
          <CustomButton onClick={onFilter} bgColor="cyan" className="mr-7">
            <SearchIcon className="w-4 h-4 mr-2" />
            Buscar questões
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
