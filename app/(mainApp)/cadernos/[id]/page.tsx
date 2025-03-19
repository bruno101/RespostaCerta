"use client";
import FullQuestion from "@/app/ui/questions/FullQuestion";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component from shadcn
import { Progress } from "@/components/ui/progress"; // Assuming you have a Progress component from shadcn
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component from shadcn
import { ChevronLeft, ChevronRight } from "lucide-react"; // Assuming you have Lucide icons for arrows

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | undefined
  >();
  const [numberOfQuestions, setNumberOfQuestions] = useState<
    number | undefined
  >();
  const [notebook, setNotebook] = useState<
    | {
        currentQuestion: number;
        title: string;
        questions: string[];
        numberOfQuestions: number;
        id: string;
      }
    | undefined
  >();

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const id = (await params).id;
        const res = await fetch(`/api/notebooks/${id}`);
        if (!res.ok) {
          throw new Error("Erro buscando caderno");
        }
        const data = await res.json();
        setNotebook(data);
        setCurrentQuestionIndex(+data.currentQuestion);
        setNumberOfQuestions(+data.numberOfQuestions);
      } catch (e) {
        console.error(e);
      }
    };
    fetchNotebook();
  }, []);

  const updateCurrentQuestionOnServer = async (index: number) => {
    try {
      if (!notebook?.id) {
        throw new Error("Id do caderno necessária");
      }
      const res = await fetch(`/api/notebooks/${notebook?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentQuestion: index,
        }),
      });
      if (!res.ok) {
        throw new Error("Erro atualizando página atual no servidor");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex !== undefined) {
      updateCurrentQuestionOnServer(currentQuestionIndex);
    }
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex !== undefined && numberOfQuestions !== undefined) {
      setCurrentQuestionIndex((prev) =>
        prev! < numberOfQuestions - 1 ? prev! + 1 : prev
      );
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex !== undefined) {
      setCurrentQuestionIndex((prev) => (prev! > 0 ? prev! - 1 : prev));
    }
  };

  if (
    currentQuestionIndex === undefined ||
    !notebook?.questions[currentQuestionIndex]
  ) {
    return (
      <div className="space-y-4 mt-[150px] flex flex-col w-[100vw] px-5">
        <Skeleton className="h-10 w-full mx-auto max-w-3xl" />
        <Skeleton className="h-20 w-full mx-auto max-w-3xl" />
        <Skeleton className="h-40 w-full mx-auto max-w-3xl" />
      </div>
    );
  }

  const progressValue = ((currentQuestionIndex + 1) / numberOfQuestions!) * 100;

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-cyan-800">
        {notebook.title}
      </h1>

      {/* Progress Bar with Navigation Arrows */}
      <div className="w-full max-w-2xl flex items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="p-2 -mt-7 rounded-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className=" h-6 w-6 text-primary" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <Progress value={progressValue} className="h-2 bg-muted" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Questão {currentQuestionIndex + 1} de {numberOfQuestions}
          </p>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === numberOfQuestions! - 1}
          className="p-2 -mt-7 rounded-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-6 w-6 text-primary" />
        </button>
      </div>

      {/* Question Card */}
      <Card className="w-full max-w-4xl">
        <FullQuestion codigo={notebook.questions[currentQuestionIndex]} />
      </Card>

      {/* Mobile Navigation Buttons */}
      <div className="flex space-x-4 sm:hidden">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className=" h-6 w-6 text-primary" />
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === numberOfQuestions! - 1}
          className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className=" h-6 w-6 text-primary" />
        </button>
      </div>
    </div>
  );
}
