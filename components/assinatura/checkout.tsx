"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, CreditCard, Loader2, QrCode } from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  assinarComCartao,
  assinarComPix,
  conferirPagamento,
  type QrCodeParaPagar,
} from "@/lib/actions/assinatura";
import { formatarMoeda } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IdDePlano } from "@/lib/pagamentos/planos";

type PlanoNaTela = {
  id: IdDePlano;
  nome: string;
  valor: number;
  periodo: string;
  equivalente?: string;
  destaque: boolean;
};

type Metodo = "PIX" | "CREDIT_CARD";

/**
 * Validação do formulário, no navegador.
 *
 * É só para evitar ida e volta com campo vazio: quem decide o que é válido é
 * o servidor, com os mesmos dados, em `lib/validacao/schemas.ts`. O Pix não
 * pede cartão, então o schema muda junto com a forma de pagamento escolhida.
 */
const camposDoTitular = {
  nome: z.string().trim().min(3, "Informe o nome completo."),
  email: z.email("Informe um e-mail válido."),
  cpf_cnpj: z
    .string()
    .refine(
      (v) => [11, 14].includes(soDigitos(v).length),
      "Informe um CPF ou CNPJ válido."
    ),
  telefone: z
    .string()
    .refine((v) => soDigitos(v).length >= 10, "Informe o DDD e o número."),
  cep: z.string().refine((v) => soDigitos(v).length === 8, "O CEP tem 8 dígitos."),
  numero_endereco: z.string().trim().min(1, "Informe o número."),
};

const schemaDoPix = z.object({
  ...camposDoTitular,
  cartao_nome: z.string().optional(),
  cartao_numero: z.string().optional(),
  cartao_validade: z.string().optional(),
  cartao_cvv: z.string().optional(),
});

const schemaDoCartao = z.object({
  ...camposDoTitular,
  cartao_nome: z.string().trim().min(3, "Informe o nome impresso no cartão."),
  cartao_numero: z
    .string()
    .refine((v) => soDigitos(v).length >= 13, "Número de cartão incompleto."),
  cartao_validade: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/(\d{2}|20\d{2})$/, "Use MM/AA ou MM/AAAA."),
  cartao_cvv: z
    .string()
    .refine((v) => [3, 4].includes(soDigitos(v).length), "CVV inválido."),
});

type Formulario = z.infer<typeof schemaDoPix>;

/** Máscaras leves: o servidor limpa tudo de novo, aqui é só conforto. */
function soDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

