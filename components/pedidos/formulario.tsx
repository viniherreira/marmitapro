"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectNativo } from "@/components/ui/select-nativo";
import { Textarea } from "@/components/ui/textarea";
import { salvarPedido } from "@/lib/actions/pedidos";
import type { SugestaoDeItem } from "@/lib/data/pedidos";
import { formatarMoeda } from "@/lib/format";
import { cn } from "@/lib/utils";

const NOVO_CLIENTE = "novo";

type ClienteDaLista = {
  id: string;
  nome: string;
  telefone: string | null;
};

export type PedidoParaEditar = {
  id: string;
  customer_id: string;
  entrega_data: string;
  entrega_hora: string | null;
  observacoes: string | null;
  itens: { descricao: string; quantidade: number; preco_unitario: number }[];
};

/** "12,50", "12.50" e "12" viram número; o que não for número vira NaN. */
function numeroBR(valor: string): number {
  const limpo = valor.trim().replace(/\s/g, "");
  if (!limpo) return Number.NaN;
  // "1.234,50" -> "1234.50"; "12.50" continua "12.50".
  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo;
  return Number(normalizado);
}

function precoParaCampo(valor: number): string {
  return valor.toFixed(2).replace(".", ",");
}

/**
 * Os campos numéricos são texto no formulário: quem digita "12,50" no celular
 * não pode ser corrigido pelo input numérico do navegador, que em vários
 * aparelhos só aceita ponto. A conversão acontece aqui, uma vez.
 */
const formularioSchema = z
  .object({
    cliente_id: z.string().min(1, "Escolha o cliente."),
    cliente_nome: z.string(),
    cliente_telefone: z.string(),
    cliente_endereco: z.string(),
    entrega_data: z.string().min(1, "Informe a data de entrega."),
    entrega_hora: z.string(),
    observacoes: z.string(),
    itens: z
      .array(
        z.object({
          descricao: z.string().trim().min(2, "Diga qual é a marmita."),
          quantidade: z
            .string()
            .refine(
              (v) => Number.isInteger(numeroBR(v)) && numeroBR(v) >= 1,
              "Quantidade inválida."
            ),
          preco: z
            .string()
            .refine((v) => numeroBR(v) >= 0, "Preço inválido."),
        })
      )
      .min(1, "Adicione pelo menos uma marmita."),
  })
  .superRefine((dados, ctx) => {
    if (dados.cliente_id === NOVO_CLIENTE && dados.cliente_nome.trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["cliente_nome"],
        message: "Informe o nome do cliente.",
      });
    }
  });

type Formulario = z.infer<typeof formularioSchema>;

const ITEM_VAZIO = { descricao: "", quantidade: "1", preco: "" };

