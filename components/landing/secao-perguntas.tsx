import { AberturaDeSecao, Secao } from "@/components/landing/secao";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PERGUNTAS } from "@/lib/content/landing";

export function SecaoPerguntas() {
  return (
    <Secao id="perguntas" className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
        <AberturaDeSecao
          sobrelinha="Perguntas"
          titulo="O que costumam perguntar antes de assinar"
        />

        <Accordion type="single" collapsible className="w-full">
          {PERGUNTAS.map((item) => (
            <AccordionItem
              key={item.pergunta}
              value={item.pergunta}
              className="border-b border-border"
            >
              <AccordionTrigger className="py-5 text-left text-[1.0625rem] font-medium hover:no-underline">
                {item.pergunta}
              </AccordionTrigger>
              <AccordionContent className="t-body max-w-2xl pb-6 text-muted">
                {item.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Secao>
  );
}
