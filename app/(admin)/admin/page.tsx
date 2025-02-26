"use client";
import CrudTable from "@/app/ui/admin/CrudTable";
import { useEffect, useState } from "react";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { fetchUsers } from "./fetchUsers";
import IQuestion from "@/app/interfaces/IQuestion";

export default function Page() {
  const headerNames: string[] = ["ID", "Concurso", "Texto"];
  const initialData: { _id: string; concurso: string; text: string }[] = [];

  const truncatedDataWordLimit = [3, 100, 250];
  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetchUsers();
      const parsedData = JSON.parse(fetchedData);
      setData(
        parsedData.map((item: IQuestion) => {
          return {
            _id: item.Codigo,
            concurso:
              item.Instituicao +
              " - " +
              item.Ano +
              " - " +
              item.Cargo +
              " - " +
              item.Banca,
            text: item.TextoMotivador + item.Questao + item.Resposta,
          };
        })
      );
      console.log(fetchedData);
    }
    fetchData();
  }, []);

  const [data, setData] = useState(initialData);

  return (
    <CrudTable
      editUrl={"/admin/questoes/editar"}
      createUrl={"/admin/questoes/criar"}
      data={data}
      truncatedDataWordLimit={truncatedDataWordLimit}
      setData={setData}
      title={"Questão"}
      headerNames={headerNames}
      icon={<FaFileCircleQuestion className="w-5 h-5" />}
    />
  );
}
