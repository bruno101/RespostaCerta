"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, ExternalLink, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RichTextEditor } from "@/components/rich-text-editor";
import type IUser from "@/app/interfaces/IUser";
import Link from "next/link";
import LoadingSkeletons from "./LoadingSkeletons";

export default function SubmitResponse({
  questionId,
  currentUser,
}: {
  questionId: string;
  currentUser?: IUser;
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const seeIfHasSubmitted = async () => {
      try {
        const res = await fetch(`/api/responses/${questionId}`);
        const data = await res.json();
        if (data && !data.error) {
          setHasSubmitted(true);
        }
      } catch (e) {
        console.error(e);
      }
    };
    seeIfHasSubmitted();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Por favor, escreva uma resposta antes de enviar.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch(`/api/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, questionId: questionId }),
      });
      const data = await res.json();
      if (!data || data.error) {
        setError(
          "Ocorreu um erro ao enviar sua resposta. Por favor, tente novamente."
        );
      } else {
        // Set submitted state to true
        setHasSubmitted(true);

        // Reset form after successful submission
        setContent("");
      }
    } catch (err) {
      setError(
        "Ocorreu um erro ao enviar sua resposta. Por favor, tente novamente."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Alert className="mt-6 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Você precisa estar logado para responder a esta questão.
        </AlertDescription>
      </Alert>
    );
  }


  if (hasSubmitted === undefined) {
    return (
      <div className="h-[100vh]">
        <LoadingSkeletons></LoadingSkeletons>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <Alert className="bg-cyan-50 mb-8 border-cyan-200">
        <CheckCircle2 className="h-5 w-5 text-cyan-600" />
        <AlertTitle className="text-cyan-800 font-medium text-base">
          Resposta enviada com sucesso!
        </AlertTitle>
        <AlertDescription className="text-cyan-700">
          <p className="mt-2 mb-4">
            Você já enviou uma resposta para esta questão. Você pode verificar o
            status da sua resposta e feedback no seu painel.
          </p>
          <Link
            href={`/painel/questoes-respondidas/${questionId}`}
            className="inline-flex items-center gap-1.5 text-cyan-700 hover:text-cyan-900 font-medium bg-cyan-100 hover:bg-cyan-200 px-3 py-1.5 rounded-md transition-colors"
          >
            Ver status da resposta
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
      <Card className="mt-3 border-t-4 border-t-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={currentUser.image || ""}
                alt={currentUser.name || "Usuário"}
              />
              <AvatarFallback>
                {currentUser.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg font-medium text-cyan-800">
              Sua resposta
            </CardTitle>
          </div>
        </CardHeader>

        <Tabs defaultValue="write" className="w-full">
          <TabsContent value="write" className="mt-0">
            <CardContent>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Escreva sua resposta aqui..."
                className="h-[300px]"
              />
            </CardContent>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="px-6 mb-2">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <CardFooter className="flex justify-between border-t bg-muted/20 py-3">
          <div className="text-xs mt-3 text-muted-foreground">
            Formatação com Markdown é suportada
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="flex text-white px-3 py-2 rounded-lg font-bold text-[15px] disabled:opacity-50 gap-2 mt-3 bg-cyan-700 hover:bg-[#0891b2] focus:bg-[#0891b2] focus:outline focus:outline-cyan-300 focus:outline-offset-1"
          >
            <Send className="h-4 w-4 mt-1" />
            {isSubmitting ? "Enviando resposta" : "Enviar resposta"}
          </button>
        </CardFooter>
      </Card>
  );
}
