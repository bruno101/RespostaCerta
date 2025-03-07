"use client";

import "../../globals.css"
import * as React from "react";
import { X, Check, ChevronsUpDown, ChevronDown } from "lucide-react";
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

interface SelectorProps {
  name: string;
  options: string[];
  selected: string[];
  onSelectionChange: (name: string, selected: string[]) => void;
}

export default function Selector({
  name,
  options,
  selected,
  onSelectionChange,
}: SelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleSelect = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];

    onSelectionChange(name, newSelected);
  };

  const handleRemove = (option: string) => {
    const newSelected = selected.filter((item) => item !== option);
    onSelectionChange(name, newSelected);
  };

  const handleClear = () => {
    onSelectionChange(name, []);
  };

  // Filter options based on search input
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="w-full relative z-10 sm:w-[32%] md:w-[23%]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px] h-auto"
          >
            <div className="flex flex-wrap gap-1 w-full items-center">
              <span className="text-muted-foreground">{name}</span>

              {selected.length > 0 && (
                <div className="px-[11px] py-[2px] ml-auto mr-[2px] text-white text-xs bg-teal-500 rounded-xl">
                  {selected.length}
                </div>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-[0px]" align="start">
          <Command>
            <CommandInput
              placeholder={`Buscar ${name.toLowerCase()}`}
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList className="p-[2px]">
              <CommandEmpty>No {name.toLowerCase()} found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto custom-scrollbar">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex min-h-4 min-w-4 items-center justify-center rounded-md border border-gray-300",
                          selected.includes(option)
                            ? "bg-teal-600 text-primary-foreground"
                            : "opacity-50"
                        )}
                      >
                        {selected.includes(option) && (
                          <Check className="max-h-3 max-w-3" />
                        )}
                      </div>
                      <span className="whitespace-normal break-words text-sm text-gray-700 leading-tight">
                        {option}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
