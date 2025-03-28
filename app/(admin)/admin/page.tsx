"use client";
import CrudTable from "@/app/ui/admin/CrudTable";
import { useEffect, useState } from "react";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { fetchQuestionsFromUser } from "@/app/actions/fetchQuestionsFromUser";
import IQuestion from "@/app/interfaces/IQuestion";

export default function Page() {
  const headerNames: string[] = ["ID", "Concurso", "Texto"];
  const initialData: { _id: string; concurso: string; text: string }[] = [];

  const truncatedDataWordLimit = [3, 100, 250];
  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetchQuestionsFromUser();
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
              item.Cargos[0] +
              " - " +
              item.Banca,
            text: item.TextoPlano ? item.TextoPlano : "",
          };
        })
      );
    }
    fetchData();
  }, []);

  const [data, setData] = useState(initialData);

  return (
    <CrudTable
      columns={["_id", "concurso", "text"]}
      editUrl={"/admin/questoes/editar"}
      createUrl={"/admin/questoes/criar"}
      deleteUrl={"questions"}
      data={data}
      truncatedDataWordLimit={truncatedDataWordLimit}
      setData={setData}
      title={"Questão"}
      headerNames={headerNames}
      icon={<FaFileCircleQuestion className="w-5 h-5" />}
    />
  );
}
