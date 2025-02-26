"use client";
import CrudTable from "@/app/ui/admin/CrudTable";
import { useState } from "react";
import { FaFileCircleQuestion } from "react-icons/fa6";

export default function Page() {
  const headerNames: string[] = ["ID", "Concurso", "Texto"];
  const mockData = [
    {
      _id: "fhkfjafuwhgowighwhgw",
      concurso: "Concurso Federal 2023",
      text: "Este é um texto de exemplo para o concurso federal que será realizado em 2023. Contém informações importantes sobre datas e locais.",
    },
    {
      _id: "002",
      concurso: "Concurso Estadual",
      text: "Informações detalhadas sobre o concurso estadual, incluindo requisitos e processo seletivo.",
    },
    {
      _id: "003",
      concurso: "Processo Seletivo Municipal",
      text: "Detalhes sobre o processo seletivo municipal, com datas de inscrição e provas.",
    },
    {
      _id: "004",
      concurso: "Concurso Público Saúde",
      text: "Concurso para área de saúde com vagas para médicos, enfermeiros e técnicos.",
    },
    {
      _id: "005",
      concurso: "Seleção Educação",
      text: "Processo seletivo para professores e auxiliares educacionais.",
    },
    {
      _id: "006",
      concurso: "Concurso Administrativo",
      text: "Vagas para cargos administrativos em diversos órgãos públicos.",
    },
    {
      _id: "007",
      concurso: "Concurso Técnico",
      text: "Oportunidades para técnicos em diversas áreas de atuação.",
    },
    {
      _id: "008",
      concurso: "Processo Interno",
      text: "Seleção interna para promoção de servidores já efetivos.",
    },
    {
      _id: "009",
      concurso: "Concurso Jurídico",
      text: "Vagas para advogados, procuradores e assessores jurídicos.",
    },
    {
      _id: "010",
      concurso: "Seleção Emergencial",
      text: "Processo seletivo emergencial para contratação temporária.",
    },
    {
      _id: "011",
      concurso: "Concurso Segurança",
      text: "Vagas para agentes de segurança e policiais.",
    },
    {
      _id: "012",
      concurso: "Seleção Tecnologia",
      text: "Oportunidades na área de tecnologia da informação.",
    },
    {
      _id: "013",
      concurso: "Concurso Ambiental",
      text: "Vagas para profissionais da área ambiental e sustentabilidade.",
    },
    {
      _id: "014",
      concurso: "Processo Seletivo Cultura",
      text: "Seleção para cargos relacionados à cultura e patrimônio.",
    },
    {
      _id: "015",
      concurso: "Concurso Infraestrutura",
      text: "Vagas para engenheiros e técnicos de infraestrutura.",
    },
  ];

  const [data, setData] = useState(mockData);

  return (
    <CrudTable
      editUrl={"/admin/questoes/editar"}
      createUrl={"/admin/questoes/criar"}
      data={data}
      setData={setData}
      title={"Questão"}
      headerNames={headerNames}
      icon={<FaFileCircleQuestion className="w-5 h-5" />}
    />
  );
}
