"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { salvarCenarioDePreco } from "@/lib/actions/ferramentas";
import { calcularPrecificacao } from "@/lib/calculos/precificacao";
import { formatarInteiro, formatarMoeda } from "@/lib/format";
import {
  cenarioFormSchema,
  type CenarioFormInput,
} from "@/lib/validacao/schemas";
import { cn } from "@/lib/utils";

const VALORES_INICIAIS: CenarioFormInput = {
  nome: "",
  custo_ingredientes: 6.8,
  custo_embalagem: 1.2,
  custo_energia: 0.45,
  minutos_mao_de_obra: 12,
  valor_hora: 12,
  margem_percentual: 50,
  volume_mensal: 120,
};

const TEXTO_DO_ALERTA = {
  saudavel: {
    tone: "success" as const,
    titulo: "Margem saudável",
    texto:
      "Nesse preço sobra folga para variação no custo dos insumos sem apagar o seu lucro.",
  },
  apertada: {
    tone: "warning" as const,
    titulo: "Margem apertada",
    texto:
      "Abaixo de 30% qualquer alta no preço da proteína consome o lucro. Reveja a margem ou o custo.",
  },
  prejuizo: {
    tone: "error" as const,
    titulo: "Esse preço dá prejuízo",
    texto:
      "O preço sugerido não cobre o custo informado. Confira os valores lançados.",
  },
};

