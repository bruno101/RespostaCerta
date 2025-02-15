import { SharedSelection } from "@heroui/system";
import Selector from "./Selector";
import { MouseEventHandler } from "react";

export default function Filter({onSelectionChange, selected, onFilter, empty}:{
  onSelectionChange: (name: string, key: SharedSelection) => void;
  selected: {options: string[]; name: string}[];
  onFilter: MouseEventHandler<HTMLButtonElement>;
  empty: MouseEventHandler<HTMLButtonElement>;
}) {
  const selectors = [
    {
      name: "Disciplina",
      options: ["Programação", "Banco de Dados", "Engenharia de Software", "Segurança da Informação"],
    },
    { name: "Banca", options: ["Cebraspe", "Cesgranrio", "FGV"] },
    { name: "Ano", options: ["2025","2024","2023","2022","2021"] },
    { name: "Nível", options: ["Fundamental", "Médio", "Superior"] },
  ];

  return (
    <div className="w-full">
      <p className="ml-5 mt-3 mb-3 font-bold">Filtrar por</p>
      <div className="ml-3 mr-3 flex flex-wrap gap-3">
        {selectors.map((selector, index) => (
          <Selector
            name={selector.name}
            key={index}
            options={selector.options}
            onSelectionChange={onSelectionChange}
            selected={selected[index].options}
          />
        ))}
      </div>
      <hr className="m-6"/>
      <div className="flex flex-row mb-5">
        <button onClick={empty} className="ml-auto mr-1 text-sm font-bold px-4 mt-1 pt-2 rounded-lg hover:bg-gray-100 flex flex-row">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1 mt-[0.5]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>

          <p>Limpar</p>
          </button>
          <div className="p-1">
          <button onClick={onFilter} className="mr-7 text-sm text-white bg-cyan-700 font-bold px-4 py-2 rounded-lg hover:bg-cyan-600 focus:outline focus:outline-5 focus:outline-cyan-200 focus:outline-offset-2">Buscar questões</button>

          </div>
      </div>
    </div>
  );
}
