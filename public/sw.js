/**
 * Service worker do MarmitaPRO.
 *
 * Estratégia:
 *  - assets versionados do Next (/_next/static) → cache primeiro, são imutáveis
 *  - ícones e manifesto → cache primeiro
 *  - navegação → rede primeiro, com a página /offline como reserva
 *
 * Nada de dado de usuário é guardado em cache: as telas do app são
 * renderizadas no servidor e dependem de sessão.
 */

const VERSAO = "marmitapro-v1";
const CACHE_ESTATICO = `${VERSAO}-estatico`;
const CACHE_PAGINAS = `${VERSAO}-paginas`;

const RESERVA_OFFLINE = "/offline";

const PRECARGA = [
  RESERVA_OFFLINE,
  "/manifest.webmanifest",
  "/icone-192.png",
  "/icone-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_ESTATICO)
      .then((cache) => cache.addAll(PRECARGA))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves
            .filter((chave) => !chave.startsWith(VERSAO))
            .map((chave) => caches.delete(chave))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  const requisicao = evento.request;

  if (requisicao.method !== "GET") return;

  const url = new URL(requisicao.url);
  if (url.origin !== self.location.origin) return;

  // Nunca interceptar autenticação nem rotas de API.
  if (url.pathname.startsWith("/api") || url.pathname.includes("clerk")) {
    return;
  }

  if (requisicao.mode === "navigate") {
    evento.respondWith(
      fetch(requisicao)
        .then((resposta) => {
          const copia = resposta.clone();
          caches
            .open(CACHE_PAGINAS)
            .then((cache) => cache.put(requisicao, copia))
            .catch(() => undefined);
          return resposta;
        })
        .catch(async () => {
          const emCache = await caches.match(requisicao);
          if (emCache) return emCache;

          const reserva = await caches.match(RESERVA_OFFLINE);
          return (
            reserva ??
            new Response("Você está offline.", {
              status: 503,
              headers: { "content-type": "text/plain; charset=utf-8" },
            })
          );
        })
    );
    return;
  }

  const estatico =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icone-") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff2");

  if (!estatico) return;

  evento.respondWith(
    caches.match(requisicao).then((emCache) => {
      if (emCache) return emCache;

      return fetch(requisicao).then((resposta) => {
        if (resposta.ok) {
          const copia = resposta.clone();
          caches
            .open(CACHE_ESTATICO)
            .then((cache) => cache.put(requisicao, copia))
            .catch(() => undefined);
        }
        return resposta;
      });
    })
  );
});
