"use client";

import { type ReactElement, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CrudTable({
  title,
  icon,
  headerNames,
  data,
  setData,
  columns,
  editUrl,
  createUrl,
  deleteUrl,
  truncatedDataWordLimit,
}: {
  title: string;
  icon: ReactElement<any, any>;
  headerNames: string[];
  data: any[];
  setData: any;
  columns: string[];
  editUrl: string;
  createUrl: string;
  deleteUrl: string;
  truncatedDataWordLimit?: number[];
}) {
  // Sample data

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deleting, setDeleting] = useState<boolean>();

  async function handleDelete(_id: string) {
    try {
      setDeleting(true);
      const response = await fetch(`/api/${deleteUrl}/${_id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("Erro deletando questão.");
      } else {
        setData((prev: { _id: string }[]) => {
          return [...prev].filter((item) => item._id != _id);
        });
      }
    } catch {
      console.log("Erro deletando questão.");
    } finally {
      setDeleting(false);
    }
  }

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.concurso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Truncate text to fit in table cell
  const truncateText = (text: string, maxLength = 50) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
  };

  return (
    <>
      <div className="flex pt-3 px-3 text-cyan-700">
        {icon}
        <h1 className="-mt-[5px] ml-1 text-xl">{title}</h1>
        <p className="mt-[5px] ml-2 text-xs text-cyan-400">
          Criar, Ler, Atualizar, Deletar
        </p>
      </div>
      <div className="mt-4 w-[95%] ml-auto mr-auto flex flex-col bg-white rounded-sm border-t-4 shadow-md">
        <div className="flex w-full mt-1">
          <h2 className="ml-4 mt-2 text-cyan-400">{title}</h2>
          <a href={createUrl} className="ml-auto mr-4">
            <button className="hover:bg-cyan-300 focus:bg-cyan-300 focus:outline focus:outline-2 focus:outline-cyan-500 bg-cyan-500 text-white text-[15px] rounded-sm mt-2 py-1 px-3">
              Criar {title.toLowerCase()}
            </button>
          </a>
        </div>
        <hr className="mt-3 border-slate-100"></hr>
        <div className="flex mr-4 mt-3">
          <div className="flex ml-4 mr-1 w-[35%] text-cyan-700 items-center gap-2">
            <span className="text-sm">Itens por página:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="max-w-[60px] h-7">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="text-cyan-700 focus:text-cyan-400"
                  value="5"
                >
                  5
                </SelectItem>
                <SelectItem
                  className="text-cyan-700 focus:text-cyan-400"
                  value="10"
                >
                  10
                </SelectItem>
                <SelectItem
                  className="text-cyan-700 focus:text-cyan-400"
                  value="20"
                >
                  20
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="ml-auto mt-[6px] text-cyan-700 mr-2 text-[14px]">
            Buscar:
          </p>
          <input
            type="text"
            className="mt-[5px] border-1 p-1 rounded-sm h-7 w-[100px] sm:w-[150px] md:w-[220px] lg:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                {headerNames.map((item, index) => (
                  <TableHead className="font-bold" key={index}>
                    {item}
                  </TableHead>
                ))}
                <TableHead className="font-bold w-[100px]">Editar</TableHead>
                <TableHead className="font-bold w-[100px]">Deletar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  {columns.map((itemKey: any, innerIndex) => {
                    return (
                      <TableCell key={innerIndex}>
                        {truncatedDataWordLimit
                          ? truncateText(
                              item[itemKey] ? item[itemKey] : "",
                              truncatedDataWordLimit[innerIndex]
                            )
                          : truncateText(item[itemKey])}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <a href={`${editUrl}/${item._id}`}>
                      <button>
                        <FaEdit className="hover:text-cyan-300  text-blue-500 h-4 w-4" />
                      </button>
                    </a>
                  </TableCell>
                  <TableCell>
                    <button
                      disabled={deleting}
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrash className="hover:text-cyan-300 my-auto  text-blue-500 h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, filteredData.length)} de{" "}
              {filteredData.length} entradas
            </p>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex border-0 shadow-white hover:bg-white items-center gap-1 ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
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
                      className="lucide lucide-chevron-left"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Anterior
                  </Button>
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        className={
                          currentPage === pageNumber
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={currentPage === totalPages}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex border-0 shadow-white hover:bg-white items-center gap-1 ${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
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
        </div>
      </div>
    </>
  );
}
