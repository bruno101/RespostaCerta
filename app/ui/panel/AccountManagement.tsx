import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Session } from "next-auth";

// Account Management Component
export default function AccountManagement({
  session,
  update,
  handleDeleteAccount,
}: {
  session: {
    user: {
      subscription?: "free" | "premium";
      email?: string | null;
    };
  };
  update: (session: {
    user: {
      subscription?: "free" | "premium";
      email?: string | null;
    };
  }) => Promise<Session | null>;
  handleDeleteAccount: () => void;
}) {
  const user = session?.user;
  const [cancelationDialogOpen, setCancelationDialogOpen] = useState<
    boolean | undefined
  >();
  const [isCanceling, setIsCanceling] = useState(false);
  const handleCancelSubscription = async () => {
    // Logic to cancel the subscription
    try {
      setIsCanceling(true);
      const response = await fetch("/api/subscriptions", {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the page or update the user's subscription status
        toast.success("Assinatura cancelada", {
          description:
            "Você não terá mais acesso às funcionalidades premium do Resposta Certa.",
        });
        const newSession = {
          ...session,
          user: {
            ...session.user,
            image: "",
          },
        };
        await update({ ...newSession });
        setCancelationDialogOpen(false);
        window.location.reload();
      } else {
        throw new Error("Erro cancelando");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Erro no cancelamento", {
        description:
          "Ocorreu um erro ao processsarmos o cancelamento da sua assinatura.",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Gerenciamento de Conta
      </h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Change Password Section */}
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

            {/* Notifications Section */}
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

            {/* Subscription Management Section */}
            {user.subscription === "premium" ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Cancelar assinatura</h3>
                  <p className="text-sm text-gray-500">
                    Cancele sua assinatura premium
                  </p>
                </div>
                <AlertDialog
                  open={cancelationDialogOpen}
                  onOpenChange={setCancelationDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Cancelar assinatura</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação cancelará sua assinatura premium. Você perderá
                        acesso aos benefícios premium imediatamente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                        className="disabled:opacity-50 bg-red-500 hover:bg-red-600"
                      >
                        {isCanceling
                          ? "Cancelando assinatura..."
                          : "Sim, cancelar assinatura"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Assinar plano premium</h3>
                  <p className="text-sm text-gray-500">
                    Aproveite todos os benefícios do plano premium
                  </p>
                </div>
                <Button variant="cyan" asChild>
                  <Link href="/subscribe">Assinar</Link>
                </Button>
              </div>
            )}

            <Separator />

            {/* Delete Account Section */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-600">Excluir conta</h3>
                <p className="text-sm text-gray-500">
                  Exclua permanentemente sua conta e todos os seus dados
                  {user.subscription === "premium" && (
                    <span className="block text-red-500">
                      (Isso também cancelará sua assinatura premium)
                    </span>
                  )}
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
                      {user.subscription === "premium" && (
                        <span className="block text-red-500">
                          Sua assinatura premium também será cancelada.
                        </span>
                      )}
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
