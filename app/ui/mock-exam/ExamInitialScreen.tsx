"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Printer,
  CheckCircle,
  Play,
  Briefcase,
  Award,
  BookOpen,
  Router,
} from "lucide-react";
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import ISimulado from "@/app/interfaces/ISimulado";
import { useRouter } from "next/navigation";

interface ExamInitialScreenProps {
  simulado: ISimulado;
  totalTime: number; // Total time in seconds
  onStart: () => void;
}

export default function ExamInitialScreen({
  simulado,
  totalTime,
  onStart,
}: ExamInitialScreenProps) {
  // Convert total time to minutes
  const totalTimeMinutes = Math.floor(totalTime / 60);
  const router = useRouter();

  // Handle printing the simulado content
  const handlePrint = () => {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="/logo.png" alt="Logo" style="width: 100px; height: auto;" />
          <h1 style="font-size: 24px; font-weight: bold; color: #1a365d;">${
            simulado.title
          }</h1>
          <p style="font-size: 16px; color: #4a5568;">Cargo: ${
            simulado.cargo
          }</p>
          <p style="font-size: 16px; color: #4a5568;">Concurso: ${
            simulado.concurso
          }</p>
          <p style="font-size: 16px; color: #4a5568;">Disciplinas: ${simulado.disciplina.join(
            ", "
          )}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: bold; color: #1a365d;">Instruções Gerais</h2>
          <ul style="list-style-type: disc; margin-left: 20px;">
            <li>Leia cada questão com atenção antes de responder.</li>
            <li>Você terá um tempo limite para cada pergunta.</li>
            <li>Não é possível voltar à pergunta anterior após avançar.</li>
            <li>Revise suas respostas antes de finalizar o simulado.</li>
          </ul>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: bold; color: #1a365d;">Resumo do Simulado</h2>
          <div style="display: flex; gap: 10px;">
            <div style="flex: 1; background: #f0f4f8; padding: 10px; border-radius: 8px;">
              <p style="font-weight: bold;">Total de Questões</p>
              <p>${simulado.questions.length}</p>
            </div>
            <div style="flex: 1; background: #f0f4f8; padding: 10px; border-radius: 8px;">
              <p style="font-weight: bold;">Tempo Total</p>
              <p>${totalTimeMinutes} minutos</p>
            </div>
          </div>
        </div>
        <div>
          <h2 style="font-size: 20px; font-weight: bold; color: #1a365d;">Questões</h2>
          ${simulado.questions
            .map(
              (q) => `
            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 18px; font-weight: bold; color: #2d3748;">Questão ${q.id}</h3>
              <div style="margin-bottom: 10px;">${q.question}</div>
              <div style="font-weight: bold; color: #2d3748;">Resposta Correta:</div>
              <div>${q.correctAnswer}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${simulado.title}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              img { max-width: 100%; height: auto; }
              ul { list-style-type: disc; margin-left: 20px; }
              h1, h2, h3 { color: #1a365d; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const markAsDone = async () => {
    const res = await fetch(`/api/mock-exams/${simulado.id}/mark-as-done`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data && !data.error) {
      toast.success("Simulado marcado como concluído", {
        description: "Redirecionando para a página de simulados",
      });
      router.push("/simulados");
    } else {
      toast.success("Erro marcando como concluído", {
        description: "Simulado não pôde ser marcado como concluído",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-lg p-6 mb-8 -mt-8 -mx-8">
        <h1 className="text-3xl font-bold text-center text-white">
          {simulado.title}
        </h1>
        {/* Badges for Cargo, Concurso, and Disciplinas */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {/* Cargo Badge */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
            <Briefcase className="h-4 w-4" />
            {simulado.cargo}
          </div>
          {/* Concurso Badge */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
            <Award className="h-4 w-4" />
            {simulado.concurso}
          </div>
          {/* Disciplinas Badges */}
          {simulado.disciplina.map((disciplina, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white"
            >
              <BookOpen className="h-4 w-4" />
              {disciplina}
            </div>
          ))}
        </div>
      </div>

      {/* General Instructions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Instruções Gerais
        </h2>
        <ul className="list-disc list-inside space-y-0 text-gray-600">
          <li>Leia cada questão com atenção antes de responder.</li>
          <li>Você terá um tempo limite para cada pergunta.</li>
          <li>Não é possível voltar à pergunta anterior após avançar.</li>
          <li>
            As respostas corretas, as suas notas e os comentários serão exibidas
            ao final do simulado.
          </li>
          <li>
            O simulado será corrigido com o auxílio de inteligência artificial.
          </li>
        </ul>
      </div>

      {/* Exam Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Resumo do Simulado
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg">
            <p className="font-semibold text-blue-800">Total de Questões</p>
            <p className="text-blue-600">{simulado.questions.length}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
            <p className="font-semibold text-purple-800">Tempo Total</p>
            <p className="text-purple-600">{totalTimeMinutes} minutos</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Play size={16} />
          Iniciar Simulado
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-gray-700 transition-colors text-sm"
        >
          <Printer size={16} />
          Imprimir
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={markAsDone}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition-colors text-sm"
        >
          <CheckCircle size={16} />
          Marcar como Concluído
        </motion.button>
      </div>
    </motion.div>
  );
}
