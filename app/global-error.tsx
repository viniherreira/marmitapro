"use client";

/**
 * Última barreira contra tela em branco.
 *
 * O `app/error.tsx` cobre as páginas, mas não o layout raiz: se algo quebra
 * ali — provider, tema, fonte — não há boundary nenhum e o navegador fica com
 * um documento vazio. No tema escuro isso é uma tela preta sem explicação.
 *
 * Este arquivo substitui o `<html>` inteiro, então não herda nada do layout:
 * os estilos vão inline de propósito, para funcionar mesmo que o CSS do
 * produto seja justamente o que falhou.
 */
export default function ErroGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
          background: "#fafaf8",
          color: "#12150f",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <main style={{ width: "100%", maxWidth: "32rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6b6f68",
            }}
          >
            MarmitaPRO
          </p>

          <h1
            style={{
              margin: "1rem 0 0",
              fontSize: "1.75rem",
              lineHeight: 1.2,
              fontFamily: "ui-serif, Georgia, serif",
              fontWeight: 400,
            }}
          >
            O aplicativo não conseguiu carregar.
          </h1>

          <p style={{ margin: "0.75rem 0 0", color: "#6b6f68" }}>
            A falha foi no carregamento da página inteira, não em uma tela
            específica. Recarregar costuma resolver.
          </p>

          <pre
            style={{
              margin: "1.5rem 0 0",
              padding: "0.875rem 1rem",
              overflowX: "auto",
              borderRadius: "0.75rem",
              border: "1px solid #e4e4df",
              background: "#fff",
              fontSize: "0.8125rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {error.message || "Erro desconhecido."}
            {error.digest ? `\ndigest ${error.digest}` : ""}
          </pre>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              height: "2.5rem",
              padding: "0 1rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "#123b2e",
              color: "#f6faf5",
              fontSize: "0.9375rem",
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  );
}
