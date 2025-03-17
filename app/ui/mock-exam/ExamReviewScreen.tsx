"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Undo2, X } from "lucide-react"; // Icons
import Link from "next/link";

interface Answer {
  [questionId: number]: string; // Answers are stored as {1: 'answer', 2: 'answer', ...}
}

interface Simulado {
  title: string;
  questions: {
    id: number;
    question: string;
    correctAnswer: string;
  }[];
}

interface ExamReviewScreenProps {
  simulado: Simulado;
  answers?: Answer; // Make `answers` optional
}

export default function ExamReviewScreen({
  simulado,
  answers = {}, // Default to an empty object if `answers` is undefined
}: ExamReviewScreenProps) {
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

      {/* Questions Review */}
      <div className="space-y-6">
        {simulado.questions.map((question) => {
          const userAnswer =
            answers[question.id] || "Nenhuma resposta fornecida.";
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <div key={question.id} className="space-y-4">
              {/* Question */}
              <div className="prose prose-lg">
                <h3 className="font-semibold text-gray-800">
                  Questão {question.id}
                </h3>
                <div dangerouslySetInnerHTML={{ __html: question.question }} />
              </div>

              {/* User Answer vs Correct Answer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Sua Resposta:
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{userAnswer}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Resposta Correta:
                  </p>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p
                      className="text-green-800"
                      dangerouslySetInnerHTML={{
                        __html: question.correctAnswer,
                      }}
                    ></p>
                  </div>
                </div>
              </div>

              {/* Result Icon 
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
                <p className="text-sm text-gray-600">
                  {isCorrect ? "Resposta correta!" : "Resposta incorreta."}
                </p>
              </div>*/}

              {/* Divider */}
              <div className="border-b border-gray-200" />
            </div>
          );
        })}
      </div>
      <Link href={"/simulados"}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-5 ml-auto flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition-colors text-sm"
        >
          <Undo2 size={16} />
          Voltar para Simulados
        </motion.button>
      </Link>
    </motion.div>
  );
}
