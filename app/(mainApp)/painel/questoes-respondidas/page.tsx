"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Search,
  Trash2,
  Calendar,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import IResponseSummary from "@/app/interfaces/IResponseSummary";

interface TimelineEvent {
  id: string;
  type: "submission" | "evaluation" | "edit" | "deletion";
  date: string;
  responseId: string;
  questionTitle: string;
  questionId: string;
  details?: string;
  user?: {
    name: string;
    image?: string;
  };
}

export default function QuestionResponsesPage() {
  const [responses, setResponses] = useState<IResponseSummary[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/responses");

        if (!res.ok) {
          throw new Error("Não foi possível carregar as respostas");
        }

        const data = await res.json();
        setResponses(data);

        // Generate mock timeline events based on responses
        const events: TimelineEvent[] = [];

        data.forEach((response: IResponseSummary) => {
          // Add submission event for each response
          events.push({
            id: `submission-${response.id}`,
            type: "submission",
            date: String(response.createdAt),
            responseId: response.id,
            questionTitle: response.questionTitle,
            questionId: response.questionId,
            details: "Resposta enviada com sucesso",
          });

          // Add evaluation event for graded responses
          if (response.status === "graded") {
            events.push({
              id: `evaluation-${response.id}`,
              type: "evaluation",
              date: new Date(
                new Date(response.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000
              ).toISOString(), // 2 days after submission
              responseId: response.id,
              questionTitle: response.questionTitle,
              questionId: response.questionId,
              details: `Avaliação recebida: ${response.grade}/${response.maxGrade}`,
              user: {
                name: response.evaluator?.name || "Prof. Avaliador",
                image: response.evaluator?.image || "https://i.pravatar.cc/150?u=evaluator",
              },
            });
          }

          // Add random edit events for some responses
            events.push({
              id: `edit-${response.id}`,
              type: "edit",
              date: new Date(
                new Date(response.createdAt).getTime() + 1 * 24 * 60 * 60 * 1000
              ).toISOString(), // 1 day after submission
              responseId: response.id,
              questionId: response.questionId,
              questionTitle: response.questionTitle,
              details: "Resposta editada",
            });

          // Add random deletion events for some responses
          if (response.status === "rejected" && Math.random() > 0.5) {
            events.push({
              id: `deletion-${response.id}`,
              type: "deletion",
              questionId: response.questionId,
              date: new Date(
                new Date(response.createdAt).getTime() +
                  25 * 24 * 60 * 60 * 1000
              ).toISOString(), // 25 days after submission
              responseId: response.id,
              questionTitle: response.questionTitle,
              details: "Resposta rejeitada removida",
            });
          }
        });

        // Sort events by date (newest first)
        events.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTimelineEvents(events);
      } catch (err) {
        console.error(err);
        setError(
          "Ocorreu um erro ao carregar suas respostas. Por favor, tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const filteredResponses = responses.filter((response) => {
    const matchesSearch = response.questionTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || response.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTimelineEvents = timelineEvents.filter((event) => {
    const eventText = event.questionTitle + event.type + event.details
    const matchesSearch = eventText
      .toLowerCase()
      .includes(eventSearchTerm.toLowerCase());
    const matchesStatus =
    eventFilter === "all" || event.type === eventFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="h-3 w-3 mr-1" /> Aguardando
          </Badge>
        );
      case "graded":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" /> Avaliada
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" /> Rejeitada
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "submission":
        return <FileText className="h-4 w-4 text-cyan-600" />;
      case "evaluation":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "edit":
        return <Edit className="h-4 w-4 text-amber-600" />;
      case "deletion":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "submission":
        return "border-cyan-200 bg-cyan-50";
      case "evaluation":
        return "border-green-200 bg-green-50";
      case "edit":
        return "border-amber-200 bg-amber-50";
      case "deletion":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
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
    );
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Minhas Respostas
        </h1>
        <p className="text-gray-500 mb-6">
          Visualize e acompanhe o status de todas as suas respostas enviadas
        </p>

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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Aguardando</SelectItem>
                <SelectItem value="graded">Avaliada</SelectItem>
                <SelectItem value="rejected">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredResponses.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhuma resposta encontrada</AlertTitle>
            <AlertDescription>
              {searchTerm || statusFilter !== "all"
                ? "Não encontramos respostas que correspondam aos seus filtros. Tente outros termos ou remova os filtros."
                : "Você ainda não enviou nenhuma resposta. Responda algumas questões para vê-las aqui."}
            </AlertDescription>
          </Alert>
        ) : (
          filteredResponses.map((response) => (
            <Card
              key={response.id}
              className="mb-4 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  <Link
                    href={`/painel/questoes-respondidas/${response.questionId}`}
                    className="text-cyan-700 hover:text-cyan-900 hover:underline"
                  >
                    {response.questionTitle}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(response.status)}
                    <span className="text-sm text-gray-500">
                      Enviada em{" "}
                      {new Date(response.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  {response.status === "graded" &&
                    response.grade !== undefined && (
                      <div className="font-medium">
                        Nota:{" "}
                        <span className="text-cyan-700">
                          {response.grade}/10
                        </span>
                      </div>
                    )}

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-cyan-700 hover:text-cyan-900 hover:bg-cyan-50"
                  >
                    <Link
                      href={`/painel/questoes-respondidas/${response.questionId}`}
                    >
                      Ver detalhes
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <hr className="my-8" />

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-cyan-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Linha do Tempo de Atividades
            </h2>
          </div>

          <p className="text-gray-500 mb-6">
            Acompanhe todas as atividades relacionadas às suas respostas em
            ordem cronológica
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar na linha do tempo..."
                className="pl-10"
                value={eventSearchTerm}
                onChange={(e) => setEventSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                value={eventFilter}
                onValueChange={setEventFilter}
                defaultValue="all"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar eventos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os eventos</SelectItem>
                  <SelectItem value="submission">Envios</SelectItem>
                  <SelectItem value="evaluation">Avaliações</SelectItem>
                  <SelectItem value="edit">Edições</SelectItem>
                  <SelectItem value="deletion">Exclusões</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredTimelineEvents.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum evento encontrado</AlertTitle>
            <AlertDescription>
              Não há eventos para exibir na linha do tempo. Comece a responder
              questões para ver sua atividade aqui.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="relative pl-6 border-l-2 border-gray-200 space-y-8 mb-8">
            {filteredTimelineEvents
              .map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[25px] p-2 rounded-full border-2 ${getEventColor(
                      event.type
                    )}`}
                  >
                    {getEventIcon(event.type)}
                  </div>

                  {/* Event card */}
                  <Card
                    className={`border-l-4 ${
                      event.type === "submission"
                        ? "border-l-cyan-500"
                        : event.type === "evaluation"
                        ? "border-l-green-500"
                        : event.type === "edit"
                        ? "border-l-amber-500"
                        : "border-l-red-500"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base font-medium">
                            {event.type === "submission" && "Resposta Enviada"}
                            {event.type === "evaluation" && "Resposta Avaliada"}
                            {event.type === "edit" && "Resposta Editada"}
                            {event.type === "deletion" && "Resposta Removida"}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(event.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {event.type !== "deletion" && (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-cyan-700 hover:text-cyan-900 hover:bg-cyan-50"
                          >
                            <Link
                              href={`/painel/questoes-respondidas/${event.questionId}`}
                            >
                              Ver detalhes
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium mb-2 text-gray-800">
                        {event.questionTitle}
                      </h3>

                      <p className="text-sm text-gray-600 mb-2">
                        {event.details}
                      </p>

                      {event.user && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                            {event.user.image ? (
                              <img
                                src={event.user.image || "/placeholder.svg"}
                                alt={event.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-cyan-100 text-cyan-800 text-xs font-bold">
                                {event.user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {event.user.name}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
