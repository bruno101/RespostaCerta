"use client";

import React, { useState, useEffect } from "react";
import ExamInitialScreen from "@/app/ui/mock-exam/ExamInitialScreen"; // To be created
import Question from "@/app/ui/mock-exam/Question"; // To be created
import ExamReviewScreen from "@/app/ui/mock-exam/ExamReviewScreen"; // To be created
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn Skeleton
import ISimulado from "@/app/interfaces/ISimulado";
import { toast } from "sonner";

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
  const [error, setError] = useState("");
  const [deletingResponses, setDeletingResponses] = useState(false);

  // Fetch simulado data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params; // Await the params promise
        const response = await fetch(`/api/mock-exams/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Erro buscando simulado");
        }
        const data = await response.json();
        setSimulado(data);
        setIsLoading(false);
        if (data.completed) {
          setCurrentComponent("review");
          setAnswers(data.userResponses);
        }
      } catch (e) {
        console.error(e);
        toast.error("Erro buscando simulado", {
          description: "Ocorreu um erro ao acessarmos esse simulado.",
        });
      }
    };

    fetchData();
  }, [params]); // Only `params` is a dependency

  // Handle starting the exam
  const handleStartExam = () => {
    setCurrentComponent("question");
  };

  const fetchFeedback = async (submittedAnswers: { [key: number]: string }) => {
    try {
      setIsLoading(true);
      if (!simulado?.id) {
        throw new Error("id do simulado necessária");
      }
      const res = await fetch(
        `/api/mock-exams/${simulado.id}/submit-responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            responses: simulado.questions.map((question, index) => ({
              maxGrade: question.points,
              question: question.question,
              userResponse: submittedAnswers[index + 1],
            })),
          }),
        }
      );
      const data: {
        user: string;
        exam_id: string;
        responses: string[];
        grades: number[];
        comments: string[];
      } = await res.json();
      if (!data || !data.grades || !data.comments) {
        throw new Error("Erro buscando feedback.");
      }
      setSimulado((prev) => {
        if (!prev) return prev;
        const novoSimulado = { ...prev, completed: true };
        const novasQuestoes = [...novoSimulado.questions].map(
          (questao, index) => ({
            ...questao,
            grade: data.grades[index],
            comment: data.comments[index],
          })
        );
        novoSimulado.questions = novasQuestoes;
        return novoSimulado;
      });
    } catch (e) {
      console.error(e);
      setError("Erro submetendo resposta.");
      toast.error("Erro submetendo resposta", {
        description: "Ocorreu um erro durante a submissão da resposta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRestart = async () => {
    try {
      setDeletingResponses(true);
      if (!simulado?.id) {
        throw new Error("id do simulado é necessária");
      }
      const res = await fetch(
        `/api/mock-exams/${simulado.id}/delete-response`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Erro deletando resposta ao simulado.");
      }
      setCurrentComponent("initial");
      setCurrentQuestionIndex(0);
      setSimulado((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          completed: false,
          questions: [
            ...prev.questions.map((question) => ({
              ...question,
              userResponse: undefined,
              grade: undefined,
              comment: undefined,
            })),
          ],
        };
      });
    } catch (e) {
      console.error(e);
      toast.error("Erro deletando resposta", {
        description:
          "Não foi possível deletar a resposta ao simulado dos nossos servidores",
      });
    } finally {
      setDeletingResponses(false);
    }
  };

  // Handle moving to the next question
  const handleNextQuestion = (answer: string) => {
    // Save the answer
    const submittedAnswers = {
      ...answers,
      [simulado!.questions[currentQuestionIndex].id]: answer,
    };
    setAnswers((prev) => ({
      ...prev,
      [simulado!.questions[currentQuestionIndex].id]: answer,
    }));

    // Move to the next question or finish the exam
    if (currentQuestionIndex < simulado!.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      fetchFeedback(submittedAnswers);
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
        className="w-full mx-auto my-6"
        style={{ width: "60%", marginTop: "10%" }}
      >
        {/* Header skeleton */}
        <div className="mb-8">
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
            simulado={simulado}
            currentQuestionIndex={currentQuestionIndex}
            onNext={handleNextQuestion}
            numberOfQuestions={simulado.questions.length}
          />
        )}

        {currentComponent === "review" && (
          <ExamReviewScreen
            deletingResponses={deletingResponses}
            error={error}
            onRestart={onRestart}
            simulado={simulado}
            answers={answers}
          />
        )}
      </div>
    </div>
  );
}
