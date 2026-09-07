"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { alternarProgressoDaAula } from "@/lib/actions/curso";

export function BotaoConcluir({
  lessonId,
  concluida,
}: {
  lessonId: string;
  concluida: boolean;
}) {
  const router = useRouter();
  const [salvando, iniciarTransicao] = React.useTransition();

  function alternar() {
    iniciarTransicao(async () => {
      const resultado = await alternarProgressoDaAula({
        lessonId,
        concluida: !concluida,
      });

      if (!resultado.ok) {
        toast.error("Não foi possível salvar", { description: resultado.erro });
        return;
      }

      toast.success(
        concluida ? "Aula desmarcada" : "Aula marcada como concluída"
      );
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={concluida ? "secondary" : "primary"}
      onClick={alternar}
      disabled={salvando}
      aria-pressed={concluida}
    >
      {salvando ? (
        <Loader2 className="animate-spin" />
      ) : concluida ? (
        <RotateCcw />
      ) : (
        <Check />
      )}
      {concluida ? "Marcar como não concluída" : "Marcar como concluída"}
    </Button>
  );
}