function mascaraCpfCnpj(valor: string): string {
  const d = soDigitos(valor).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function mascaraCartao(valor: string): string {
  return soDigitos(valor)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function mascaraValidade(valor: string): string {
  const d = soDigitos(valor).slice(0, 6);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export function Checkout({ planos }: { planos: PlanoNaTela[] }) {
  const router = useRouter();

  const [plano, setPlano] = React.useState<IdDePlano>(
    planos.find((p) => p.destaque)?.id ?? planos[0].id
  );
  const [metodo, setMetodo] = React.useState<Metodo>("CREDIT_CARD");
  const [enviando, iniciarEnvio] = React.useTransition();
  const [qrCode, setQrCode] = React.useState<QrCodeParaPagar | null>(null);
  const [pixAutomatico, setPixAutomatico] = React.useState(false);
  const [copiado, setCopiado] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Formulario>({
    // O schema do cartão exige os campos que no Pix são opcionais, então os
    // dois tipos inferidos diferem. O formulário é o mesmo nos dois casos, e
    // é por isso que o resolver é afirmado sobre a forma única.
    resolver: zodResolver(
      metodo === "CREDIT_CARD" ? schemaDoCartao : schemaDoPix
    ) as Resolver<Formulario>,
    mode: "onBlur",
  });

  const escolhido = planos.find((p) => p.id === plano) ?? planos[0];

  function enviar(dados: Formulario) {
    iniciarEnvio(async () => {
      const titular = {
        nome: dados.nome,
        email: dados.email,
        cpf_cnpj: dados.cpf_cnpj,
        telefone: dados.telefone,
        cep: dados.cep,
        numero_endereco: dados.numero_endereco,
      };

      if (metodo === "PIX") {
        const resultado = await assinarComPix({ plano, titular });
        if (!resultado.ok) {
          toast.error(resultado.erro);
          return;
        }
        setPixAutomatico(resultado.automatico);
        setQrCode(resultado.qrCode);
        return;
      }

      const [mes, ano] = (dados.cartao_validade ?? "").split("/");
      const resultado = await assinarComCartao({
        plano,
        titular,
        cartao: {
          nome_impresso: dados.cartao_nome,
          numero: dados.cartao_numero,
          // O cartão mostra "MM/AA"; o Asaas quer o ano com quatro dígitos.
          mes,
          ano: ano?.length === 2 ? `20${ano}` : ano,
          cvv: dados.cartao_cvv,
        },
      });

      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Assinatura ativada. Bom proveito.");
      router.refresh();
    });
  }

  if (qrCode) {
    return (
      <PagamentoPix
        qrCode={qrCode}
        automatico={pixAutomatico}
        periodo={escolhido.periodo}
        copiado={copiado}
        aoCopiar={async () => {
          await navigator.clipboard.writeText(qrCode.copiaECola);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2500);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(enviar)} className="space-y-10">
      <section>
        <h2 className="t-eyebrow">1. Escolha o plano</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {planos.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPlano(item.id)}
              aria-pressed={item.id === plano}
              className={cn(
                "rounded-xl border p-5 text-left transition-[border-color,background-color]",
                item.id === plano
                  ? "border-primary bg-primary/5 ring-1 ring-primary/15"
                  : "border-border bg-surface hover:border-border-strong"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="t-h3">{item.nome}</span>
                {item.destaque ? <Badge variant="accent">Melhor valor</Badge> : null}
              </div>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="t-metric" data-numeric>
                  {formatarMoeda(item.valor)}
                </span>
                <span className="t-small text-muted">{item.periodo}</span>
              </p>
              {item.equivalente ? (
                <p className="t-small mt-1 text-muted">{item.equivalente}</p>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="t-eyebrow">2. Forma de pagamento</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <BotaoDeMetodo
            ativo={metodo === "CREDIT_CARD"}
            aoEscolher={() => setMetodo("CREDIT_CARD")}
            icone={CreditCard}
            titulo="Cartão de crédito"
            texto="Renova sozinho. Libera na hora."
          />
          <BotaoDeMetodo
            ativo={metodo === "PIX"}
            aoEscolher={() => setMetodo("PIX")}
            icone={QrCode}
            titulo="Pix"
            texto="QR Code aqui mesmo. Cai em segundos."
          />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="t-eyebrow">3. Seus dados</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="nome" label="Nome completo" error={errors.nome?.message}>
            <Input id="nome" autoComplete="name" {...register("nome")} />
          </Field>

          <Field id="email" label="E-mail" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </Field>

          <Field id="cpf_cnpj" label="CPF ou CNPJ" error={errors.cpf_cnpj?.message}>
            <Input
              id="cpf_cnpj"
              inputMode="numeric"
              {...register("cpf_cnpj", {
                onChange: (e) =>
                  setValue("cpf_cnpj", mascaraCpfCnpj(e.target.value)),
              })}
            />
          </Field>

          <Field id="telefone" label="Celular com DDD" error={errors.telefone?.message}>
            <Input
              id="telefone"
              inputMode="numeric"
              autoComplete="tel"
              {...register("telefone")}
            />
          </Field>

          <Field id="cep" label="CEP" error={errors.cep?.message}>
            <Input id="cep" inputMode="numeric" autoComplete="postal-code" {...register("cep")} />
          </Field>

          <Field
            id="numero_endereco"
            label="Número"
            error={errors.numero_endereco?.message}
          >
            <Input id="numero_endereco" inputMode="numeric" {...register("numero_endereco")} />
          </Field>
        </div>

        {metodo === "CREDIT_CARD" ? (
          <div className="grid gap-5 rounded-xl border border-border bg-surface-sunken/40 p-5 sm:grid-cols-2">
            <Field
              id="cartao_nome"
              label="Nome impresso no cartão"
              error={errors.cartao_nome?.message}
              className="sm:col-span-2"
            >
              <Input id="cartao_nome" autoComplete="cc-name" {...register("cartao_nome")} />
            </Field>

            <Field
              id="cartao_numero"
              label="Número do cartão"
              error={errors.cartao_numero?.message}
              className="sm:col-span-2"
            >
              <Input
                id="cartao_numero"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                {...register("cartao_numero", {
                  onChange: (e) =>
                    setValue("cartao_numero", mascaraCartao(e.target.value)),
                })}
              />
            </Field>

            <Field
              id="cartao_validade"
              label="Validade"
              hint="Mês e ano, como está no cartão."
              error={errors.cartao_validade?.message}
            >
              <Input
                id="cartao_validade"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/AAAA"
                {...register("cartao_validade", {
                  onChange: (e) =>
                    setValue("cartao_validade", mascaraValidade(e.target.value)),
                })}
              />
            </Field>

            <Field id="cartao_cvv" label="CVV" error={errors.cartao_cvv?.message}>
              <Input
                id="cartao_cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="000"
                {...register("cartao_cvv")}
              />
            </Field>
          </div>
        ) : null}
      </section>

      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-small text-muted">
          Você vai pagar{" "}
          <strong className="text-foreground">{formatarMoeda(escolhido.valor)}</strong>{" "}
          {escolhido.periodo}. Cancela quando quiser, direto por aqui.
        </p>

        <Button type="submit" size="lg" disabled={enviando}>
          {enviando ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Processando
            </>
          ) : metodo === "PIX" ? (
            "Gerar QR Code do Pix"
          ) : (
            "Assinar agora"
          )}
        </Button>
      </div>
    </form>
  );
}

function BotaoDeMetodo({
  ativo,
  aoEscolher,
  icone: Icone,
  titulo,
  texto,
}: {
  ativo: boolean;
  aoEscolher: () => void;
  icone: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  titulo: string;
  texto: string;
}) {
  return (
    <button
      type="button"
      onClick={aoEscolher}
      aria-pressed={ativo}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-5 text-left transition-[border-color,background-color]",
        ativo
          ? "border-primary bg-primary/5 ring-1 ring-primary/15"
          : "border-border bg-surface hover:border-border-strong"
      )}
    >
      <Icone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
      <span>
        <span className="block font-medium">{titulo}</span>
        <span className="t-small block text-muted">{texto}</span>
      </span>
    </button>
  );
}

/**
 * Tela do Pix. Enquanto ela está aberta, perguntamos ao servidor se a
 * cobrança foi paga — o webhook costuma chegar antes, mas quem está olhando a
 * tela não deveria precisar recarregar para descobrir.
 */
function PagamentoPix({
  qrCode,
  automatico,
  periodo,
  copiado,
  aoCopiar,
}: {
  qrCode: QrCodeParaPagar;
  /** Pix Automático: o mesmo QR paga agora e autoriza os próximos débitos. */
  automatico: boolean;
  /** "por mês" ou "por ano", para dizer de quanto em quanto tempo debita. */
  periodo: string;
  copiado: boolean;
  aoCopiar: () => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    const intervalo = setInterval(async () => {
      const { liberado } = await conferirPagamento();
      if (liberado) {
        clearInterval(intervalo);
        toast.success("Pagamento confirmado. Acesso liberado.");
        router.refresh();
      }
    }, 5000);

    return () => clearInterval(intervalo);
  }, [router]);

  return (
    <div className="space-y-6">
      {automatico ? (
        // O cliente precisa saber que está autorizando débitos futuros, e não
        // só pagando um mês: é o que o banco dele vai mostrar na confirmação,
        // e surpresa com débito recorrente vira reclamação e estorno.
        <Alert tone="info" title="Pix Automático: pague uma vez, renove sozinho">
          Leia o código no app do seu banco. Você paga agora o primeiro período
          e autoriza os próximos débitos de {formatarMoeda(qrCode.valor)}{" "}
          {periodo}, feitos automaticamente pelo seu banco. Dá para cancelar a
          qualquer momento, aqui ou no próprio app do banco. A tela libera
          sozinha assim que o pagamento cair.
        </Alert>
      ) : (
        <Alert tone="info" title="Pague para liberar o acesso">
          Abra o app do seu banco, escolha Pix e leia o código. A tela libera
          sozinha assim que o pagamento cair. A cada renovação, um novo Pix é
          enviado para o seu e-mail.
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
        <div className="rounded-xl border border-border bg-white p-4">
          <Image
            src={`data:image/png;base64,${qrCode.imagemBase64}`}
            alt="QR Code para pagamento via Pix"
            width={220}
            height={220}
            unoptimized
          />
        </div>

        <div className="space-y-4">
          <p className="flex items-baseline gap-2">
            <span className="t-metric" data-numeric>
              {formatarMoeda(qrCode.valor)}
            </span>
            <span className="t-small text-muted">
              {automatico ? `agora, e depois ${periodo} no automático` : "a pagar agora"}
            </span>
          </p>

          <div className="space-y-2">
            <p className="t-small text-muted">Ou use o Pix copia e cola:</p>
            <div className="flex gap-2">
              <Input readOnly value={qrCode.copiaECola} className="font-mono text-xs" />
              <Button type="button" variant="secondary" onClick={aoCopiar}>
                {copiado ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
                {copiado ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </div>

          <p className="t-small flex items-center gap-2 text-muted">
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Aguardando a confirmação do pagamento…
          </p>
        </div>
      </div>
    </div>
  );
}
