"use client";
import { Select, SelectItem } from "@heroui/select";
import { SharedSelection } from "@heroui/system";

export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
  { key: "whale", label: "Whale" },
  { key: "otter", label: "Otter" },
  { key: "crocodile", label: "Crocodile" },
];
export default function Selector({
  name,
  options,
  selected,
  onSelectionChange
}: {
  name: string;
  options: string[];
  selected: string[];
  onSelectionChange: (name: string, key: SharedSelection) => void;
}) {
  return (
    <div className="w-full relative z-10 sm:w-[32%] md:w-[23%]">
      <Select
        fullWidth={true}
        className="max-w-xs sel"
        label={name}
        selectedKeys={selected}
        size="sm"
        selectionMode="multiple"
        variant="bordered"
        onSelectionChange={
          (key)=>onSelectionChange(name,key)}
      >
        {options.map((option) => (
          <SelectItem key={option}>{option}</SelectItem>
        ))}
      </Select>
      </div>
  );
}
