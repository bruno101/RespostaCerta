import IQuestion from "@/app/interfaces/IQuestion";
import ISelector from "@/app/interfaces/ISelector";
import { Check, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function Selector({
  filter,
  customOptions,
  noSpecialCharacterName,
  openAddOptionModal,
  handleSelectChange,
  question,
}: {
  filter: ISelector;
  customOptions: Record<string, string[]>;
  noSpecialCharacterName: string;
  openAddOptionModal: (fieldName: keyof IQuestion, displayName: string) => void;
  handleSelectChange: (name: keyof IQuestion, value: string | string[]) => void;
  question: IQuestion;
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Combine predefined options with custom options
  const allOptions = [
    ...filter.options,
    ...(customOptions[noSpecialCharacterName] || []),
  ];

  const isMultiSelect = ["Cargo", "Modalidade"].includes(
    noSpecialCharacterName
  );
  let selectedValues: string[];
  if (isMultiSelect) {
    let originalName = noSpecialCharacterName;
    if (originalName === "Cargo") {
      originalName = "Cargos";
    } else if (originalName === "Modalidade") {
      originalName = "Modalidades";
    }
    selectedValues =
      (question[originalName as keyof IQuestion] as string[]) || [];
  } else {
    const value = question[noSpecialCharacterName as keyof IQuestion];
    selectedValues = value ? [String(value)] : [];
  }

  const handleSelect = (option: string) => {
    if (isMultiSelect) {
      const newSelected = selectedValues.includes(option)
        ? selectedValues.filter((item) => item !== option)
        : [...selectedValues, option];
      handleSelectChange(
        noSpecialCharacterName as keyof IQuestion,
        newSelected
      );
    } else {
      handleSelectChange(noSpecialCharacterName as keyof IQuestion, option);
      setOpen(false);
    }
  };

  // Filter options based on search input
  const filteredOptions = allOptions.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="w-full relative z-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px] h-auto"
          >
            <div className="flex flex-wrap gap-1 w-full items-center">
              {isMultiSelect ? (
                <>
                  <span className="text-muted-foreground">{filter.name}</span>
                  {selectedValues.length > 0 && (
                    <div className="px-[11px] py-[2px] ml-auto mr-[2px] text-white text-xs bg-teal-500 rounded-xl">
                      {selectedValues.length}
                    </div>
                  )}
                </>
              ) : selectedValues.length > 0 ? (
                <span className="text-gray-700">{selectedValues[0]}</span>
              ) : (
                <span className="text-muted-foreground">
                  {`Selecione ${
                    ["Cargo", "Ano", "Nível"].includes(filter.name) ? "o" : "a"
                  } ${filter.name.toLowerCase()}`}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-[0px]" align="start">
          <Command>
            <CommandInput
              placeholder={`Buscar ${filter.name.toLowerCase()}`}
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList className="p-[2px]">
              <CommandEmpty>
                Nenhum {filter.name.toLowerCase()} encontrado.
              </CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto custom-scrollbar">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      {isMultiSelect && (
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedValues.includes(option)
                              ? "bg-teal-600 text-primary-foreground"
                              : "opacity-50 [&_>svg]:invisible"
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <span className="whitespace-normal break-words text-sm text-gray-700 leading-tight">
                        {option}
                      </span>
                    </div>
                  </CommandItem>
                ))}
                {!["Dificuldade", "Nível"].includes(filter.name) && (
                  <CommandItem
                    value={`adicionar_${noSpecialCharacterName}`}
                    onSelect={() => {
                      openAddOptionModal(
                        noSpecialCharacterName as keyof IQuestion,
                        filter.name
                      );
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2 border-t border-gray-200"
                  >
                    <div className="flex items-center gap-2 text-cyan-700">
                      <Plus className="h-4 w-4" />
                      <span className="whitespace-normal break-words text-sm leading-tight">
                        Adicionar {filter.name}...
                      </span>
                    </div>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
