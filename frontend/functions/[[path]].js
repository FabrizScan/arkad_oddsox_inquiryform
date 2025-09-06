// Cloudflare Pages Functions - Binding configuration
// Questo file configura il binding tra il frontend (Pages) e il backend (Worker)

export const onRequest = async (context) => {
  // Questo file serve principalmente per configurare i bindings
  // Il vero handling delle richieste avviene tramite l'API client
  
  const { request, env } = context;
  
  // Rendi il binding disponibile al frontend
  if (typeof window === 'undefined' && env.BACKEND_WORKER) {
    // Lato server: esponi il binding tramite variabile globale
    globalThis.env = env;
  }
  
  // Per tutte le altre richieste, serve il frontend statico
  return context.next();
};