export function CalculadoraDePrecificacao() {
  const router = useRouter();
  const [salvando, iniciarTransicao] = React.useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CenarioFormInput>({
    resolver: zodResolver(cenarioFormSchema),
    defaultValues: VALORES_INICIAIS,
    mode: "onBlur",
  });

  const valores = watch();

  const resultado = React.useMemo(
    () =>
      calcularPrecificacao({
        custoIngredientes: valores.custo_ingredientes,
        custoEmbalagem: valores.custo_embalagem,
        custoEnergia: valores.custo_energia,
        minutosMaoDeObra: valores.minutos_mao_de_obra,
        valorHora: valores.valor_hora,
        margemDesejada: (valores.margem_percentual ?? 0) / 100,
        volumeMensal: valores.volume_mensal,
      }),
    [valores]
  );

  const alerta = TEXTO_DO_ALERTA[resultado.alerta];

  function aoSalvar(dados: CenarioFormInput) {
    iniciarTransicao(async () => {
      const resposta = await salvarCenarioDePreco({
        nome: dados.nome,
        custo_ingredientes: dados.custo_ingredientes,
        custo_embalagem: dados.custo_embalagem,
        custo_energia: dados.custo_energia,
        minutos_mao_de_obra: dados.minutos_mao_de_obra,
        valor_hora: dados.valor_hora,
        margem_desejada: dados.margem_percentual / 100,
        volume_mensal: dados.volume_mensal,
      });

      if (!resposta.ok) {
        toast.error("Não foi possível salvar", { description: resposta.erro });
        return;
      }

      toast.success("Cenário salvo", {
        description: "Ele aparece na lista abaixo para comparação.",
      });
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit(aoSalvar)}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start"
    >
      {/* Entradas ----------------------------------------------------- */}
      <div className="space-y-6">
        <fieldset className="rounded-lg border border-border bg-surface p-5 sm:p-6">
          <legend className="t-eyebrow px-1">Custos por marmita</legend>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="custo_ingredientes"
              label="Ingredientes"
              suffix="R$"
              hint="Some o custo da receita dividido pelo rendimento."
              error={errors.custo_ingredientes?.message}
            >
              <Input
                id="custo_ingredientes"
                type="number"
                step="0.01"
                min={0}
                aria-invalid={Boolean(errors.custo_ingredientes)}
                {...register("custo_ingredientes", { valueAsNumber: true })}
              />
            </Field>

            <Field
              id="custo_embalagem"
              label="Embalagem e etiqueta"
              suffix="R$"
              error={errors.custo_embalagem?.message}
            >
              <Input
                id="custo_embalagem"
                type="number"
                step="0.01"
                min={0}
                aria-invalid={Boolean(errors.custo_embalagem)}
                {...register("custo_embalagem", { valueAsNumber: true })}
              />
            </Field>

            <Field
              id="custo_energia"
              label="Gás e energia"
              suffix="R$"
              hint="Gasto do dia de produção dividido pelas marmitas do dia."
              error={errors.custo_energia?.message}
            >
              <Input
                id="custo_energia"
                type="number"
                step="0.01"
                min={0}
                aria-invalid={Boolean(errors.custo_energia)}
                {...register("custo_energia", { valueAsNumber: true })}
              />
            </Field>

            <Field
              id="volume_mensal"
              label="Volume mensal"
              suffix="marmitas"
              error={errors.volume_mensal?.message}
            >
              <Input
                id="volume_mensal"
                type="number"
                step="1"
                min={0}
                aria-invalid={Boolean(errors.volume_mensal)}
                {...register("volume_mensal", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-border bg-surface p-5 sm:p-6">
          <legend className="t-eyebrow px-1">Seu trabalho</legend>
          <p className="t-small mt-3 text-muted">
            Compra, preparo, montagem, limpeza e atendimento entram aqui. Fora
            dessa conta, esse tempo sai do seu bolso.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="minutos_mao_de_obra"
              label="Tempo por marmita"
              suffix="minutos"
              error={errors.minutos_mao_de_obra?.message}
            >
              <Input
                id="minutos_mao_de_obra"
                type="number"
                step="1"
                min={0}
                aria-invalid={Boolean(errors.minutos_mao_de_obra)}
                {...register("minutos_mao_de_obra", { valueAsNumber: true })}
              />
            </Field>

            <Field
              id="valor_hora"
              label="Valor da sua hora"
              suffix="R$"
              error={errors.valor_hora?.message}
            >
              <Input
                id="valor_hora"
                type="number"
                step="0.01"
                min={0}
                aria-invalid={Boolean(errors.valor_hora)}
                {...register("valor_hora", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-border bg-surface p-5 sm:p-6">
          <legend className="t-eyebrow px-1">Margem desejada</legend>
          <p className="t-small mt-3 text-muted">
            Margem sobre o preço de venda, não markup. 50% significa que metade
            do que o cliente paga é lucro.
          </p>

          <div className="mt-5 max-w-xs">
            <Field
              id="margem_percentual"
              label="Margem"
              suffix="%"
              error={errors.margem_percentual?.message}
            >
              <Input
                id="margem_percentual"
                type="number"
                step="1"
                min={0}
                max={95}
                aria-invalid={Boolean(errors.margem_percentual)}
                {...register("margem_percentual", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </fieldset>

        {/* A conta aberta ------------------------------------------- */}
        <section className="overflow-hidden rounded-lg border border-border">
          <p className="t-eyebrow border-b border-border bg-surface-sunken px-5 py-3">
            Como o preço foi formado
          </p>

          <ul className="divide-y divide-border">
            {resultado.etapas.map((etapa) => (
              <li
                key={etapa.rotulo}
                className={cn(
                  "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3",
                  etapa.destaque ? "bg-surface-sunken" : "bg-surface"
                )}
              >
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-[0.9375rem]",
                      etapa.destaque && "font-medium"
                    )}
                  >
                    {etapa.rotulo}
                  </p>
                  <p className="t-small text-muted">{etapa.formula}</p>
                </div>
                <p
                  className={cn(
                    "shrink-0 tabular-nums",
                    etapa.destaque
                      ? "text-[1.0625rem] font-medium"
                      : "text-[0.9375rem] text-muted"
                  )}
                >
                  {formatarMoeda(etapa.valor)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Resultado ---------------------------------------------------- */}
      <aside className="space-y-5 lg:sticky lg:top-8">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="px-5 py-5">
            <p className="t-eyebrow">Preço de venda sugerido</p>
            <p className="t-metric mt-2" data-numeric>
              {formatarMoeda(resultado.precoSugerido)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={resultado.alerta === "saudavel" ? "success" : "warning"}>
                margem real {Math.round(resultado.margemReal * 100)}%
              </Badge>
              <Badge variant="outline">
                markup{" "}
                {resultado.markup.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Badge>
            </div>
          </div>

          <dl className="divide-y divide-border border-t border-border">
            {[
              ["Custo real por unidade", formatarMoeda(resultado.custoTotal)],
              ["Sua mão de obra", formatarMoeda(resultado.custoMaoDeObra)],
              ["Lucro por marmita", formatarMoeda(resultado.lucroPorUnidade)],
            ].map(([rotulo, valor]) => (
              <div
                key={rotulo}
                className="flex items-baseline justify-between gap-4 px-5 py-3"
              >
                <dt className="t-small text-muted">{rotulo}</dt>
                <dd className="text-[0.9375rem] tabular-nums">{valor}</dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-border bg-surface-sunken px-5 py-4">
            <p className="t-eyebrow">
              Projeção com {formatarInteiro(valores.volume_mensal || 0)}{" "}
              marmitas por mês
            </p>
            <dl className="mt-3 space-y-2">
              {[
                ["Faturamento", formatarMoeda(resultado.faturamentoMensal)],
                ["Custo", formatarMoeda(resultado.custoMensal)],
                ["Lucro", formatarMoeda(resultado.lucroMensal)],
              ].map(([rotulo, valor], indice) => (
                <div
                  key={rotulo}
                  className="flex items-baseline justify-between gap-4"
                >
                  <dt className="t-small text-muted">{rotulo}</dt>
                  <dd
                    className={cn(
                      "tabular-nums",
                      indice === 2
                        ? "text-[1.0625rem] font-medium text-success"
                        : "text-[0.9375rem]"
                    )}
                  >
                    {valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <Alert tone={alerta.tone} title={alerta.titulo}>
          {alerta.texto}
        </Alert>

        <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <Field
            id="nome"
            label="Nome do cenário"
            hint="Ex.: Frango com arroz — plano semanal."
            error={errors.nome?.message}
          >
            <Input
              id="nome"
              placeholder="Marmita padrão 450 g"
              maxLength={120}
              aria-invalid={Boolean(errors.nome)}
              {...register("nome")}
            />
          </Field>

          <Button type="submit" disabled={salvando} className="w-full">
            {salvando ? <Loader2 className="animate-spin" /> : <Save />}
            Salvar cenário
          </Button>
        </div>
      </aside>
    </form>
  );
}
