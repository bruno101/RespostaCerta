"use client";
import CrudTable from "@/app/ui/admin/CrudTable";
import { useState } from "react";
import { PiExamFill } from "react-icons/pi";

export default function Page() {
  const headerNames: string[] = ["ID", "Título"];
  const [data, setData] = useState([]);
  return (
    <CrudTable
      editUrl={"/admin/simulados/editar"}
      createUrl={"/admin/simulados/criar"}
      data={data}
      setData={setData}
      title={"Simulado"}
      headerNames={headerNames}
      icon={<PiExamFill className="w-5 h-5" />}
    />
  );
}
