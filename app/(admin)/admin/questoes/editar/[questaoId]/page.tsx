"use client";
import IQuestion from "@/app/interfaces/IQuestion";
import ISelector from "@/app/interfaces/ISelector";
import { QuestionForm } from "@/app/ui/admin/QuestionForm";
import LoadingSkeletons from "@/app/ui/questions/LoadingSkeletons";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdPageview } from "react-icons/md";

export default function Page({
  params,
}: {
  params: Promise<{ questaoId: string }>;
}) {
  const [preview, setPreview] = useState("");
  const [filters, setFilters] = useState<ISelector[]>([]);
  const [initialQuestion, setInitialQuestion] = useState<IQuestion>();
  useEffect(() => {
    async function fetchFilters() {
      const res = await fetch(`/api/filters`); // 👈 API call
      if (!res.ok) throw new Error("Failed to fetch selectors");
      const data: ISelector[] = await res.json();
      setFilters(data);
    }
    fetchFilters();
  }, []);
  useEffect(() => {
    async function fetchQuestion() {
      const { questaoId } = await params;
      const res = await fetch(`/api/questions/${questaoId}`); // 👈 API call
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data: IQuestion = await res.json();
      setInitialQuestion(data);
    }
    fetchQuestion();
  }, []);
  return (
    <div className="container py-10 px-10">
      <h1 className="text-3xl font-bold mb-6 text-cyan-600 flex">
        <FaEdit className="mr-2 w-8 h-8 mt-1" />
        Editar Questão
      </h1>
      <div className="py-7 px-10 rounded-lg border-1 bg-white shadow-md border-t-4">
        {initialQuestion ? (
          <QuestionForm
            edit={true}
            initialQuestionValues={{ ...initialQuestion }}
            filters={filters}
            setPreview={setPreview}
          />
        ) : (
          <LoadingSkeletons />
        )}
      </div>
      {preview.length > 0 && (
        <>
          <h1 className="text-3xl font-bold my-6 text-cyan-600 flex">
            <MdPageview className="mr-2 w-8 h-8 mt-1" />
            Prévia
          </h1>
          <div
            className="rich-text-editor mt-4 py-7 px-10 rounded-lg border-1 bg-white shadow-md border-t-4"
            dangerouslySetInnerHTML={{ __html: preview }}
          ></div>
        </>
      )}
    </div>
  );
}
