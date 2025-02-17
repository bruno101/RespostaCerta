"use client";
import { useEffect, useState } from "react";
import Filter from "./ui/filter/Filter";
import AppliedFilters from "./ui/filter/AppliedFilters";
import QuestionList from "./ui/questions/QuestionList";
import { SharedSelection } from "@heroui/system";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const initialSelected: { options: string[]; name: string }[] = [
  {
    name: "Disciplina",
    options: [],
  },
  { name: "Banca", options: [] },
  { name: "Ano", options: [] },
  { name: "Nível", options: [] },
];
const selectors = [
  {
    name: "Disciplina",
    options: [
      "Programação",
      "Banco de Dados",
      "Engenharia de Software",
      "Segurança da Informação",
    ],
  },
  { name: "Banca", options: ["Cebraspe", "Cesgranrio", "FGV"] },
  { name: "Ano", options: ["2025", "2024", "2023", "2022", "2021"] },
  { name: "Nível", options: ["Fundamental", "Médio", "Superior"] },
];

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selected, setSelected] = useState(initialSelected);
  const [keyWords, setKeyWords] = useState("");
  const [filtered, setFiltered] = useState([
    ...initialSelected,
    { name: "Palavras Chave", options: [] },
  ]);

  const capitalize = (option: string, name: string): string => {
    const possibleOptions = selectors.filter((item) => item.name === name)[0]
      .options;
    return possibleOptions.filter(
      (possibleOption) => possibleOption.toLowerCase() === option
    )[0];
  };

  useEffect(() => {
    const keyW = searchParams.get("palavras");
    if (keyW) {
      setKeyWords(keyW);
    }

    const newSelected = [...selected];

    for (const item of newSelected) {
      const value = searchParams.get(item.name.toLowerCase());
      if (value) {
        const valueArr = value.split(",");
        for (const option of valueArr) {
          const newOption = capitalize(option, item.name);
          if (!(newOption in item.options)) {
            item.options.push(newOption);
          }
        }
      }
    }

    setSelected(newSelected);
    setFiltered([
      ...newSelected,
      { name: "Palavras Chave", options: [keyW ? keyW : ""] },
    ]);
  }, [searchParams]);

  const onSelectionChange = (name: string, keys: SharedSelection) => {
    const nextSelected: { options: any[]; name: string }[] = selected.map(
      (selection) => {
        if (selection.name !== name) {
          return selection;
        } else {
          return { ...selection, options: [...keys] };
        }
      }
    );
    setSelected(nextSelected);
  };

  const onRemoveSelection = (name: string, option: string) => {
    if (name === "Palavras Chave") {
      setKeyWords("");
    } else {
      const nextSelected = selected.map((selection) => {
        if (selection.name !== name) {
          return selection;
        } else {
          return {
            ...selection,
            options: selection.options.filter(function (item) {
              return item != option;
            }),
          };
        }
      });
      setSelected(nextSelected);
    }
  };
  const onFilter = () => {
    //setFiltered([...selected, { name: "Palavras Chave", options: [keyWords] }]);
    let newKeyWordParams = `?palavra=${keyWords}`;
    for (const item of selected) {
      newKeyWordParams += `?${item.name}=${item.options.join(",")}`;
    }
    router.replace(newKeyWordParams);
  };
  const empty = () => {
    setSelected(initialSelected);
  };
  return (
    <div className="w-full">
      <div className="hidden lg:w-full lg:flex lg:flex-row">
        <div className="w-[75%]">
          <Filter
            onSelectionChange={onSelectionChange}
            selected={selected}
            keyWords={keyWords}
            setKeyWords={setKeyWords}
            onFilter={onFilter}
            empty={empty}
            selectors={selectors}
          />
          {filtered[0].options.length > 0 && <QuestionList />}
        </div>
        <div className="w-[25%]">
          <AppliedFilters
            selected={
              keyWords === ""
                ? selected
                : [{ name: "Palavras Chave", options: [keyWords] }, ...selected]
            }
            onRemoveSelection={onRemoveSelection}
          />
        </div>
      </div>
      <div className="flex flex-col w-full lg:hidden">
        <Filter
          onSelectionChange={onSelectionChange}
          selected={selected}
          keyWords={keyWords}
          setKeyWords={setKeyWords}
          onFilter={onFilter}
          empty={empty}
          selectors={selectors}
        />
        {filtered[0].options.length > 0 && <QuestionList />}
      </div>
    </div>
  );
}
