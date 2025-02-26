"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Card, CardContent } from "@/components/ui/card"
import IQuestion from "@/app/interfaces/IQuestion"

export function QuestionForm() {
  const [question, setQuestion] = useState<IQuestion>({
    Disciplina: "",
    Banca: "",
    Ano: "" + (new Date().getFullYear()),
    Nivel: "",
    Questao: "",
    Resposta: "",
    Criterios: "",
    TextoMotivador: "",
    Instituicao: "",
    Cargo: "",
    Codigo: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setQuestion((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setQuestion((prev) => ({ ...prev, [name]: value }))
  }

  const handleRichTextChange = (name: string, value: string) => {
    setQuestion((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Question data:", question)
    // Here you would typically send the data to your API
    alert("Question submitted successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="disciplina">Disciplina</Label>
          <Input id="disciplina" name="Disciplina" value={question.Disciplina} onChange={handleInputChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="banca">Banca</Label>
          <Input id="banca" name="Banca" value={question.Banca} onChange={handleInputChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ano">Ano</Label>
          <Input
            id="ano"
            name="Ano"
            type="number"
            min="1900"
            max="2100"
            value={question.Ano}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nivel">Nível</Label>
          <Select value={question.Nivel} onValueChange={(value) => handleSelectChange("nivel", value)}>
            <SelectTrigger id="nivel">
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fundamental">Fundamental</SelectItem>
              <SelectItem value="medio">Médio</SelectItem>
              <SelectItem value="superior">Superior</SelectItem>
              <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instituicao">Instituição</Label>
          <Input
            id="instituicao"
            name="Instituicao"
            value={question.Instituicao}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo</Label>
          <Input id="cargo" name="Cargo" value={question.Cargo} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="textoMotivador">Texto Motivador (opcional)</Label>
        <Card>
          <CardContent className="p-4">
            <RichTextEditor
              content={question.TextoMotivador || ""}
              onChange={(value: any) => handleRichTextChange("textoMotivador", value)}
              placeholder="Digite o texto motivador aqui..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="questao">Questão</Label>
        <Card>
          <CardContent className="p-4">
            <RichTextEditor
              content={question.Questao}
              onChange={(value: any) => handleRichTextChange("questao", value)}
              placeholder="Digite a questão aqui..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resposta">Resposta</Label>
        <Card>
          <CardContent className="p-4">
            <RichTextEditor
              content={question.Resposta}
              onChange={(value:any) => handleRichTextChange("resposta", value)}
              placeholder="Digite a resposta aqui..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="criterios">Critérios de Correção (opcional)</Label>
        <Card>
          <CardContent className="p-4">
            <RichTextEditor
              content={question.Criterios || ""}
              onChange={(value: any) => handleRichTextChange("criterios", value)}
              placeholder="Digite os critérios de correção aqui..."
            />
          </CardContent>
        </Card>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Salvar Questão
      </Button>
    </form>
  )
}

