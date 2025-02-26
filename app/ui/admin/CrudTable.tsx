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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "lucide-react";

export default function CrudTable({
  title,
  icon,
  headerNames,
  data,
  setData,
  editUrl,
  createUrl,
}: {
  title: string;
  icon: ReactElement<any, any>;
  headerNames: string[];
  data: any[];
  setData: any;
  editUrl: string;
  createUrl: string;
}) {
  // Sample data

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    //fetchquestions
  }, []);

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.concurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.text.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex ml-auto mr-4 mt-3">
          <p className="mt-[1px] text-cyan-700 mr-2 text-[15px]">Buscar:</p>
          <input
            type="text"
            className="border-1 p-1 rounded-sm h-7"
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
                  key={item._id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  {Object.keys(data[0]).map((itemKey: any, index) => (
                    <TableCell key={index}>
                      {truncateText(item[itemKey])}
                    </TableCell>
                  ))}
                  <TableCell>
                    <a href={`${editUrl}/${item._id}`}>
                      <button>
                        <FaEdit className="hover:text-cyan-300  text-blue-500 h-4 w-4" />
                      </button>
                    </a>
                  </TableCell>
                  <TableCell>
                    <button>
                      <FaTrash className="hover:text-cyan-300   text-blue-500 h-4 w-4" />
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
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  >Anterior</PaginationPrevious>
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
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </>
  );
}
