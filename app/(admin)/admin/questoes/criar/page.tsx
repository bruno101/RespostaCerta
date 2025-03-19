"use client";
import ISelector from "@/app/interfaces/ISelector";
import { QuestionForm } from "@/app/ui/admin/QuestionForm";
import { useEffect, useState } from "react";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { MdPageview } from "react-icons/md";

export default function Page() {
  const [preview, setPreview] = useState("");
  const [filters, setFilters] = useState<ISelector[]>([]);
  useEffect(() => {
    async function fetchFilters() {
      const res = await fetch(`/api/filters`); // 👈 API call
      if (!res.ok) throw new Error("Failed to fetch selectors");
      const data: ISelector[] = await res.json();
      setFilters(data);
    }
    fetchFilters();
  }, []);
  return (
    <div className="container py-10 px-10">
      <h1 className="text-3xl font-bold mb-6 text-cyan-600 flex">
        <FaFileCircleQuestion className="mr-2 w-8 h-8 mt-1" />
        Criar Nova Questão
      </h1>
      <div className="py-7 px-10 rounded-lg border-1 bg-white shadow-md border-t-4">
        <QuestionForm edit={false} filters={filters} setPreview={setPreview} />
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