export function FormularioDePedido({
  clientes,
  sugestoes,
  dataPadrao,
  pedido,
}: {
  clientes: ClienteDaLista[];
  sugestoes: SugestaoDeItem[];
  dataPadrao: string;
  pedido?: PedidoParaEditar;
}) {
  const router = useRouter();
  const [salvando, iniciarSalvamento] = React.useTransition();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Formulario>({
    resolver: zodResolver(formularioSchema),
    mode: "onBlur",
    defaultValues: {
      cliente_id: pedido?.customer_id ?? (clientes.length ? "" : NOVO_CLIENTE),
      cliente_nome: "",
      cliente_telefone: "",
      cliente_endereco: "",
      entrega_data: pedido?.entrega_data ?? dataPadrao,
      entrega_hora: pedido?.entrega_hora?.slice(0, 5) ?? "",
      observacoes: pedido?.observacoes ?? "",
      itens: pedido?.itens.length
        ? pedido.itens.map((item) => ({
            descricao: item.descricao,
            quantidade: String(item.quantidade),
            preco: precoParaCampo(Number(item.preco_unitario)),
          }))
        : [ITEM_VAZIO],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "itens" });

  const clienteId = useWatch({ control, name: "cliente_id" });
  const itens = useWatch({ control, name: "itens" });

  const precoPorDescricao = React.useMemo(
    () =>
      new Map(
        sugestoes
          .filter((s) => s.preco !== null)
          .map((s) => [s.descricao.trim().toLowerCase(), s.preco as number])
      ),
    [sugestoes]
  );

  const total = (itens ?? []).reduce((soma, item) => {
    const quantidade = numeroBR(item?.quantidade ?? "");
    const preco = numeroBR(item?.preco ?? "");
    if (!Number.isFinite(quantidade) || !Number.isFinite(preco)) return soma;
    return soma + quantidade * preco;
  }, 0);

  const marmitas = (itens ?? []).reduce((soma, item) => {
    const quantidade = numeroBR(item?.quantidade ?? "");
    return Number.isFinite(quantidade) ? soma + quantidade : soma;
  }, 0);

  /** Escolheu um prato já vendido: o último preço entra sozinho. */
  function aoEscolherDescricao(indice: number, descricao: string) {
    const preco = precoPorDescricao.get(descricao.trim().toLowerCase());
    const atual = getValues(`itens.${indice}.preco`);
    if (preco !== undefined && !atual) {
      setValue(`itens.${indice}.preco`, precoParaCampo(preco));
    }
  }

  function enviar(dados: Formulario) {
    iniciarSalvamento(async () => {
      const resultado = await salvarPedido({
        id: pedido?.id,
        cliente:
          dados.cliente_id === NOVO_CLIENTE
            ? {
                nome: dados.cliente_nome,
                telefone: dados.cliente_telefone || undefined,
                endereco: dados.cliente_endereco || undefined,
              }
            : { id: dados.cliente_id },
        entrega_data: dados.entrega_data,
        entrega_hora: dados.entrega_hora,
        observacoes: dados.observacoes || undefined,
        itens: dados.itens.map((item) => ({
          descricao: item.descricao.trim(),
          quantidade: numeroBR(item.quantidade),
          preco_unitario: numeroBR(item.preco),
        })),
      });

      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }

      toast.success(pedido ? "Pedido atualizado." : "Pedido anotado.");
      router.push(resultado.destino ?? "/app/pedidos");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(enviar)} className="space-y-10" noValidate>
      {/* Cliente ---------------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="t-eyebrow">Cliente</h2>

        {clientes.length > 0 ? (
          <Field id="cliente_id" label="Quem pediu" error={errors.cliente_id?.message}>
            <SelectNativo id="cliente_id" {...register("cliente_id")}>
              {/* Sem `disabled`: desabilitada, o navegador pula esta opção e
                  mostra o primeiro cliente antes da página hidratar — e quem
                  não reparar salva o pedido na conta de outra pessoa. */}
              <option value="">Escolha o cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                  {cliente.telefone ? ` · ${cliente.telefone}` : ""}
                </option>
              ))}
              <option value={NOVO_CLIENTE}>+ Cliente novo</option>
            </SelectNativo>
          </Field>
        ) : null}

        {clienteId === NOVO_CLIENTE ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="cliente_nome"
              label="Nome do cliente"
              error={errors.cliente_nome?.message}
            >
              <Input id="cliente_nome" autoComplete="off" {...register("cliente_nome")} />
            </Field>
            <Field
              id="cliente_telefone"
              label="WhatsApp"
              hint="Opcional. Vira um atalho para chamar o cliente."
            >
              <Input
                id="cliente_telefone"
                inputMode="tel"
                placeholder="(11) 91234-5678"
                {...register("cliente_telefone")}
              />
            </Field>
            <Field
              id="cliente_endereco"
              label="Endereço de entrega"
              hint="Opcional."
              className="sm:col-span-2"
            >
              <Input id="cliente_endereco" {...register("cliente_endereco")} />
            </Field>
          </div>
        ) : null}
      </section>

      {/* Entrega ---------------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="t-eyebrow">Entrega</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="entrega_data" label="Dia" error={errors.entrega_data?.message}>
            <Input id="entrega_data" type="date" {...register("entrega_data")} />
          </Field>
          <Field id="entrega_hora" label="Horário" hint="Opcional.">
            <Input id="entrega_hora" type="time" {...register("entrega_hora")} />
          </Field>
        </div>
      </section>

      {/* Marmitas --------------------------------------------------------- */}
      <section className="space-y-4">
        <h2 className="t-eyebrow">Marmitas</h2>

        <datalist id="sugestoes-de-marmita">
          {sugestoes.map((sugestao) => (
            <option key={sugestao.descricao} value={sugestao.descricao} />
          ))}
        </datalist>

        <ul className="space-y-3">
          {fields.map((campo, indice) => {
            const erro = errors.itens?.[indice];
            return (
              <li
                key={campo.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_6rem_8rem_auto] sm:items-start">
                  <Field
                    id={`item-${indice}-descricao`}
                    label="Marmita"
                    error={erro?.descricao?.message}
                  >
                    <Input
                      id={`item-${indice}-descricao`}
                      list="sugestoes-de-marmita"
                      autoComplete="off"
                      placeholder="Ex.: Frango com batata-doce"
                      {...register(`itens.${indice}.descricao`, {
                        onChange: (e) => aoEscolherDescricao(indice, e.target.value),
                      })}
                    />
                  </Field>

                  <Field
                    id={`item-${indice}-quantidade`}
                    label="Qtd."
                    error={erro?.quantidade?.message}
                  >
                    <Input
                      id={`item-${indice}-quantidade`}
                      inputMode="numeric"
                      {...register(`itens.${indice}.quantidade`)}
                    />
                  </Field>

                  <Field
                    id={`item-${indice}-preco`}
                    label="Preço unit."
                    error={erro?.preco?.message}
                  >
                    <Input
                      id={`item-${indice}-preco`}
                      inputMode="decimal"
                      placeholder="0,00"
                      {...register(`itens.${indice}.preco`)}
                    />
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(indice)}
                    disabled={fields.length === 1}
                    aria-label={`Remover marmita ${indice + 1}`}
                    className="sm:mt-7"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    <span className="sm:sr-only">Remover</span>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        {errors.itens?.root?.message || errors.itens?.message ? (
          <p className="t-small text-destructive">
            {errors.itens?.root?.message ?? errors.itens?.message}
          </p>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          onClick={() => append(ITEM_VAZIO)}
          disabled={fields.length >= 30}
        >
          <Plus className="size-4" aria-hidden="true" />
          Adicionar outra marmita
        </Button>
      </section>

      {/* Observações ------------------------------------------------------ */}
      <section className="space-y-4">
        <h2 className="t-eyebrow">Observações</h2>
        <Field
          id="observacoes"
          label="Algo a lembrar"
          hint="Opcional. Ex.: sem cebola, deixar na portaria, já pagou no Pix."
        >
          <Textarea id="observacoes" rows={3} {...register("observacoes")} />
        </Field>
      </section>

      {/* Rodapé ----------------------------------------------------------- */}
      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="t-small text-muted">
            {marmitas} {marmitas === 1 ? "marmita" : "marmitas"}
          </p>
          <p className={cn("t-metric", total === 0 && "text-muted")} data-numeric>
            {formatarMoeda(total)}
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="ghost" size="lg">
            <Link href="/app/pedidos">Cancelar</Link>
          </Button>
          <Button type="submit" size="lg" disabled={salvando}>
            {salvando ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {pedido ? "Salvar alterações" : "Anotar pedido"}
          </Button>
        </div>
      </div>
    </form>
  );
}
