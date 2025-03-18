"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress"; // shadcn Progress
import { BookOpen, Clock, ArrowRight } from "lucide-react"; // Icons
import { toast } from "sonner";
import IExamQuestion from "@/app/interfaces/IExamQuestion";

interface QuestionProps {
  question: IExamQuestion;
  numberOfQuestions: number;
  onNext: (answer: string) => void;
}

export default function Question({
  question,
  onNext,
  numberOfQuestions,
}: QuestionProps) {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [userAnswer, setUserAnswer] = useState("");

  // Handle the countdown timer
  useEffect(() => {
    if (timeLeft === 0) {
      toast.success("Tempo esgotado", {
        description:
          "Sua resposta para a questão foi submetida automaticamente",
      });
      onNext(userAnswer); // Automatically submit the answer when time runs out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onNext, userAnswer]);

  // Format the time left as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Calculate the progress of the timer (for the circular progress indicator)
  const timerProgress = (timeLeft / question.timeLimit) * 100;

  // Handle submitting the answer
  const handleSubmit = () => {
    onNext(userAnswer);
    setUserAnswer("");
  };

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
            Simulado de IA
          </h1>
          <p className="text-sm text-gray-600">
            Questão {question.id} de {numberOfQuestions} •{" "}
            <span className="text-cyan-600">
              {question.points} ponto{question.points !== 1 ? "s" : ""}
            </span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-32">
          <Progress
            value={(question.id / numberOfQuestions) * 100}
            className="h-2"
          />
          <p className="text-xs text-gray-600 text-right mt-1">
            {Math.round((question.id / numberOfQuestions) * 100)}% concluído
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-6" />

      {/* Question */}
      <div
        className="prose prose-lg mb-8"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />

      {/* Answer Input */}
      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-8"
        rows={10}
        placeholder="Digite sua resposta aqui..."
        value={userAnswer}
        onChange={(e) => {
          setUserAnswer(e.target.value);
        }}
      />

      {/* Timer and Submit Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-orange-500"
                strokeWidth="3"
                stroke="currentColor"
                strokeDasharray={`${Number(timerProgress) || 0}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <span className="ml-1 mt-[1px] text-xs font-bold text-orange-500">
            {formatTime(timeLeft)}
          </span>
          <span className="-ml-[2px] text-sm text-gray-600">restantes</span>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-orange-600 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          {question.id === numberOfQuestions
            ? "Concluir Simulado"
            : "Próxima Questão"}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
