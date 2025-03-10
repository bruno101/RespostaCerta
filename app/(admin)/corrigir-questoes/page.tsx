"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Clock, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface PendingResponse {
  id: string
  questionTitle: string
  questionId: string
  createdAt: string
  student: {
    id: string
    name: string
    image?: string
  }
}

interface EvaluatedResponse {
  id: string
  questionTitle: string
  questionId: string
  evaluatedAt: string
  grade: number
  maxGrade: number
  student: {
    id: string
    name: string
    image?: string
  }
}

export default function CorrectQuestionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [pendingResponses, setPendingResponses] = useState<PendingResponse[]>([])
  const [evaluatedResponses, setEvaluatedResponses] = useState<EvaluatedResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }

    if (status === "authenticated") {
      fetchResponses()
    }
  }, [status, router])

  const fetchResponses = async () => {
    try {
      setLoading(true)

      // Fetch pending responses
      const pendingRes = await fetch("/api/correction/pending")
      if (!pendingRes.ok) throw new Error("Falha ao carregar questões pendentes")
      const pendingData = await pendingRes.json()

      // Fetch evaluated responses
      const evaluatedRes = await fetch("/api/correction/evaluated")
      if (!evaluatedRes.ok) throw new Error("Falha ao carregar questões avaliadas")
      const evaluatedData = await evaluatedRes.json()

      setPendingResponses(pendingData)
      setEvaluatedResponses(evaluatedData)
    } catch (err) {
      console.error(err)
      setError("Ocorreu um erro ao carregar as questões. Por favor, tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  const filteredPendingResponses = pendingResponses.filter((response) => {
    const matchesSearch = response.questionTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || true // In a real app, filter by subject
    return matchesSearch && matchesSubject
  })

  const filteredEvaluatedResponses = evaluatedResponses.filter((response) => {
    const matchesSearch = response.questionTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || true // In a real app, filter by subject
    return matchesSearch && matchesSubject
  })

  if (status === "loading" || loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <Skeleton className="h-10 w-full mb-8" />
        </div>

        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!session || !session.user) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>Você precisa estar logado para acessar esta página.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/signin">Fazer Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Correção de Questões</h1>
        <p className="text-gray-500 mb-6">Avalie as respostas dos alunos e forneça feedback construtivo</p>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending" className="relative">
              Pendentes
              {pendingResponses.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-600 text-[10px] text-white">
                  {pendingResponses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="evaluated">Avaliadas</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título da questão..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-48">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as matérias</SelectItem>
                  <SelectItem value="direito-constitucional">Direito Constitucional</SelectItem>
                  <SelectItem value="direito-administrativo">Direito Administrativo</SelectItem>
                  <SelectItem value="direito-civil">Direito Civil</SelectItem>
                  <SelectItem value="direito-penal">Direito Penal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="pending">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Questões aguardando correção</h3>
                  <p className="text-sm text-yellow-700">
                    Estas questões foram respondidas pelos alunos e estão aguardando sua avaliação. Clique em uma
                    questão para avaliá-la.
                  </p>
                </div>
              </div>
            </div>

            {filteredPendingResponses.length === 0 ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Nenhuma questão pendente</AlertTitle>
                <AlertDescription>
                  {searchTerm || subjectFilter !== "all"
                    ? "Não encontramos questões pendentes que correspondam aos seus filtros."
                    : "Não há questões pendentes para correção no momento. Todas as questões foram avaliadas!"}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {filteredPendingResponses.map((response) => (
                  <Card key={response.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        <Link
                          href={`/corrigir-questoes/${response.id}`}
                          className="text-cyan-700 hover:text-cyan-900 hover:underline"
                        >
                          {response.questionTitle}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={response.student.image || ""} alt={response.student.name} />
                            <AvatarFallback className="bg-cyan-100 text-cyan-800">
                              {response.student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{response.student.name}</div>
                            <div className="text-xs text-gray-500">
                              Enviada em {new Date(response.createdAt).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200 self-start sm:self-center"
                        >
                          <Clock className="h-3 w-3 mr-1" /> Aguardando correção
                        </Badge>

                        <Button asChild className="bg-cyan-600 hover:bg-cyan-700 self-end sm:self-center">
                          <Link href={`/corrigir-questoes/${response.id}`}>Corrigir agora</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="evaluated">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Questões já avaliadas</h3>
                  <p className="text-sm text-green-700">
                    Estas questões já foram avaliadas por você. Você pode revisar suas avaliações ou editar o feedback
                    fornecido.
                  </p>
                </div>
              </div>
            </div>

            {filteredEvaluatedResponses.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nenhuma questão avaliada</AlertTitle>
                <AlertDescription>
                  {searchTerm || subjectFilter !== "all"
                    ? "Não encontramos questões avaliadas que correspondam aos seus filtros."
                    : "Você ainda não avaliou nenhuma questão. Comece avaliando as questões pendentes."}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {filteredEvaluatedResponses.map((response) => (
                  <Card key={response.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        <Link
                          href={`/corrigir-questoes/${response.id}`}
                          className="text-cyan-700 hover:text-cyan-900 hover:underline"
                        >
                          {response.questionTitle}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={response.student.image || ""} alt={response.student.name} />
                            <AvatarFallback className="bg-cyan-100 text-cyan-800">
                              {response.student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{response.student.name}</div>
                            <div className="text-xs text-gray-500">
                              Avaliada em {new Date(response.evaluatedAt).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>

                        <div className="font-medium text-sm">
                          Nota:{" "}
                          <span className="text-cyan-700">
                            {response.grade}/{response.maxGrade}
                          </span>
                        </div>

                        <Button
                          asChild
                          variant="outline"
                          className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 self-end sm:self-center"
                        >
                          <Link href={`/corrigir-questoes/${response.id}`}>Ver avaliação</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

