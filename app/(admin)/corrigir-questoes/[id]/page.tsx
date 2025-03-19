"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Save,
  Star,
  User,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RichTextEditor } from "@/components/rich-text-editor";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ResponseDetails from "@/app/interfaces/IResponseDetails";
import CustomButton from "@/components/ui/custom-button";

export default function CorrectQuestionPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [response, setResponse] = useState<ResponseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [grade, setGrade] = useState<number>(0);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackPlainText, setFeedbackPlainText] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    if (status === "authenticated" && id) {
      fetchResponseDetails();
    }
  }, [status, router, id]);

  const fetchResponseDetails = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/correction/${id}`);

      if (!res.ok) {
        throw new Error("Não foi possível carregar os detalhes da resposta");
      }

      const data = await res.json();
      setResponse(data);

      // If already graded, set initial form values
      if (data.feedback) {
        setGrade(data.feedback.grade);
        setFeedbackContent(data.feedback.comment);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Ocorreu um erro ao carregar os detalhes da resposta. Por favor, tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!response) return;

    if (grade < 0 || grade > response.question.maxGrade) {
      toast.error(
        `A nota deve estar entre 0 e ${response.question.maxGrade}.`,
        {
          description: "Por favor, insira um valor válido.",
        }
      );
      return;
    }

    if (!feedbackPlainText.trim()) {
      toast.error("Feedback obrigatório", {
        description: "Por favor, forneça um feedback para o aluno.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`/api/correction/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade,
          comment: feedbackContent,
        }),
      });

      if (!res.ok) {
        throw new Error("Falha ao enviar feedback");
      }

      toast.success("Feedback enviado com sucesso", {
        description: "O aluno será notificado sobre sua avaliação.",
      });

      // Update local state to reflect the changes
      setResponse((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          status: "graded",
          feedback: {
            grade,
            comment: feedbackContent,
            createdAt: new Date().toISOString(),
            evaluatedBy: {
              name: session?.user?.name || "Avaliador",
              email: session?.user?.email || "",
              image: session?.user?.image || "",
            },
          },
        };
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar feedback", {
        description:
          "Ocorreu um erro ao enviar o feedback. Por favor, tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container py-8 mx-auto px-4">
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
      <div className="container py-8 mx-auto px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link href="/corrigir-questoes">
          <button className="mt-4 px-3 py-2 text-[14px] text-white rounded-md bg-cyan-600 hover:bg-cyan-400 focus:bg-cyan-400 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cyan-600">
            Voltar
          </button>
        </Link>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="container py-8 mx-auto px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para acessar esta página.
          </AlertDescription>
        </Alert>
        <Link href="/signin">
          <CustomButton bgColor="cyan" className="mt-4">
            Fazer Login{" "}
          </CustomButton>
        </Link>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="container py-8 mx-auto px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Resposta não encontrada</AlertTitle>
          <AlertDescription>
            Não foi possível encontrar a resposta solicitada. Verifique se o ID
            está correto.
          </AlertDescription>
        </Alert>

        <Button asChild className="mt-4">
          <Link href="/corrigir-questoes">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto px-4">
      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="mb-4 -ml-3 text-gray-600 hover:text-gray-900"
        >
          <Link href="/corrigir-questoes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-cyan-900 mb-2">
          Correção de Questão
        </h1>

        <div className="flex items-center gap-3">
          {response.status === "pending" ? (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              <Clock className="h-3 w-3 mr-1" /> Aguardando correção
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle className="h-3 w-3 mr-1" /> Avaliada
            </Badge>
          )}
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

      {/* Student Info */}
      <Card className="mb-8 border-t-4 border-t-cyan-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-cyan-800">
            <User className="h-5 w-5" />
            Informações do Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={response.student.image || ""}
                alt={response.student.name}
              />
              <AvatarFallback className="bg-cyan-100 text-cyan-800">
                {response.student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">
                {response.student.name}
              </h3>
              <p className="text-sm text-gray-500">{response.student.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-8 border-t-4 border-t-cyan-500">
        <CardHeader>
          <Link href={`/questoes/${response.question.id}`}>
            <CardTitle className="flex items-center gap-2 text-cyan-800">
              <FileText className="h-5 w-5" />
              Questão Original
            </CardTitle>
          </Link>
          <CardDescription>
            {response.question.banca && (
              <span className="text-sm">
                {response.question.banca}{" "}
                {response.question.ano && `• ${response.question.ano}`}{" "}
                {response.question.instituicao &&
                  `• ${response.question.instituicao}`}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-3">
            {response.question.title}
          </h3>
          <div
            className="rich-text-editor prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: response.question.content }}
          />
        </CardContent>
      </Card>

      {/* Student's Response */}
      <Card className="mb-8 border-t-4 border-t-cyan-500">
        <CardHeader>
          <CardTitle className="text-cyan-800">Resposta do Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="rich-text-editor prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: response.content }}
          />
        </CardContent>
      </Card>

      {/* Feedback Form or Display */}
      <Card className="mb-8 border-t-4 border-t-green-500">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {response.feedback ? "Feedback Fornecido" : "Fornecer Feedback"}
          </CardTitle>
          {response.feedback && (
            <CardDescription>
              Avaliado por {response.feedback.evaluatedBy.name} em{" "}
              {new Date(response.feedback.createdAt).toLocaleDateString(
                "pt-BR"
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {response.feedback ? (
            // Display existing feedback
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Nota:</span>
                  <span className="font-bold text-lg">
                    {response.feedback.grade}/{response.question.maxGrade}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      response.feedback.grade >=
                      response.question.maxGrade * 0.7
                        ? "bg-green-500"
                        : response.feedback.grade >=
                          response.question.maxGrade * 0.4
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${
                        (response.feedback.grade / response.question.maxGrade) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-medium mb-2">Comentários do Avaliador:</h4>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div
                    className="rich-text-editor prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: response.feedback.comment,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  asChild
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  <Link href={`/corrigir-questoes/${id}/editar`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Avaliação
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            // Feedback form
            <div>
              <div className="mb-6">
                <Label
                  htmlFor="grade"
                  className="text-base font-medium mb-2 block"
                >
                  Nota (0-{response.question.maxGrade})
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="grade"
                    type="number"
                    min={0}
                    max={response.question.maxGrade}
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="w-10 text-gray-500">
                    / {response.question.maxGrade}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="mb-6">
                <Label
                  htmlFor="feedback"
                  className="text-base font-medium mb-2 block"
                >
                  Feedback para o Aluno
                </Label>

                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-2">
                    <TabsTrigger value="write">Escrever</TabsTrigger>
                    <TabsTrigger value="preview">Visualizar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="mt-0">
                    <RichTextEditor
                      content={feedbackContent}
                      onChange={setFeedbackContent}
                      setPlainText={setFeedbackPlainText}
                      placeholder="Escreva seu feedback aqui..."
                      className="min-h-[200px]"
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <div
                      className="rich-text-editor prose prose-slate max-w-none min-h-[200px] p-4 border rounded-md bg-muted/30"
                      dangerouslySetInnerHTML={{ __html: feedbackContent }}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={submitting}
                  className="gap-2 flex text-white rounded-md px-3 py-2 bg-green-600 disabled:opacity-50 hover:bg-green-700 focus:bg-green-700 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-green-900"
                >
                  <Save className="my-auto h-4 w-4" />
                  {submitting ? "Enviando avaliação..." : "Enviar avaliação"}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
