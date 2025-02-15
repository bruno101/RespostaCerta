export default function AppliedFilter({
    name,
    options,
    onRemoveSelection
  }: {
    name: string;
    options: string[];
    onRemoveSelection: Function;
  }) {
    return (<div className="bg-white h-400 rounded-md flex flex-col p-5 mx-7 my-2 border-2">
        <p className="text-gray-600 text-sm font-bold mb-2">{name}</p>

        {
        options.map((option, index)=><div key={index} className="text-xs border-1 text-gray-600 bg-gray-100 px-2 py-1 mb-1 mt-1 mr-auto rounded-md flex flex-row">
            {option}
            <button onClick={()=>onRemoveSelection(name,option)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ml-2">
  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
            </button>

            </div>)}
    </div>);
}