"use client";
import { Select, SelectItem } from "@heroui/select";
import { SharedSelection } from "@heroui/system";
import { useEffect } from "react";

export default function Selector({
  name,
  options,
  selected,
  onSelectionChange,
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
        className="max-w-xs"
        label={name}
        selectedKeys={selected}
        size="sm"
        selectionMode="multiple"
        variant="bordered"
        onSelectionChange={(key) => onSelectionChange(name, key)}
      >
        {options.map((option) => (
          <SelectItem key={option}>{option}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
