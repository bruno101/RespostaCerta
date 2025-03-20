"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import Question from "./Question";
import type IQuestion from "@/app/interfaces/IQuestion";
import type ISelector from "@/app/interfaces/ISelector";
import { searchQuestions } from "@/app/actions/searchQuestions";
import Image from "next/image";
import LoadingSkeletons from "./LoadingSkeletons";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

export default function QuestionList({
  filtered,
  loading,
  setLoading,
  questionsPerPage,
  pageIndex,
  router,
  searchParams,
}: {
  filtered: ISelector[];
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  questionsPerPage: number;
  pageIndex: number;
  router: AppRouterInstance;
  searchParams: ReadonlyURLSearchParams;
}) {
  const initQuestions: IQuestion[] = [];

  const [questions, setQuestions] = useState<IQuestion[]>(initQuestions);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);

  const fetchQuestions = async () => {
    try {
      const data = await searchQuestions(filtered, questionsPerPage, pageIndex);
      if (data) {
        setQuestions(data.questions);
        setNumberOfQuestions(data.totalDocuments);
        setDataLoaded(true);
      }
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

  // Calculate pagination values
  const totalPages = Math.ceil(numberOfQuestions / questionsPerPage);

  const updateQueryParam = (newParams: { key: string; value: string }[]) => {
    const params = new URLSearchParams(searchParams);
    newParams.map((param) => {
      params.set(param.key, param.value);
    });
    router.replace(`?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    updateQueryParam([{ key: "pageIndex", value: String(page) }]);
  };

  // Handle questions per page change
  const handleQuestionsPerPageChange = (value: string) => {
    updateQueryParam([
      { key: "pageIndex", value: String(1) },
      { key: "questionsPerPage", value: String(value) },
    ]);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={pageIndex === 1}
          className={
            pageIndex === 1
              ? "cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700"
              : "cursor-pointer"
          }
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate range of visible pages
    let startPage = Math.max(2, pageIndex - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

    if (endPage - startPage < maxVisiblePages - 3) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3) + 1);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={pageIndex === i}
            className={
              pageIndex === i
                ? "cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700"
                : ""
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={pageIndex === totalPages}
            className={
              pageIndex === totalPages
                ? "cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700"
                : "cursor-pointer"
            }
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (loading) {
    return <LoadingSkeletons />;
  }

  return (
    <div className="mt-3">
      {questions.map((question, index: any) => (
        <div key={index}>
          <Question
            question={question}
            index={questionsPerPage * (pageIndex - 1) + index}
          />
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
          />
          <h2 className="mx-auto font-bold text-[19px] my-4">
            Nenhuma questão encontrada.
          </h2>
          <p className="text-gray-800 mx-auto text-[15px] max-w-[400px] text-center">
            Essa combinação de filtros não produziu nenhum resultado. Por favor
            tente outros critérios.
          </p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="mt-8 mb-2 mx-auto px-5">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="text-sm text-gray-600">
              Mostrando{" "}
              {Math.min(
                (pageIndex - 1) * questionsPerPage + 1,
                numberOfQuestions
              )}{" "}
              a {Math.min(pageIndex * questionsPerPage, numberOfQuestions)} de{" "}
              {numberOfQuestions} questões
            </div>

            <div className="flex items-center gap-3">
              <Label
                htmlFor="questionsPerPage"
                className="text-sm text-gray-600"
              >
                Questões por página:
              </Label>
              <Select
                value={questionsPerPage.toString()}
                onValueChange={handleQuestionsPerPageChange}
              >
                <SelectTrigger
                  id="questionsPerPage"
                  className="w-[80px] h-9 border-cyan-200 focus:ring-cyan-500"
                >
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex text-cyan-600 border-0 shadow-white hover:bg-white items-center gap-1 ${
                    pageIndex === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handlePageChange(Math.max(1, pageIndex - 1))}
                  disabled={pageIndex === 1}
                >
                  Anterior
                </Button>
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex text-cyan-600 border-0 shadow-white hover:bg-white items-center gap-1 ${
                    pageIndex === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, pageIndex + 1))
                  }
                  disabled={pageIndex === totalPages}
                >
                  Próximo
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
