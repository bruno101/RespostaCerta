import { NextResponse } from "next/server";

export async function GET() {
  const mockSimulados = [
    {
      id: 1,
      title: "Simulado de Matemática para Engenheiros",
      disciplina: ["Matemática", "Cálculo"], // Array of disciplines
      cargo: "Engenheiro",
      concurso: "Concurso Petrobras 2024",
      questions: 50,
      duration: 120,
      completed: false,
    },
    {
      id: 2,
      title: "Simulado de Direito Constitucional",
      disciplina: ["Direito Constitucional", "Legislação"], // Array of disciplines
      cargo: "Advogado",
      concurso: "Concurso OAB 2024",
      questions: 40,
      duration: 90,
      completed: true,
    },
    {
      id: 3,
      title: "Simulado de Informática Básica",
      disciplina: ["Informática", "Tecnologia da Informação"], // Array of disciplines
      cargo: "Analista de Sistemas",
      concurso: "Concurso Banco do Brasil 2024",
      questions: 30,
      duration: 60,
      completed: false,
    },
    {
      id: 4,
      title: "Simulado de Português para Concursos",
      disciplina: ["Português", "Gramática"], // Array of disciplines
      cargo: "Todos os Cargos",
      concurso: "Concurso Público Geral 2024",
      questions: 35,
      duration: 75,
      completed: false,
    },
    {
      id: 5,
      title: "Simulado de Raciocínio Lógico",
      disciplina: ["Raciocínio Lógico", "Matemática"], // Array of disciplines
      cargo: "Todos os Cargos",
      concurso: "Concurso Público Geral 2024",
      questions: 25,
      duration: 60,
      completed: true,
    },
    {
      id: 6,
      title: "Simulado de Administração Pública",
      disciplina: ["Administração", "Gestão Pública"], // Array of disciplines
      cargo: "Administrador",
      concurso: "Concurso Prefeitura Municipal 2024",
      questions: 45,
      duration: 90,
      completed: false,
    },
    {
      id: 7,
      title: "Simulado de Contabilidade Geral",
      disciplina: ["Contabilidade", "Finanças"], // Array of disciplines
      cargo: "Contador",
      concurso: "Concurso Receita Federal 2024",
      questions: 50,
      duration: 120,
      completed: true,
    },
    {
      id: 8,
      title: "Simulado de Legislação Tributária",
      disciplina: ["Legislação", "Direito Tributário"], // Array of disciplines
      cargo: "Auditor Fiscal",
      concurso: "Concurso SEFAZ 2024",
      questions: 40,
      duration: 90,
      completed: false,
    },
    {
      id: 9,
      title: "Simulado de Engenharia Civil",
      disciplina: ["Engenharia Civil", "Estruturas"], // Array of disciplines
      cargo: "Engenheiro Civil",
      concurso: "Concurso DER 2024",
      questions: 55,
      duration: 120,
      completed: false,
    },
    {
      id: 10,
      title: "Simulado de Medicina do Trabalho",
      disciplina: ["Medicina", "Saúde Ocupacional"], // Array of disciplines
      cargo: "Médico do Trabalho",
      concurso: "Concurso INSS 2024",
      questions: 30,
      duration: 60,
      completed: true,
    },
    {
      id: 11,
      title: "Simulado de Enfermagem",
      disciplina: ["Enfermagem", "Saúde"], // Array of disciplines
      cargo: "Enfermeiro",
      concurso: "Concurso SUS 2024",
      questions: 35,
      duration: 75,
      completed: false,
    },
    {
      id: 12,
      title: "Simulado de Pedagogia",
      disciplina: ["Pedagogia", "Educação"], // Array of disciplines
      cargo: "Professor",
      concurso: "Concurso Secretaria de Educação 2024",
      questions: 40,
      duration: 90,
      completed: true,
    },
  ];

  return NextResponse.json(mockSimulados);
}
