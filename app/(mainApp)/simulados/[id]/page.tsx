"use client";

import React, { useState, useEffect } from "react";
import ExamInitialScreen from "@/app/ui/mock-exam/ExamInitialScreen"; // To be created
import Question from "@/app/ui/mock-exam/Question"; // To be created
import ExamReviewScreen from "@/app/ui/mock-exam/ExamReviewScreen"; // To be created
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn Skeleton
import ISimulado from "@/app/interfaces/ISimulado";

export default function SimuladoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [simulado, setSimulado] = useState<ISimulado | null>(null);
  const [currentComponent, setCurrentComponent] = useState<
    "initial" | "question" | "review"
  >("initial");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({}); // Stores user answers
  const [isLoading, setIsLoading] = useState(true);

  // Fetch simulado data
  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params; // Await the params promise
      const response = await fetch(`/api/mock-exams/${resolvedParams.id}`);
      const data = await response.json();
      setSimulado(data);
      setIsLoading(false);
      console.log(data.completed);
      if (data.completed) {
        console.log("ok");
        setCurrentComponent("review");
        setAnswers(data.userResponses);
      }
    };

    fetchData();
  }, [params]); // Only `params` is a dependency

  // Handle starting the exam
  const handleStartExam = () => {
    setCurrentComponent("question");
  };

  // Handle moving to the next question
  const handleNextQuestion = (answer: string) => {
    // Save the answer
    setAnswers((prev) => ({
      ...prev,
      [simulado!.questions[currentQuestionIndex].id]: answer,
    }));

    // Move to the next question or finish the exam
    if (currentQuestionIndex < simulado!.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentComponent("review");
    }
  };

  // Handle reviewing the exam
  const handleReviewExam = () => {
    setCurrentComponent("review");
  };

  if (isLoading) {
    return (
      <div
        className="w-full mx-auto"
        style={{ width: "60%", marginTop: "10%" }}
      >
        {/* Header skeleton */}
        <div className="mb-8 mt-6">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-7 w-1/2 mb-2" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          {/* First content block */}
          <div className="space-y-3">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-4/5" />
          </div>

          {/* Image placeholder */}
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!simulado) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg text-gray-600">Simulado não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {currentComponent === "initial" && (
          <ExamInitialScreen
            simulado={simulado}
            totalTime={simulado.questions.reduce(
              (sum, q) => sum + q.timeLimit,
              0
            )}
            onStart={handleStartExam}
          />
        )}

        {currentComponent === "question" && (
          <Question
            question={simulado.questions[currentQuestionIndex]}
            onNext={handleNextQuestion}
            numberOfQuestions={simulado.questions.length}
          />
        )}

        {currentComponent === "review" && (
          <ExamReviewScreen
            setIsLoading={setIsLoading}
            simulado={simulado}
            answers={answers}
            setSimulado={setSimulado}
          />
        )}
      </div>
    </div>
  );
}
