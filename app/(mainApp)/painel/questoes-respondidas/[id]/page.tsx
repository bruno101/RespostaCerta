"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Star,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/rich-text-editor";
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
    maxGrade?: number;
  };
  feedback?: Feedback;
}

export default function QuestionResponsePage() {
  const { id } = useParams();
  const router = useRouter();
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
        setEditedContent(data.content);
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

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      toast.error("A resposta não pode estar vazia");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/responses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!res.ok) {
        throw new Error("Não foi possível atualizar a resposta");
      }

      const updatedResponse = await res.json();
      setResponse(updatedResponse);
      setIsEditing(false);
      toast.success("Resposta atualizada com sucesso");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar resposta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResponse = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/responses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Não foi possível excluir a resposta");
      }

      toast.success("Resposta excluída com sucesso");
      // Redirect to dashboard after successful deletion
      router.push("/painel/questoes-respondidas");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir resposta. Tente novamente.");
      setIsDeleting(false);
    }
  };

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

        <Button asChild className="mt-4">
          <Link href="/painel">Voltar ao Painel</Link>
        </Button>
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
          <div className="flex justify-between items-center">
            <CardTitle className="text-cyan-800">Sua Resposta</CardTitle>
            {response.status === "pending" && !isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-cyan-700 border-cyan-200"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-red-700 border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir resposta</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta resposta? Esta ação
                        não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteResponse}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      >
                        {isDeleting ? "Excluindo..." : "Excluir"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Tabs defaultValue="write" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="write">Editar</TabsTrigger>
                <TabsTrigger value="preview">Visualizar</TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="mt-0">
                <RichTextEditor
                  content={editedContent}
                  onChange={setEditedContent}
                  placeholder="Edite sua resposta aqui..."
                  className="h-[400px]"
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div
                  className="prose prose-slate max-w-none min-h-[200px] p-4 border rounded-md bg-muted/30"
                  dangerouslySetInnerHTML={{ __html: editedContent }}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: response.content }}
            />
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2 pt-2 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditedContent(response.content);
              }}
              disabled={isSubmitting}
              className="text-cyan-700 hover:text-cyan-400 "
            >
              Cancelar
            </Button>
            <button
              onClick={handleSaveEdit}
              disabled={isSubmitting}
              className="bg-cyan-600 text-white text-[14px] px-3 py-2 border-1 rounded-md hover:bg-cyan-400 focus:bg-cyan-400 focus:outline focus:outline-2 focus:outline-cyan-500 focus:outline-offset-1"
            >
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </button>
          </CardFooter>
        )}
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
            <p className="text-yellow-700 mt-2">
              Enquanto a resposta estiver pendente, você pode editá-la ou
              excluí-la usando os botões acima.
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
                  {response.feedback.grade}/{response.question.maxGrade || 10}
                </span>
              </div>
              <Progress
                value={
                  (response.feedback.grade /
                    (response.question.maxGrade || 10)) *
                  100
                }
                className={`h-2 bg-gray-100 ${
                  response.feedback.grade >=
                  (response.question.maxGrade || 10) * 0.7
                    ? "[--progress-foreground:theme(colors.green.500)]"
                    : response.feedback.grade >=
                      (response.question.maxGrade || 10) * 0.4
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
