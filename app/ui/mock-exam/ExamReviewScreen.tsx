"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Undo2,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  FilePen,
} from "lucide-react"; // Icons
import Link from "next/link";
import { Progress } from "@/components/ui/progress"; // Assuming you use shadcn for the progress bar
import ISimulado from "@/app/interfaces/ISimulado";

interface Answer {
  [questionId: number]: string; // Answers are stored as {1: 'answer', 2: 'answer', ...}
}

interface ExamReviewScreenProps {
  simulado: ISimulado;
  deletingResponses: boolean;
  answers?: Answer;
  error: string;
  onRestart: () => void;
}

export default function ExamReviewScreen({
  simulado,
  deletingResponses,
  onRestart,
  error,
  answers = {}, // Default to an empty object if `answers` is undefined
}: ExamReviewScreenProps) {
  const totalGrade = simulado.questions.reduce((acc, question) => {
    return acc + (question.grade || 0);
  }, 0);

  const maxGrade = simulado.questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  // Function to classify the answer based on the grade
  const classifyAnswer = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 70) return "Fully Correct";
    if (percentage >= 20) return "Partially Correct";
    if (percentage > 0) return "Incorrect but Relevant";
    return "Completely Incorrect";
  };

  if (error) {
    return (
      <div className="flex text-red-700 px-3 py-2 mx-auto my-5 rounded-md bg-red-200 border-red-800">
        <p className="mx-auto">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Revisão do Simulado
          </h1>
          <h2 className="text-md text-gray-800">{simulado.title}</h2>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-6" />

      {/* Total Grade and Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold text-gray-800">
            Sua Pontuação Total:
          </p>
          <p className="text-lg font-bold text-green-600">
            {totalGrade} / {maxGrade}
          </p>
        </div>
        <Progress value={(totalGrade / maxGrade) * 100} className="h-3" />
      </motion.div>

      {/* Questions Review */}
      <div className="space-y-6">
        {simulado.questions.map((question) => {
          const userAnswer =
            question.userResponse || "Nenhuma resposta fornecida.";
          const classification =
            question.grade !== null && question.grade !== undefined
              ? classifyAnswer(question.grade, question.points)
              : "Not Graded";

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Question */}
              <div className="prose prose-lg">
                <h3 className="rich-text-editor font-semibold text-gray-800">
                  Questão {question.id}
                </h3>
                <div dangerouslySetInnerHTML={{ __html: question.question }} />
              </div>

              {/* User Answer vs Correct Answer */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Sua Resposta:
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p
                      className="text-gray-800 rich-text-editor"
                      dangerouslySetInnerHTML={{
                        __html: userAnswer,
                      }}
                    ></p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Resposta Correta:
                  </p>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p
                      className="rich-text-editor text-green-800"
                      dangerouslySetInnerHTML={{
                        __html: question.correctAnswer,
                      }}
                    ></p>
                  </div>
                </div>
              </div>

              {/* Feedback and Grade */}
              {question.comment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {classification === "Fully Correct" && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                    {classification === "Partially Correct" && (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    {classification === "Incorrect but Relevant" && (
                      <HelpCircle className="w-5 h-5 text-blue-500" />
                    )}
                    {classification === "Completely Incorrect" && (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <p className="text-sm text-gray-600">
                      {classification === "Fully Correct" &&
                        "Resposta correta!"}
                      {classification === "Partially Correct" &&
                        "Resposta parcialmente correta."}
                      {classification === "Incorrect but Relevant" &&
                        "Resposta incorreta, mas relevante."}
                      {classification === "Completely Incorrect" &&
                        "Resposta completamente incorreta."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-600">Nota:</p>
                    <p className="text-sm text-gray-800">
                      {question.grade} / {question.points}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <p className="text-sm font-medium text-gray-600">
                      Comentário:
                    </p>
                    <p className="text-sm text-gray-800">{question.comment}</p>
                  </div>
                </motion.div>
              )}

              {/* Divider */}
              <div className="border-b border-gray-200" />
            </motion.div>
          );
        })}
      </div>
      <div className="ml-auto sm:flex">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            onRestart();
          }}
          disabled={deletingResponses}
          whileTap={{ scale: 0.95 }}
          className="disabled:opacity-50 mt-5 sm:mr-4 ml-auto flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-red-700 hover:text-white transition-colors text-sm"
        >
          <FilePen size={16} />
          {deletingResponses ? "Limpando Respostas..." : "Refazer Simulado"}
        </motion.button>

        {/* Back Button */}
        <Link href={"/simulados"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto sm:ml-0 mt-5 flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition-colors text-sm"
          >
            <Undo2 size={16} />
            Voltar para Simulados
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
