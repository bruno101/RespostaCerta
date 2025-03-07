import IQuestion from "@/app/interfaces/IQuestion";
import ISelector from "@/app/interfaces/ISelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Selector({
  filter,
  customOptions,
  noSpecialCharacterName,
  openAddOptionModal,
  handleSelectChange,
  question
}: {
  filter: ISelector;
  customOptions: Record<string, string[]>;
  noSpecialCharacterName: string;
  openAddOptionModal: (fieldName: keyof IQuestion, displayName: string) => void;
  handleSelectChange: (name: keyof IQuestion, value: string) => void;
  question: IQuestion;
}) {
  // Combine predefined options with custom options
  const allOptions = [
    ...filter.options,
    ...(customOptions[noSpecialCharacterName] || []),
  ];
  /*const [searchValue, setSearchValue] = useState("");

  const allFilteredOptions = allOptions.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );*/
  return (
    <Select
      value={question[noSpecialCharacterName as keyof IQuestion]}
      onValueChange={(value) => {
        if (value === `adicionar_${noSpecialCharacterName}`) {
          // Open modal to add new option
          openAddOptionModal(
            noSpecialCharacterName as keyof IQuestion,
            filter.name
          );
        } else {
          handleSelectChange(noSpecialCharacterName as keyof IQuestion, value);
        }
      }}
    >
      <SelectTrigger id={filter.name} className="w-full text-cyan-900">
        <SelectValue
          placeholder={`Selecione ${
            ["Cargo", "Ano", "Nível"].includes(filter.name) ? "o" : "a"
          } ${filter.name.toLowerCase()}`}
        />
      </SelectTrigger>
      <SelectContent>
        
          {/*<input
            placeholder={`Buscar ${filter.name.toLowerCase()}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-9"
            onKeyDown={(e) => e.stopPropagation()}
          ></input>*/}
        {allOptions.map((option, innerIndex) => (
          <SelectItem
            className="text-gray-700 focus:text-cyan-500 font-medium"
            value={option}
            key={innerIndex}
          >
            {option}
          </SelectItem>
        ))}
        {!["Dificuldade", "Nível"].includes(filter.name) && (
          <SelectItem
            value={`adicionar_${noSpecialCharacterName}`}
            className="text-cyan-700 focus:text-cyan-500 border-t-1 border-t-cyan-200 rounded-t-none font-medium cursor-pointer"
          >
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar {filter.name}...
            </div>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
