import AppliedFilter from "./AppliedFilter";

export default function AppliedFilters({
  selected,
  solved,
  onRemoveSelection,
}: {
  onRemoveSelection: Function;
  selected: { options: string[]; name: string }[];
  solved: "y" | "n" | "";
}) {
  return (
    <div className="bg-gray-100 rounded-r-md h-full flex flex-col min-h-[700px] h-full">
      <p className="text-[15px] font-bold text-gray-800 mt-6 mb-3 ml-8 mr-auto">
        Filtros aplicados
      </p>
      {selected.map((filter, index: any) => {
        if (filter.options.length > 0) {
          return (
            <AppliedFilter
              key={index}
              name={filter.name}
              options={filter.options}
              onRemoveSelection={onRemoveSelection}
            />
          );
        }
      })}
      <AppliedFilter
        name={"Resolvidas"}
        onRemoveSelection={onRemoveSelection}
        solved={solved}
      />
    </div>
  );
}
