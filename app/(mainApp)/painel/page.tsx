"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { useUploadThing } from "@/utils/generateReactHelpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Flame,
  HelpCircle,
  MessageSquare,
  Timer,
} from "lucide-react";
import IResponseSummary from "@/app/interfaces/IResponseSummary";
import CustomButton from "@/components/ui/custom-button";
import { toast } from "sonner";
import AccountManagement from "@/app/ui/panel/AccountManagement";
import UserProfileHeader from "@/app/ui/panel/AccountHeader";

interface UserStats {
  questionsAnswered: number;
  commentsPosted: number;
  timeSpentMinutes: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
  progressToNextLevel: number;
}

export default function DashboardPage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    questionsAnswered: 0,
    commentsPosted: 0,
    timeSpentMinutes: 0,
    currentStreak: 0,
    totalPoints: 0,
    level: 1,
    progressToNextLevel: 0,
  });
  const [responses, setResponses] = useState<IResponseSummary[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<
    boolean | undefined
  >();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      // Fetch user statistics
      const statsRes = await fetch("/api/users/stats");
      const statsData = await statsRes.json();

      // Fetch user responses
      const responsesRes = await fetch("/api/responses");
      const responsesData = await responsesRes.json();

      // Set the data
      setStats(statsData);
      setResponses(responsesData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.email}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      signOut();
      // Sign out and redirect to home page
      router.push("/");
      toast.success("Conta deletada", {
        description: "A sua conta foi deletada com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Erro deletando conta", {
        description: "Ocorreu um erro a sua conta.",
      });
    } finally {
      setDeleteDialogOpen(false);
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

  if (status === "loading" || isLoading) {
    return (
      <div className="container py-8 mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-72 mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>

        <Skeleton className="h-10 w-48 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você precisa estar logado para acessar esta página.
          </AlertDescription>
        </Alert>
        <Link href="/signin">
          <CustomButton className="mt-4" bgColor="cyan">
            Fazer Login
          </CustomButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 mx-auto">
      <UserProfileHeader
        handleDeleteAccount={handleDeleteAccount}
        update={update}
        session={session}
        router={router}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
      {/* User Level and Progress */}
      <Card className="mb-8 border-t-4 border-t-cyan-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-cyan-800">Seu Progresso</CardTitle>
          <CardDescription>
            Continue respondendo questões para subir de nível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">Nível {stats.level}</div>
            <div className="text-sm text-muted-foreground">
              {stats.progressToNextLevel}% para o próximo nível
            </div>
          </div>
          <Progress value={stats.progressToNextLevel} className="h-2" />

          <div className="mt-4 text-sm text-muted-foreground">
            Total de pontos:{" "}
            <span className="font-medium text-cyan-700">
              {stats.totalPoints}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-cyan-50 to-white border-cyan-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-600" />
              Questões Respondidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900">
              {stats.questionsAnswered}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-white border-cyan-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-800 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-600" />
              Comentários Postados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900">
              {stats.commentsPosted}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-white border-cyan-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-800 flex items-center gap-2">
              <Timer className="h-4 w-4 text-cyan-600" />
              Tempo de Estudo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900">
              {Math.floor(stats.timeSpentMinutes / 60)}h{" "}
              {stats.timeSpentMinutes % 60}m
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-white border-cyan-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-800 flex items-center gap-2">
              <Flame className="h-4 w-4 text-cyan-600" />
              Streak Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900">
              {stats.currentStreak} dias
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="respostas" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="respostas">Minhas Respostas</TabsTrigger>
          <TabsTrigger value="atividade">Atividade Recente</TabsTrigger>
        </TabsList>

        <TabsContent value="respostas">
          <Link href="/painel/questoes-respondidas">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Suas Respostas
            </h2>
          </Link>

          {responses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <HelpCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma resposta encontrada
                  </h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    Você ainda não respondeu nenhuma questão. Comece a responder
                    para acompanhar seu progresso.
                  </p>
                  <Link href="/questoes">
                    <CustomButton bgColor="cyan">
                      Ver Questões Disponíveis
                    </CustomButton>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {responses.slice(0, 5).map((response) => (
                <Card
                  key={response.id}
                  className="hover:shadow-md transition-shadow"
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
                          {new Date(response.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>

                      {response.status === "graded" &&
                        response.grade !== undefined && (
                          <div className="font-medium">
                            Nota:{" "}
                            <span className="text-cyan-700">
                              {response.grade}/{response.maxGrade}
                            </span>
                          </div>
                        )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-cyan-700 hover:text-cyan-900 hover:bg-cyan-50"
                    >
                      <Link
                        href={`/painel/questoes-respondidas/${response.questionId}`}
                      >
                        Ver detalhes
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {responses.length > 5 && (
                <div className="flex justify-center mt-6">
                  <Button asChild variant="outline">
                    <Link href="/painel/questoes-respondidas">
                      Ver todas as respostas ({responses.length})
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="atividade">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Atividade Recente
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="relative pl-6 border-l border-gray-200 space-y-6">
                {responses.length > 0 ? (
                  responses.slice(0, 5).map((response, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[29px] p-1 bg-white rounded-full border border-gray-200">
                        {response.status === "graded" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="mb-1 text-sm text-gray-500">
                        {new Date(response.createdAt).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                      <div className="text-base font-medium">
                        {response.status === "graded"
                          ? "Resposta avaliada"
                          : "Resposta enviada"}
                      </div>
                      <div className="mt-1">
                        <Link
                          href={`/painel/questoes-respondidas/${response.questionId}`}
                          className="text-sm text-cyan-700 hover:text-cyan-900 hover:underline"
                        >
                          {response.questionTitle}
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">
                      Nenhuma atividade recente para mostrar.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Management */}
      <AccountManagement
        update={update}
        session={session}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
