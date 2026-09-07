import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Check,
  Download,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { DsBloco, DsSection } from "@/components/design-system/section";
import { GrupoDeSwatches } from "@/components/design-system/swatch";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ESCALA_DE_ESPACO,
  ESCALA_TIPOGRAFICA,
  GRUPOS_DE_COR,
  RAIOS,
} from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const INDICE = [
  { id: "cor", numero: "01", titulo: "Cor" },
  { id: "tipografia", numero: "02", titulo: "Tipografia" },
  { id: "medida", numero: "03", titulo: "Medida" },
  { id: "botoes", numero: "04", titulo: "Botões" },
  { id: "formularios", numero: "05", titulo: "Formulários" },
  { id: "superficies", numero: "06", titulo: "Superfícies" },
  { id: "sinalizacao", numero: "07", titulo: "Sinalização" },
  { id: "estados", numero: "08", titulo: "Estados" },
];

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="texture-paper min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo className="text-[15px]" />
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="t-eyebrow hidden sm:block">Design System</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="t-small hidden text-muted sm:block">v0.1</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 pb-32 sm:px-8">
        {/* Abertura -------------------------------------------------- */}
        <section className="grid gap-10 py-16 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10 md:py-24">
          <span className="t-eyebrow pt-3">00 — Base</span>
          <div className="max-w-3xl space-y-6">
            <h1 className="t-display">
              A gramática visual do MarmitaPRO
            </h1>
            <p className="t-lead max-w-xl">
              Esta página é a fonte da verdade do produto. Toda tela nasce
              destes tokens, desta escala e destes componentes — se algo aqui
              muda, muda em todo lugar.
            </p>
            <dl className="grid max-w-xl gap-x-8 gap-y-5 pt-2 sm:grid-cols-3">
              <div className="space-y-1">
                <dt className="t-eyebrow">Direção</dt>
                <dd className="t-small text-muted-strong">
                  Editorial e calmo. Hierarquia por espaço e tipo, não por caixa
                  colorida.
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="t-eyebrow">Título</dt>
                <dd className="t-small text-muted-strong">
                  Fraunces — serif variável, eixos opsz e WONK ativos.
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="t-eyebrow">Interface</dt>
                <dd className="t-small text-muted-strong">
                  Inter, com algarismos tabulares em todo dado numérico.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="gap-16 xl:grid xl:grid-cols-[7rem_minmax(0,1fr)]">
          {/* Índice ------------------------------------------------- */}
          <nav
            aria-label="Índice do design system"
            className="hidden xl:block"
          >
            <ul className="sticky top-28 space-y-2.5">
              {INDICE.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group flex items-baseline gap-2 text-[0.8125rem] text-muted transition-colors duration-150 hover:text-foreground"
                  >
                    <span className="tabular-nums text-[0.6875rem] tracking-widest">
                      {item.numero}
                    </span>
                    <span className="border-b border-transparent group-hover:border-border-strong">
                      {item.titulo}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-20">
            {/* 01 — Cor ------------------------------------------------ */}
            <DsSection
              id="cor"
              numero="01"
              titulo="Cor"
              descricao="Nenhuma cor é escrita direto em componente. Tudo passa por variável CSS, o que faz o tema escuro ser uma troca de valores e não uma segunda folha de estilo."
            >
              <div className="rounded-lg border border-border bg-surface px-6 py-2">
                {GRUPOS_DE_COR.map((grupo) => (
                  <GrupoDeSwatches key={grupo.titulo} grupo={grupo} />
                ))}
              </div>
            </DsSection>

            {/* 02 — Tipografia ---------------------------------------- */}
            <DsSection
              id="tipografia"
              numero="02"
              titulo="Tipografia"
              descricao="A serif carrega a voz da marca e aparece só em títulos e números de destaque. Todo o resto — rótulo, campo, tabela, corpo — é Inter."
            >
              <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
                {ESCALA_TIPOGRAFICA.map((nivel) => (
                  <div
                    key={nivel.classe}
                    className="grid gap-4 p-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-8"
                  >
                    <div className="space-y-1">
                      <p className="font-mono text-[0.8125rem] font-medium">
                        .{nivel.classe}
                      </p>
                      <p className="t-small text-muted">{nivel.especificacao}</p>
                      <p className="t-small text-muted">{nivel.uso}</p>
                    </div>
                    <p className={`${nivel.classe} min-w-0`}>{nivel.amostra}</p>
                  </div>
                ))}
              </div>
            </DsSection>

            {/* 03 — Medida -------------------------------------------- */}
            <DsSection
              id="medida"
              numero="03"
              titulo="Medida"
              descricao="Espaçamento em múltiplos de 4px e um raio dominante de 12px. A regularidade é o que faz telas diferentes parecerem o mesmo produto."
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <DsBloco rotulo="Escala de espaço" nota="base 4px">
                  <ul className="space-y-3">
                    {ESCALA_DE_ESPACO.map((passo) => (
                      <li key={passo.token} className="flex items-center gap-4">
                        <span className="w-10 shrink-0 font-mono text-[0.75rem] tabular-nums text-muted">
                          {passo.px}
                        </span>
                        <span
                          aria-hidden="true"
                          className="h-2 shrink-0 rounded-[2px] bg-primary-soft"
                          style={{ width: `${passo.px}px` }}
                        />
                        <span className="t-small truncate text-muted">
                          {passo.uso}
                        </span>
                      </li>
                    ))}
                  </ul>
                </DsBloco>

                <DsBloco rotulo="Raio" nota="padrão 12px">
                  <ul className="space-y-3">
                    {RAIOS.map((raio) => (
                      <li key={raio.token} className="flex items-center gap-4">
                        <span
                          aria-hidden="true"
                          className="size-10 shrink-0 border border-border-strong bg-surface-sunken"
                          style={{
                            borderRadius:
                              raio.px > 999 ? "9999px" : `${raio.px}px`,
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-mono text-[0.75rem]">
                            {raio.token}
                          </p>
                          <p className="t-small truncate text-muted">
                            {raio.uso}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </DsBloco>
              </div>
            </DsSection>

            {/* 04 — Botões -------------------------------------------- */}
            <DsSection
              id="botoes"
              numero="04"
              titulo="Botões"
              descricao="Uma ação primária por tela. O verde-limão nunca vira botão: ele sinaliza progresso, não convida ao clique."
            >
              <div className="space-y-6">
                <DsBloco rotulo="Variantes" nota="altura padrão 40px">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button>
                      Começar agora
                      <ArrowRight />
                    </Button>
                    <Button variant="secondary">Salvar receita</Button>
                    <Button variant="outline">
                      <Download />
                      Exportar
                    </Button>
                    <Button variant="ghost">Cancelar</Button>
                    <Button variant="destructive">
                      <Trash2 />
                      Excluir
                    </Button>
                    <Button variant="link">Ver a aula completa</Button>
                  </div>
                </DsBloco>

                <div className="grid gap-6 lg:grid-cols-2">
                  <DsBloco rotulo="Tamanhos">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm" variant="secondary">
                        Pequeno
                      </Button>
                      <Button variant="secondary">Padrão</Button>
                      <Button size="lg" variant="secondary">
                        Grande
                      </Button>
                      <Button size="xl">Chamada da landing</Button>
                      <Button size="icon" variant="outline" aria-label="Adicionar">
                        <Plus />
                      </Button>
                    </div>
                  </DsBloco>

                  <DsBloco rotulo="Estados" nota="transição de 150ms">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button disabled>Desabilitado</Button>
                      <Button variant="secondary" disabled>
                        Desabilitado
                      </Button>
                      <Button aria-busy="true">
                        <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                        Calculando
                      </Button>
                    </div>
                  </DsBloco>
                </div>
              </div>
            </DsSection>

            {/* 05 — Formulários --------------------------------------- */}
            <DsSection
              id="formularios"
              numero="05"
              titulo="Formulários"
              descricao="Rótulo sempre visível, dica abaixo do campo e erro no lugar da dica. Nada de placeholder fazendo papel de rótulo."
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <DsBloco rotulo="Campos" nota="altura 40px">
                  <div className="space-y-6">
                    <Field
                      id="ds-nome"
                      label="Nome da receita"
                      hint="Aparece na sua lista e na ficha técnica."
                    >
                      <Input id="ds-nome" placeholder="Frango com batata-doce" />
                    </Field>

                    <Field
                      id="ds-peso"
                      label="Peso por porção"
                      suffix="gramas"
                      hint="Use a balança: estimativa aqui derruba o cálculo inteiro."
                    >
                      <Input id="ds-peso" type="number" defaultValue={350} />
                    </Field>

                    <Field
                      id="ds-margem"
                      label="Margem desejada"
                      error="Informe um valor entre 0 e 300."
                    >
                      <Input
                        id="ds-margem"
                        type="number"
                        defaultValue={-10}
                        aria-invalid
                      />
                    </Field>

                    <Field id="ds-obs" label="Modo de preparo">
                      <Textarea
                        id="ds-obs"
                        placeholder="Descreva o passo a passo…"
                      />
                    </Field>
                  </div>
                </DsBloco>

                <div className="space-y-6">
                  <DsBloco rotulo="Seleção">
                    <div className="space-y-6">
                      <Field id="ds-objetivo" label="Objetivo da receita">
                        <Select defaultValue="proteina">
                          <SelectTrigger id="ds-objetivo">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low-carb">Low carb</SelectItem>
                            <SelectItem value="proteina">
                              Rica em proteína
                            </SelectItem>
                            <SelectItem value="economica">Econômica</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <fieldset className="space-y-3">
                        <legend className="t-eyebrow mb-3">
                          Você já vende marmitas?
                        </legend>
                        <RadioGroup defaultValue="comecando" className="gap-2">
                          {[
                            { v: "comecando", l: "Estou começando do zero" },
                            { v: "vendendo", l: "Já vendo, quero organizar" },
                            { v: "escalando", l: "Já vendo e quero escalar" },
                          ].map((op) => (
                            <Label
                              key={op.v}
                              htmlFor={`ds-${op.v}`}
                              className="cursor-pointer rounded-lg border border-border bg-surface px-4 py-3 text-[0.9375rem] font-normal transition-colors duration-150 hover:bg-surface-hover has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft"
                            >
                              <RadioGroupItem value={op.v} id={`ds-${op.v}`} />
                              {op.l}
                            </Label>
                          ))}
                        </RadioGroup>
                      </fieldset>

                      <Label
                        htmlFor="ds-check"
                        className="cursor-pointer text-[0.9375rem] font-normal"
                      >
                        <Checkbox id="ds-check" defaultChecked />
                        Incluir custo de entrega no preço
                      </Label>
                    </div>
                  </DsBloco>

                  <DsBloco rotulo="Busca">
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                      />
                      <Input
                        aria-label="Buscar receitas"
                        placeholder="Buscar receitas, ingredientes…"
                        className="pl-9"
                      />
                    </div>
                  </DsBloco>
                </div>
              </div>
            </DsSection>

            {/* 06 — Superfícies --------------------------------------- */}
            <DsSection
              id="superficies"
              numero="06"
              titulo="Superfícies"
              descricao="Card é borda de 1px sobre superfície branca. Sombra existe só em camada flutuante — menu, modal, toast."
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Card padrão</CardTitle>
                    <CardDescription>
                      Cabeçalho, conteúdo e rodapé com divisória.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="t-small text-muted">
                      O contraste vem do branco sobre o off-white do fundo, não
                      de sombra.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="secondary">
                      Abrir
                    </Button>
                  </CardFooter>
                </Card>

                <Card interactive className="cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="primary">Módulo 02</Badge>
                      <span className="t-small text-muted tabular-nums">
                        6 aulas
                      </span>
                    </div>
                    <CardTitle className="pt-1">Precificação sem chute</CardTitle>
                    <CardDescription>
                      Do custo real ao preço de tabela.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Progress value={66} aria-label="Progresso do módulo" />
                    <p className="t-small text-muted tabular-nums">
                      4 de 6 concluídas
                    </p>
                  </CardContent>
                </Card>

                <Card className="justify-between">
                  <CardHeader>
                    <CardDescription>Preço de venda sugerido</CardDescription>
                    <p className="t-metric pt-1" data-numeric>
                      R$ 24,90
                    </p>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 border-t border-border pt-4 text-[0.8125rem]">
                      {[
                        ["Custo unitário", "R$ 14,20"],
                        ["Margem aplicada", "75%"],
                        ["Lucro por marmita", "R$ 10,70"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <dt className="text-muted">{k}</dt>
                          <dd className="tabular-nums text-foreground">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <DsBloco rotulo="Abas" nota="indicador de 2px, sem cápsula">
                  <Tabs defaultValue="ficha">
                    <TabsList>
                      <TabsTrigger value="ficha">Ficha nutricional</TabsTrigger>
                      <TabsTrigger value="preparo">Modo de preparo</TabsTrigger>
                      <TabsTrigger value="custo">Custo</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ficha" className="t-body text-muted">
                      Valores calculados a partir da tabela de ingredientes, por
                      porção e no total da receita.
                    </TabsContent>
                    <TabsContent value="preparo" className="t-body text-muted">
                      Passo a passo em texto corrido, numerado.
                    </TabsContent>
                    <TabsContent value="custo" className="t-body text-muted">
                      Custo estimado por porção com base no preço médio de
                      compra dos ingredientes.
                    </TabsContent>
                  </Tabs>
                </DsBloco>
              </div>
            </DsSection>

            {/* 07 — Sinalização --------------------------------------- */}
            <DsSection
              id="sinalizacao"
              numero="07"
              titulo="Sinalização"
              descricao="Badges em caixa alta pequena funcionam como etiqueta de ficha técnica. O limão aparece aqui e no progresso — em nenhum outro lugar."
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <DsBloco rotulo="Badges">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Rascunho</Badge>
                    <Badge variant="primary">Módulo 01</Badge>
                    <Badge variant="accent">Novo</Badge>
                    <Badge variant="success">
                      <Check />
                      Concluída
                    </Badge>
                    <Badge variant="warning">Margem apertada</Badge>
                    <Badge variant="destructive">Prejuízo</Badge>
                    <Badge variant="outline">Low carb</Badge>
                  </div>
                </DsBloco>

                <DsBloco rotulo="Progresso">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="t-small text-muted">Trilha completa</span>
                        <span className="t-small tabular-nums text-foreground">
                          38%
                        </span>
                      </div>
                      <Progress value={38} aria-label="Progresso da trilha" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="t-small text-muted">
                          Meta do mês
                        </span>
                        <span className="t-small tabular-nums text-foreground">
                          82%
                        </span>
                      </div>
                      <Progress
                        value={82}
                        tone="primary"
                        aria-label="Meta do mês"
                      />
                    </div>
                  </div>
                </DsBloco>
              </div>

              <div className="mt-6 grid gap-3">
                <Alert tone="success" title="Receita salva">
                  Você encontra em Receitas · Minhas receitas.
                </Alert>
                <Alert tone="warning" title="Margem abaixo de 30%">
                  Nesse preço, um imprevisto de custo apaga o seu lucro.
                </Alert>
                <Alert tone="error" title="Não foi possível calcular">
                  Informe ao menos um ingrediente com quantidade em gramas.
                </Alert>
                <Alert tone="info" title="Base de dados">
                  Os valores nutricionais seguem a Tabela TACO, por 100 g.
                </Alert>
              </div>
            </DsSection>

            {/* 08 — Estados ------------------------------------------- */}
            <DsSection
              id="estados"
              numero="08"
              titulo="Estados"
              descricao="Todo componente que busca dado tem quatro versões desenhadas: carregando, vazio, com erro e com conteúdo. Nenhuma tela pode aparecer em branco."
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <DsBloco rotulo="Carregando" nota="esqueleto, não spinner">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-11 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-2/5" />
                        <Skeleton className="h-3 w-3/5" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </DsBloco>

                <EmptyState
                  icon={BookOpen}
                  title="Nenhuma receita salva ainda"
                  description="Monte uma receita na calculadora de macros e salve para consultar depois — inclusive offline."
                  action={
                    <Button size="sm">
                      <Plus />
                      Criar receita
                    </Button>
                  }
                />
              </div>

              <div className="mt-6">
                <DsBloco rotulo="Foco" nota="visível em tudo que é interativo">
                  <div className="space-y-3">
                    <p className="t-small text-muted">
                      Navegue com Tab: o anel de foco usa a cor da marca com 2px
                      de deslocamento e nunca é removido.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="secondary">Primeiro</Button>
                      <Input
                        aria-label="Campo de exemplo"
                        placeholder="Segundo"
                        className="w-40"
                      />
                      <Button variant="outline">Terceiro</Button>
                      <a
                        href="#cor"
                        className="rounded-sm text-[0.9375rem] text-primary underline decoration-border-strong underline-offset-4"
                      >
                        Quarto
                      </a>
                    </div>
                  </div>
                </DsBloco>
              </div>
            </DsSection>
          </div>
        </div>
      </div>
    </div>
  );
}
