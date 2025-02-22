import { Suspense, useEffect, useState } from "react";
import Question from "./Question";
import IQuestion from "@/app/interfaces/IQuestion";

export default function QuestionList({
  onFinishedLoading,
  loading,
}: {
  onFinishedLoading: () => void;
  loading: boolean;
}) {
  const initQuestions: IQuestion[] = [];

  const [questions, setQuestions] = useState(initQuestions);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      console.log("here");
      onFinishedLoading();
    }
  }, [questions]);

  return (
    <div className="mt-3">
      {questions.map((question, index: any) => (
        <div key={index}>
          <Question question={question} index={index} />
        </div>
      ))}
    </div>
  );
}
