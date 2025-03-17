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
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/utils/uploadthing";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Flame,
  HelpCircle,
  LogOut,
  MessageSquare,
  Timer,
  Trash,
  Trash2,
  Trash2Icon,
  TrashIcon,
  Upload,
  User,
} from "lucide-react";
import IResponseSummary from "@/app/interfaces/IResponseSummary";
import CustomButton from "@/components/ui/custom-button";
import { toast } from "sonner";

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
  const [deleteImage, setDeleteImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean | undefined>();
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (data) => {
      const uploadData = data[0];
      const imageUrl = uploadData?.serverData?.imageUrl;
      if (session?.user) {
        const newSession = {
          ...session,
          user: {
            ...session.user,
            image: imageUrl,
          },
        };
        await update({ ...newSession });
        setUploadingImage(false);
        setImageDialogOpen(false);
        toast.success("Imagem atualizada", {
          description: "A sua foto de perfil foi atualizada com sucesso.",
        });
        router.refresh();
      } else {
        toast.error("Erro atualizando imagem", {
          description: "Por favor tente novamente.",
        });
      }
    },
    onUploadError: () => {
      setUploadingImage(false);
      setImageDialogOpen(false);
      toast.error("Erro atualizando imagem", {
        description: "Por favor tente novamente.",
      });
    },
    onUploadBegin: (file) => {},
  });

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

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setDeleteImage(false);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      if (session?.user) {
        const response = await fetch(
          `/api/users/${session?.user?.email}/profile-picture`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete account");
        }
        const newSession = {
          ...session,
          user: {
            ...session.user,
            image: "",
          },
        };
        await update({ ...newSession });
        setImageDialogOpen(false);
        toast.success("Imagem deletada", {
          description: "A sua foto de perfil foi deletada com sucesso.",
        });
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro deletando imagem", {
        description: "Ocorreu um erro ao deletarmos foto de perfil.",
      });
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
      {/* User Profile Header */}
      <div className="mx-auto flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-white shadow-md">
            <AvatarImage
              src={
                session.user.image ||
                "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
              }
              alt={session.user.name || "Usuário"}
            />
            <AvatarFallback className="text-4xl">
              {session.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-white shadow-md hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-cyan-800">
                  Alterar foto de perfil
                </DialogTitle>
                <DialogDescription>
                  Escolha uma nova imagem para o seu perfil.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        imagePreview ||
                        session.user.image ||
                        "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
                      }
                      alt={session.user.name || "Usuário"}
                    />
                    <AvatarFallback className="text-2xl">
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => {
                      setDeleteImage(true);
                      setImagePreview(
                        "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000"
                      );
                    }}
                    className="absolute h-7 w-7 flex border-1 bottom-0 right-0 rounded-md bg-white shadow-md hover:bg-gray-100"
                  >
                    <Trash2Icon className="h-4 w-4 m-auto text-red-500" />
                  </button>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label
                    htmlFor="profile-image"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Selecione uma imagem
                  </label>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                  />
                </div>
              </div>
              <DialogFooter>
                <CustomButton
                  bgColor="cyan"
                  onClick={() => {
                    if (deleteImage) {
                      handleDeleteImage();
                    } else if (image) {
                      startUpload([image]);
                      setUploadingImage(true);
                    }
                  }}
                  disabled={uploadingImage || !imagePreview}
                  type="submit"
                >
                  {uploadingImage ? "Enviando..." : "Salvar alterações"}
                </CustomButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {session.user.name || "Usuário"}
          </h1>
          <p className="text-gray-500 mb-4">{session.user.email}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/perfil/editar">
                <User className="h-4 w-4" />
                Editar Perfil
              </Link>
            </Button>

            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Excluir Conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente sua conta e removerá seus dados dos nossos
                    servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Sim, excluir minha conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

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
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Gerenciamento de Conta
      </h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Alterar senha</h3>
                <p className="text-sm text-gray-500">
                  Atualize sua senha para manter sua conta segura
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/perfil/alterar-senha">Alterar senha</Link>
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notificações</h3>
                <p className="text-sm text-gray-500">
                  Gerencie suas preferências de notificação
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/perfil/notificacoes">Configurar</Link>
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-600">Excluir conta</h3>
                <p className="text-sm text-gray-500">
                  Exclua permanentemente sua conta e todos os seus dados
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Excluir conta</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá
                      permanentemente sua conta e removerá seus dados dos nossos
                      servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Sim, excluir minha conta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
