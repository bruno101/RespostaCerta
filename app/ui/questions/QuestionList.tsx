import { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react";
import Question from "./Question";
import IQuestion from "@/app/interfaces/IQuestion";
import ISelector from "@/app/interfaces/ISelector";
import { searchQuestions } from "@/app/actions/searchQuestions";
import Image from "next/image";
import LoadingSkeletons from "./LoadingSkeletons";

export default function QuestionList({
  filtered,
  loading,
  setLoading,
}: {
  filtered: ISelector[];
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const initQuestions: IQuestion[] = [];

  const [questions, setQuestions] = useState<IQuestion[]>(
    initQuestions
  );
  const [dataLoaded, setDataLoaded] = useState(false);
  const fetchQuestions = async () => {
    try {
      console.log("fetch");
      const data = await searchQuestions(filtered);
      //const res = await fetch("/api/questions");
      //const data = await res.json();
      console.log("fetched");
      if (data) {
        setQuestions(data);
        setDataLoaded(true);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filtered]);

  useEffect(() => {
    if (dataLoaded) {
      setLoading(false);
    }
  }, [questions, dataLoaded]);

  if (loading) {
    return <LoadingSkeletons />;
  }

  return (
    <div className="mt-3">
      {questions.map((question, index: any) => (
        <div key={index}>
          <Question question={question} index={index} />
        </div>
      ))}
      {!questions.length && (
        <div className="flex flex-col">
          <Image
            alt="nenhuma questão encontrada"
            src="/no-results.png"
            className="mx-auto mt-1 w-40 h-40"
            width={512}
            height={512}
          ></Image>
          <h2 className="mx-auto font-bold text-[19px] my-4">
            Nenhuma questão encontrada.
          </h2>
          <p className="text-gray-800 mx-auto text-[15px] max-w-[400px] text-center">
            Essa combinação de filtros não produziu nenhum resultado. Por favor
            tente outros critérios.
          </p>
        </div>
      )}
    </div>
  );
}
