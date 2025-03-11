"use client";

import type React from "react";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Card, CardContent } from "@/components/ui/card";
import type IQuestion from "@/app/interfaces/IQuestion";
import Link from "next/link";
import type ISelector from "@/app/interfaces/ISelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { updateFilter } from "@/app/actions/updateFilter";
import Selector from "./Selector";

let initialQuestion: IQuestion = {
  Disciplina: "",
  Banca: "",
  Ano: "" + new Date().getFullYear(),
  Nivel: "",
  Questao: "",
  Numero: undefined,
  Resposta: "",
  Criterios: "",
  TextoMotivador: "",
  Instituicao: "",
  Cargo: "",
  Codigo: "",
  TextoPlano: "",
  Dificuldade: "",
};

export function QuestionForm({
  setPreview,
  filters,
  edit,
  initialQuestionValues,
}: {
  setPreview: Dispatch<SetStateAction<string>>;
  filters: ISelector[];
  edit: boolean;
  initialQuestionValues?: IQuestion;
}) {
  if (initialQuestionValues) {
    initialQuestion = initialQuestionValues;
  }
  const [parser, setParser] = useState<DOMParser | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setParser(new DOMParser());
    }
  }, []);
  function strip(html: string) {
    let doc = parser?.parseFromString(html, "text/html");
    return doc?.body.textContent || "";
  }
  const [question, setQuestion] = useState<IQuestion>({ ...initialQuestion });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [createdQuestionLink, setCreatedQuestionLink] = useState<string>("");
  const [messageCount, setMessageCount] = useState(0);
  const divRef = useRef<HTMLDivElement | null>(null);
  const successDivRef = useRef<HTMLDivElement | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [currentField, setCurrentField] = useState<{
    name: string;
    displayName: string;
  }>({ name: "", displayName: "" });

  // Custom options state
  const [customOptions, setCustomOptions] = useState<Record<string, string[]>>(
    {}
  );

  const TextoPlano =
    strip(question.TextoMotivador || "") +
    strip(question.Questao || "") +
    strip(question.Resposta || "");

  let textoMotivador = "";
  if (question.TextoMotivador) {
    textoMotivador +=
      "<div style='padding-left: 20px; padding-right: 20px;'>" +
      question.TextoMotivador +
      "<hr style='margin-top: 20px; margin-bottom: 20px;'/>" +
      "</div>";
  }
  let criteriosCorrecao = "";
  if (question.Criterios) {
    criteriosCorrecao +=
      "<div style='margin-bottom: 20px'></div>" + question.Criterios;
  }
  const questionContent =
    "<div>" +
    textoMotivador +
    question.Questao +
    "<div style='margin-bottom: 20px'></div>" +
    question.Resposta +
    criteriosCorrecao +
    "</div>";

  const handleSelectChange = (name: keyof IQuestion, value: string) => {
    value && setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleRichTextChange = (name: string, value: string) => {
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const openAddOptionModal = (
    fieldName: keyof IQuestion,
    displayName: string
  ) => {
    setCurrentField({ name: fieldName, displayName });
    setNewOptionValue("");
    setModalOpen(true);
  };

  const handleAddOption = () => {
    if (!newOptionValue.trim()) return;
    if (
      filters
        .find((filter) => filter.name === currentField.name)
        ?.options.includes(newOptionValue)
    )
      return;

    // Add the new option to our custom options
    setCustomOptions((prev) => ({
      ...prev,
      [currentField.name]: [...(prev[currentField.name] || []), newOptionValue],
    }));

    // Select the new option
    handleSelectChange(currentField.name as keyof IQuestion, newOptionValue);

    // Close the modal
    setModalOpen(false);
  };

  useEffect(() => {
    if (error && divRef.current) {
      const yOffset = -40;
      const y =
        divRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
    if (createdQuestionLink && successDivRef.current) {
      const yOffset = -40;
      const y =
        successDivRef.current.getBoundingClientRect().top +
        window.scrollY +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [error, createdQuestionLink, messageCount]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const q: IQuestion = { ...question, TextoPlano };
    let customOptionsToAdd: ISelector[] = [];
    for (let key in customOptions) {
      const valueArray = customOptions[key];
      for (let value of valueArray) {
        if (value === q[key as keyof IQuestion]) {
          customOptionsToAdd.push({ name: key, options: [value] });
        }
      }
    }
    try {
      let needsToUpdateFilters = false;
      if (customOptionsToAdd.length > 0) {
        needsToUpdateFilters = true;
        const updateResponse = await updateFilter(customOptionsToAdd);
        if (!updateResponse || !updateResponse.success) {
          setCreatedQuestionLink("");
          setError("Erro " + edit ? "editando" : "criando" + " questão.");
          setMessageCount((m) => m + 1);
        } else {
          needsToUpdateFilters = false;
        }
      }
      if (!needsToUpdateFilters) {
        const response = await fetch(
          `/api/questions${edit && "/" + question.Codigo}`,
          {
            method: edit ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(q),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setCreatedQuestionLink("");
          setError("Erro " + edit ? "editando" : "criando" + " questão.");
          setMessageCount((m) => m + 1);
        } else {
          setError("");
          setCreatedQuestionLink(`/questoes/${data.Codigo}`);
          !edit && setQuestion({ ...initialQuestion });
          // setCustomValues({})
          setMessageCount((m) => m + 1);
        }
      }
    } catch (error) {
      console.error("Error creating question:", error);
      setCreatedQuestionLink("");
      setError("Erro " + edit ? "editando" : "criando" + " questão.");
      setMessageCount((m) => m + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div
        ref={divRef}
        className={`${
          !error && "hidden"
        } bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4`}
      >
        {error}
      </div>

      <div
        ref={successDivRef}
        className={`${
          !createdQuestionLink && "hidden"
        } bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-4`}
      >
        <Link href={createdQuestionLink}>
          <u>Questão</u>
        </Link>
        {edit ? " editada " : " criada "}com sucesso!
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filters.map((filter, index) => {
          let noSpecialCharacterName = filter.name;
          switch (filter.name) {
            case "Instituição": {
              noSpecialCharacterName = "Instituicao";
              break;
            }
            case "Nível": {
              noSpecialCharacterName = "Nivel";
              break;
            }
          }

          return (
            <div className="space-y-2" key={index}>
              <Label htmlFor={filter.name} className="text-cyan-700">
                {filter.name} <span className="text-red-400">*</span>
              </Label>
              <Selector
                filter={filter}
                openAddOptionModal={openAddOptionModal}
                handleSelectChange={handleSelectChange}
                customOptions={customOptions}
                question={question}
                noSpecialCharacterName={noSpecialCharacterName}
              />
            </div>
          );
        })}
        <div className="space-y-2">
          <Label htmlFor="Numero" className="text-cyan-700">
            Número da Questão
          </Label>
          <Input
            name="Numero"
            placeholder="n/a"
            value={question.Numero}
            type="number"
            onChange={(e) =>
              setQuestion((q) => {
                return { ...q, Numero: e.target.value };
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="textoMotivador" className="text-cyan-700">
          Texto Motivador
        </Label>
        <Card>
          <CardContent className="p-4">
            <RichTextEditor
              content={question.TextoMotivador || ""}
              onChange={(value: any) =>
                handleRichTextChange("TextoMotivador", value)
              }
              placeholder="Digite o texto motivador aqui..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="questao" className="text-cyan-700">
          Questão <span className="text-red-400">*</span>
        </Label>
        <Card>
          <CardContent className="p-4">
            <RichTextEditor
              content={question.Questao}
              onChange={(value: any) => handleRichTextChange("Questao", value)}
              placeholder="Digite a questão aqui..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resposta" className="text-cyan-700">
          Resposta <span className="text-red-400">*</span>
        </Label>
        <Card>
          <CardContent className="p-4">
            <RichTextEditor
              content={question.Resposta}
              onChange={(value: any) => handleRichTextChange("Resposta", value)}
              placeholder="Digite a resposta aqui..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="criterios" className="text-cyan-700">
          Critérios de Correção
        </Label>
        <Card>
          <CardContent className="p-4">
            <RichTextEditor
              content={question.Criterios || ""}
              onChange={(value: any) =>
                handleRichTextChange("Criterios", value)
              }
              placeholder="Digite os critérios de correção aqui..."
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex">
        <button
          type="submit"
          disabled={isSubmitting}
          className="disabled:opacity-50 hover:bg-cyan-300 focus:bg-cyan-300 focus:outline focus:outline-2 focus:outline-cyan-500 bg-cyan-500 text-white text-[15px] rounded-sm mt-2 py-1 px-3"
        >
          {edit
            ? isSubmitting
              ? "Editando Questão..."
              : "Editar Questão"
            : isSubmitting
            ? "Salvando Questão..."
            : "Salvar Questão"}
        </button>
        <button
          className="ml-4 hover:bg-cyan-300 focus:bg-cyan-300 focus:outline focus:outline-2 focus:outline-cyan-500 border-cyan-500 text-cyan-700 border-1 text-[15px] rounded-sm mt-2 py-1 px-3"
          type="button"
          onClick={() => {
            setPreview(questionContent);
          }}
        >
          Mostrar Prévia
        </button>
      </div>

      {/* Add Option Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-cyan-800">
              Adicionar {currentField.displayName}
            </DialogTitle>
            <DialogDescription>
              Digite o novo valor para adicionar à lista de opções.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newOption" className="text-cyan-600 text-right">
                Valor
              </Label>
              <Input
                id="newOption"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                className="col-span-3"
                type={currentField.name === "Ano" ? "number" : ""}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="border-cyan-400 text-cyan-600 hover:bg-cyan-200 hover:text-cyan-800"
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="border-cyan-200 bg-cyan-600 text-white hover:bg-cyan-400 hover:text-cyan-800"
              type="button"
              variant="outline"
              onClick={handleAddOption}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
