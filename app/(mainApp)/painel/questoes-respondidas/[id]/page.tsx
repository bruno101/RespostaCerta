"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock, FileText, Star } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Feedback {
  grade: number;
  comment: string;
  createdAt: string;
  evaluatedBy: {
    name: string;
    image?: string;
  };
}

interface Response {
  id: string;
  content: string;
  status: "pending" | "graded" | "rejected";
  createdAt: string;
  question: {
    id: string;
    title: string;
    content: string;
  };
  feedback?: Feedback;
}

export default function QuestionResponsePage() {
  const { id } = useParams();
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/responses/${id}`);

        if (!res.ok) {
          throw new Error("Não foi possível carregar os dados da resposta");
        }

        const data = await res.json();
        setResponse(data);
      } catch (err) {
        console.error(err);
        setError(
          "Ocorreu um erro ao carregar os dados da resposta. Por favor, tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResponse();
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="h-3 w-3 mr-1" /> Aguardando avaliação
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

  if (loading) {
    return (
      <div className="container max-w-4xl py-8 mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/4" />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-7 w-40 mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40 mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <button
          className="flex text-white px-3 py-2 rounded-lg font-bold text-[15px] gap-2 mt-3 bg-cyan-700 hover:bg-[#0891b2] focus:bg-[#0891b2] focus:outline focus:outline-cyan-300 focus:outline-offset-1"
        >
          <Link href="/painel">Voltar ao Painel</Link>
        </button>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="container max-w-4xl py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Resposta não encontrada</AlertTitle>
          <AlertDescription>
            Não foi possível encontrar a resposta solicitada. Verifique se o ID
            está correto.
          </AlertDescription>
        </Alert>

        <Button asChild className="mt-4">
          <Link href="/painel">Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 w-full mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Resposta à Questão
        </h1>
        <div className="flex items-center gap-3">
          {getStatusBadge(response.status)}
          <span className="text-sm text-gray-500">
            Enviada em{" "}
            {new Date(response.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <Card className="mb-8 border-t-4 border-t-cyan-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-800">
            <FileText className="h-5 w-5" />
            Questão Original
          </CardTitle>
          <CardDescription>
            <Link
              href={`/questoes/${response.question.id}`}
              className="text-cyan-600 hover:text-cyan-800 hover:underline"
            >
              Ver questão completa
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-3">
            {response.question.title}
          </h3>
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: response.question.content }}
          />
        </CardContent>
      </Card>

      <Card className="mb-8 border-t-4 border-t-cyan-500">
        <CardHeader>
          <CardTitle className="text-cyan-800">Sua Resposta</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: response.content }}
          />
        </CardContent>
      </Card>

      {response.status === "pending" ? (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Aguardando Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              Sua resposta ainda está sendo avaliada. Você receberá uma
              notificação quando a avaliação for concluída.
            </p>
          </CardContent>
        </Card>
      ) : response.status === "graded" && response.feedback ? (
        <Card className="border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Avaliação e Feedback
            </CardTitle>
            <CardDescription>
              Avaliado por {response.feedback.evaluatedBy.name} em{" "}
              {new Date(response.feedback.createdAt).toLocaleDateString(
                "pt-BR"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Nota:</span>
                <span className="font-bold text-lg">
                  {response.feedback.grade}/10
                </span>
              </div>
              <Progress
                value={(response.feedback.grade / 10) * 100}
                className={`h-2 bg-gray-100 ${
                  response.feedback.grade >= 10 * 0.7
                    ? "[--progress-foreground:theme(colors.green.500)]"
                    : response.feedback.grade >= 10 * 0.4
                    ? "[--progress-foreground:theme(colors.yellow.500)]"
                    : "[--progress-foreground:theme(colors.red.500)]"
                }`}
              />
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="font-medium mb-2">Comentários do Avaliador:</h4>
              <div className="bg-gray-50 p-4 rounded-md border">
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: response.feedback.comment,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Resposta Rejeitada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Sua resposta foi rejeitada. Entre em contato com o suporte para
              mais informações.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
