"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input"; // shadcn Input
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // shadcn Card
import { Skeleton } from "@/components/ui/skeleton"; // shadcn Skeleton
import {
  CheckCircle,
  Clock,
  Search,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Edit,
  FileText,
  Pencil,
  Trash2,
  Layers,
  Calendar,
} from "lucide-react"; // lucide-react icons
import { FaGraduationCap, FaBook, FaUserTie } from "react-icons/fa"; // react-icons
import { motion } from "framer-motion"; // Framer Motion
import INotebook from "@/app/interfaces/INotebook";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // shadcn Dialog
import { Button } from "@/components/ui/button"; // shadcn Button
import { toast } from "sonner";

export default function CadernosPage() {
  const [cadernos, setCadernos] = useState<INotebook[]>([]);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  // State for dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedCaderno, setSelectedCaderno] = useState<INotebook | null>(
    null
  );
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetch("/api/notebooks")
      .then((res) => res.json())
      .then((data) => {
        setCadernos(data);
        setIsLoading(false);
      });
  }, []);

  const filteredCadernos = cadernos.filter((caderno) => {
    const searchLower = search.toLowerCase();
    return caderno.title.toLowerCase().includes(searchLower);
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCadernos = filteredCadernos.slice(indexOfFirst, indexOfLast);

  // Handle Delete
  const handleDelete = async () => {
    if (selectedCaderno) {
      try {
        setDeleting(true);
        const res = await fetch(`/api/notebooks/${selectedCaderno.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Erro ao deletar caderno.");
        }
        setCadernos(
          cadernos.filter((caderno) => caderno.id !== selectedCaderno.id)
        );
        toast.success("Caderno deletado", {
          description: "O caderno selecionado foi deletado com sucesso",
        });
      } catch (e) {
        console.error(e);
        toast.error("Erro ao deletar caderno", {
          description: "Tente novamente",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setDeleting(false);
      }
    }
  };

  // Handle Rename
  const handleRename = async () => {
    if (selectedCaderno && newTitle.trim()) {
      try {
        setRenaming(true);
        const res = await fetch(`/api/notebooks/${selectedCaderno.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTitle,
          }),
        });
        if (!res.ok) {
          throw new Error("Erro ao deletar caderno.");
        }

        toast.success("Caderno renomeado", {
          description: "O caderno selecionado foi renomeado com sucesso",
        });
        setCadernos(
          cadernos.map((caderno) =>
            caderno.id === selectedCaderno.id
              ? { ...caderno, title: newTitle }
              : caderno
          )
        );
      } catch (e) {
        console.error(e);
        toast.error("Erro ao renomear caderno", {
          description: "Tente novamente",
        });
      } finally {
        setIsRenameDialogOpen(false);
        setNewTitle("");
        setRenaming(false);
      }
    }
  };

  // Pagination component with ellipsis and "Anterior"/"Próximo" buttons
  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    const pages = [];
    const maxPagesToShow = 5; // Maximum number of pagination buttons to show

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" /> Anterior
        </button>
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1.5">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1.5 text-sm ${
                currentPage === page
                  ? "bg-green-600 text-white hover:bg-green-700 focus:bg-green-700"
                  : "text-green-600 border border-green-600 hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white"
              } rounded-lg`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || !totalPages}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próximo <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-green-100 text-green-900 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10 text-green-600" />
            Cadernos
          </h1>
          <p className="text-lg">
            Organize seu filtros de questões com seus cadernos.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
            <Input
              type="text"
              placeholder="Pesquisar cadernos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Available Cadernos */}
        <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center gap-2">
          <FaGraduationCap className="text-green-400" /> Meus Cadernos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            : currentCadernos.map((caderno, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/cadernos/${caderno.id}`}
                    onClick={(e) => {
                      // Prevent Link navigation if the dialog is open
                      if (isRenameDialogOpen || isDeleteDialogOpen) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 rounded-lg relative">
                      {/* Edit Button (Top Right) */}
                      <Dialog
                        open={
                          isRenameDialogOpen &&
                          selectedCaderno?.id === caderno.id
                        }
                        onOpenChange={(open) => {
                          setIsRenameDialogOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedCaderno(caderno);
                              setNewTitle(caderno.title);
                              setIsRenameDialogOpen(true);
                            }}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            aria-label="Rename"
                          >
                            <Pencil className="w-4 h-4 text-gray-500 hover:text-green-600" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-green-800">
                              Renomear Caderno
                            </DialogTitle>
                            <DialogDescription>
                              Digite o novo nome para o caderno.
                            </DialogDescription>
                          </DialogHeader>
                          <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Novo nome"
                          />
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsRenameDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="green"
                              disabled={renaming}
                              onClick={handleRename}
                            >
                              {renaming ? "Salvando" : "Salvar"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Button (Lower Right) */}
                      <Dialog
                        open={
                          isDeleteDialogOpen &&
                          selectedCaderno?.id === caderno.id
                        }
                        onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedCaderno(caderno);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="absolute bottom-4 right-4 p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-red-600">
                              Confirmar Exclusão
                            </DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir o caderno{" "}
                              <strong>{selectedCaderno?.title}</strong>? Esta
                              ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsDeleteDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              disabled={deleting}
                              onClick={handleDelete}
                            >
                              {deleting ? "Excluindo" : "Excluir"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Card Content */}
                      <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="mr-auto text-green-800 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-green-600" />
                          {caderno.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm text-gray-600">
                          {/* Current Question */}
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span>
                              Questão atual: {caderno.currentQuestion}/
                              {caderno.numberOfQuestions}
                            </span>
                          </div>

                          {/* Subjects */}
                          <div className="flex items-center gap-2">
                            <Layers className="min-w-4 max-w-4 min-h-4 max-h-4 text-gray-500" />
                            <span>
                              Disciplinas:{" "}
                              {caderno.subjects.slice(0, 10).join(" · ")}
                            </span>
                          </div>

                          {/* Created At */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>
                              Criado em:{" "}
                              {new Date(caderno.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Updated At */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>
                              Atualizado em:{" "}
                              {new Date(caderno.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCadernos.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
