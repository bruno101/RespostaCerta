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
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import IResponseDetails from "@/app/interfaces/IResponseDetails";

export default function EditEvaluationPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [response, setResponse] = useState<IResponseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const validateForm = () => {
    if (!response) return false;

    if (grade < 0 || grade > response.question.maxGrade) {
      toast.error(
        `A nota deve estar entre 0 e ${response.question.maxGrade}.`,
        {
          description: "Por favor, insira um valor válido.",
        }
      );
      return false;
    }

    if (!feedbackPlainText.trim()) {
      toast.error("Feedback obrigatório", {
        description: "Por favor, forneça um feedback para o aluno.",
      });
      return false;
    }

    return true;
  };

  const handleSubmitFeedback = async () => {
    setIsConfirming(true);
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const res = await fetch(`/api/correction/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade,
          comment: feedbackContent,
        }),
      });

      if (!res.ok) {
        throw new Error("Falha ao atualizar feedback");
      }

      toast.success("Feedback atualizado com sucesso", {
        description:
          "O aluno será notificado sobre a atualização da avaliação.",
      });

      // Redirect back to the response page
      router.push(`/corrigir-questoes/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar feedback", {
        description:
          "Ocorreu um erro ao atualizar o feedback. Por favor, tente novamente.",
      });
    } finally {
      setSubmitting(false);
      setShowConfirmDialog(false);
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
          <button className="mt-4 px-3 py-2 text-[14px] text-white rounded-md bg-cyan-600 hover:bg-cyan-400 focus:bg-cyan-400 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cyan-600">
            Fazer login
          </button>
        </Link>
      </div>
    );
  }

  // Check if user has permission (admin or corretor)
  const userRole = (session.user as any).role;
  if (userRole !== "admin" && userRole !== "corretor") {
    return (
      <div className="container py-8 mx-auto px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Você não tem permissão para editar avaliações.
          </AlertDescription>
        </Alert>
        <Link href="/painel">
          <button className="mt-4 px-3 py-2 text-[14px] text-white rounded-md bg-cyan-600 hover:bg-cyan-400 focus:bg-cyan-400 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cyan-600">
            Voltar ao Painel
          </button>
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

        <Link href="/corrigir-questoes">
          <button className="mt-4 px-3 py-2 text-[14px] text-white rounded-md bg-cyan-600 hover:bg-cyan-400 focus:bg-cyan-400 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cyan-600">
            Voltar
          </button>
        </Link>
      </div>
    );
  }

  if (response.status !== "graded" || !response.feedback) {
    return (
      <div className="container py-8 mx-auto px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Avaliação não encontrada</AlertTitle>
          <AlertDescription>
            Esta resposta ainda não foi avaliada. Você precisa avaliá-la
            primeiro antes de editar.
          </AlertDescription>
        </Alert>

        <Link href={`/corrigir-questoes/${id}`}>
          <button className="mt-4 px-3 py-2 text-[14px] text-white rounded-md bg-cyan-600 hover:bg-cyan-400 focus:bg-cyan-400 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cyan-600">
            Avaliar Resposta
          </button>
        </Link>
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
          <Link href={`/corrigir-questoes/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para resposta
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Editar Avaliação
        </h1>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" /> Avaliada
          </Badge>
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
          <CardTitle className="flex items-center gap-2 text-cyan-800">
            <FileText className="h-5 w-5" />
            Questão Original
          </CardTitle>
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

      {/* Edit Feedback Form */}
      <Card className="mb-8 border-t-4 border-t-green-500">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Editar Feedback
          </CardTitle>
          <CardDescription>
            Avaliado originalmente por {response.feedback.evaluatedBy.name} em{" "}
            {new Date(response.feedback.createdAt).toLocaleDateString("pt-BR")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="grade" className="text-base font-medium mb-2 block">
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
              <span className="text-gray-500">
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
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/corrigir-questoes/${id}`)}
            disabled={submitting}
          >
            Cancelar
          </Button>

          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
          >
            <AlertDialogTrigger asChild>
              <button
                disabled={submitting}
                onClick={() => {
                  if (validateForm()) {
                    setShowConfirmDialog(true);
                  }
                }}
                className="flex disabled:opacity-50 mt-4 px-3 py-2 text-[14px] text-white rounded-md bg-green-600 hover:bg-green-400 focus:bg-green-400 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-green-600"
              >
                <Save className="h-4 w-4 mr-2 my-auto" />
                {submitting
                  ? "Atualizando avaliação..."
                  : "Atualizar avaliação"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar atualização</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja atualizar esta avaliação? O aluno será
                  notificado sobre as alterações.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>

                <button
                  onClick={handleSubmitFeedback}
                  disabled={isConfirming}
                  className="disabled:opacity-50 px-3 py-2 text-[14px] text-white rounded-md bg-green-600 hover:bg-green-400 focus:bg-green-400 focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-green-600"
                >
                  Confirmar
                </button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
