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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/utils/generateReactHelpers";
import { Edit, Trash2, Trash2Icon, User } from "lucide-react";
import { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export default function UserProfileHeader({
  session,
  update,
  router,
  deleteDialogOpen,
  setDeleteDialogOpen,
  handleDeleteAccount,
}: {
  handleDeleteAccount: () => void;
  deleteDialogOpen: boolean | undefined;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean | undefined>>;
  router: AppRouterInstance;
  session: {
    user: {
      subscription?: "free" | "premium";
      email?: string | null;
      image?: string | null;
      name?: string | null;
    };
  };
  update: (session: {
    user: {
      subscription?: "free" | "premium";
      email?: string | null;
    };
  }) => Promise<Session | null>;
}) {
  const [deleteImage, setDeleteImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
  return (
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
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {session.user.name || "Usuário"}
          </h1>
          {/* Subscription Badge */}
          <span
            className={`ml-1 mt-1 inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
              session.user.subscription === "premium"
                ? "bg-purple-500 text-white"
                : "bg-cyan-500 text-white"
            }`}
          >
            {session.user.subscription === "premium"
              ? "Premium"
              : "Plano Gratuito"}
          </span>
        </div>
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
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente
                  sua conta e removerá seus dados dos nossos servidores.
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
  );
}
