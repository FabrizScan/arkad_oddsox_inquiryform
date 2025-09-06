// API client che gestisce la comunicazione frontend-backend
// Supporta sia Cloudflare Pages (con bindings) che Vercel (con URL)

export class ApiClient {
  constructor() {
    this.backendUrl = import.meta.env.VITE_BACKEND_API_URL;
    this.isCloudflarePages = this.detectCloudflarePages();
  }

  // Rileva se stiamo girando su Cloudflare Pages
  detectCloudflarePages() {
    // Controlli per Cloudflare Pages
    return (
      // Build-time environment variable
      import.meta.env.CF_PAGES === '1' ||
      // Runtime environment checks
      (typeof window !== 'undefined' && 
       (window.CloudflareWorkers || window.__CF_ENV__)) ||
      // User-Agent check per Cloudflare
      (typeof navigator !== 'undefined' && 
       navigator.userAgent.includes('Cloudflare'))
    );
  }

  // Invia richiesta al backend usando il metodo appropriato
  async submitForm(payload) {
    if (this.isCloudflarePages) {
      return this.submitWithBinding(payload);
    } else {
      return this.submitWithUrl(payload);
    }
  }

  // Metodo per Cloudflare Pages con Service Binding
  async submitWithBinding(payload) {
    console.log('Attempting Cloudflare binding submission...');
    
    try {
      // Controllo per il binding del worker
      const backendWorker = this.getBackendWorkerBinding();
      
      if (backendWorker) {
        console.log('Using Cloudflare service binding');
        // Usa il binding del worker
        const response = await backendWorker.fetch(new Request('https://dummy-url/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }));

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Backend error: HTTP ${response.status}: ${errorText}`);
        }

        return await response.json();
      } else {
        // Fallback all'URL se il binding non è disponibile
        console.warn('Cloudflare binding not available, falling back to URL method');
        return this.submitWithUrl(payload);
      }
    } catch (error) {
      console.error('Binding submission failed, falling back to URL:', error);
      return this.submitWithUrl(payload);
    }
  }

  // Helper per ottenere il binding del worker
  getBackendWorkerBinding() {
    // Controlla diverse possibili posizioni del binding
    if (typeof globalThis !== 'undefined' && globalThis.env && globalThis.env.BACKEND_WORKER) {
      return globalThis.env.BACKEND_WORKER;
    }
    if (typeof window !== 'undefined' && window.env && window.env.BACKEND_WORKER) {
      return window.env.BACKEND_WORKER;
    }
    if (typeof env !== 'undefined' && env.BACKEND_WORKER) {
      return env.BACKEND_WORKER;
    }
    return null;
  }

  // Metodo tradizionale con URL (per Vercel e fallback)
  async submitWithUrl(payload) {
    if (!this.backendUrl) {
      throw new Error('Backend API URL not configured');
    }

    const response = await fetch(this.backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  }
}

// Singleton instance
export const apiClient = new ApiClient();