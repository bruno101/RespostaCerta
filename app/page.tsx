"use client"
import {useState} from "react"
import Filter from "./ui/filter/Filter";
import AppliedFilters from "./ui/filter/AppliedFilters";
import QuestionList from "./ui/questionList/QuestionList";
import { SharedSelection } from "@heroui/system";

const initialSelected:{options: string[]; name: string}[]=[{
  name: "Disciplina",
  options: [],
},
{ name: "Banca", options: [] },
{ name: "Ano", options: [] },
{ name: "Nível", options: [] }]

export default function Home() {
  const [selected, setSelected] = useState(initialSelected)
  const [filtered,setFiltered] = useState(initialSelected)
  const onSelectionChange = (name:string,keys:SharedSelection) => {
    const nextSelected:{options: any[]; name: string}[] = selected.map(
      selection=>{
        if (selection.name !== name) {
          return selection;
        } else {
          return {...selection,options:[...keys]}
        }
      }
    )
    setSelected(nextSelected);
  }
  const onRemoveSelection=(name:string,option:string) => {
    const nextSelected = selected.map(
      selection=>{
        if (selection.name !== name) {
          return selection;
        } else {
          return {...selection,options:selection.options.filter(function(item){
            return item != option
          })}
        }
      }
    )
    setSelected(nextSelected);
  }
  const onFilter = () => {
    setFiltered(selected);
  }
  const empty = () => {
    setSelected(initialSelected);
  }
  return (
    <div className="w-full">
      <div className="hidden lg:w-full lg:flex lg:flex-row">
        <div className="w-[75%]">
          <Filter onSelectionChange={onSelectionChange} selected={selected} onFilter={onFilter} empty={empty}/>
          {filtered[0].options.length>0 && <QuestionList/>}
          </div>
        <div className="w-[25%]"><AppliedFilters selected={selected} onRemoveSelection={onRemoveSelection}/></div>
        
      </div>
      <div className="flex flex-col w-full lg:hidden">
        <Filter onSelectionChange={onSelectionChange} selected={selected} onFilter={onFilter} empty={empty}/>
        {filtered[0].options.length>0 && <QuestionList/>}
      </div>
    </div>
  );
}
