# OddSox Leads Form

Form multi-step moderno ed elegante per la raccolta di informazioni dettagliate per prenotazioni di eventi musicali, ispirato allo stile di [theoddsoxinternational.com](https://theoddsoxinternational.com/).

## 🏗️ **Nuova Architettura (v2.0)**

Il progetto è stato separato in **frontend** e **backend** per risolvere le criticità di sicurezza:

### **Frontend** (React + Vite)

- **Posizione:** `frontend/`
- **Deploy:** Cloudflare Pages
- **Caratteristiche:** Nessuna modifica al codice esistente, solo cambio endpoint API

### **Backend** (Cloudflare Workers)

- **Posizione:** `backend/`
- **Deploy:** Cloudflare Workers
- **Funzioni:** Gestione sicura delle chiamate a Supabase e N8N

## 🔒 **Sicurezza Migliorata**

### **Prima (vulnerabile):**

- ❌ Variabili env esposte nel frontend
- ❌ Chiavi API nel bundle JavaScript
- ❌ Chiamate dirette a Supabase/N8N dal browser

### **Dopo (sicuro):**

- ✅ Variabili env solo nel backend
- ✅ Chiavi API protette in Cloudflare Workers
- ✅ Frontend comunica solo con il backend

## 🚀 **Setup e Deploy**

### **1. Installazione Dependencies**

```bash
npm run install:all
```

### **2. Sviluppo Locale**

```bash
# Frontend
npm run dev:frontend

# Backend (in un altro terminale)
npm run dev:backend
```

### **3. Deploy Backend**

```bash
# Staging
npm run deploy:backend:staging

# Production
npm run deploy:backend:production
```

### **4. Deploy Frontend**

```bash
# Build e deploy su Cloudflare Pages
npm run deploy:frontend
```

## ⚙️ **Configurazione**

### **Backend (.env)**

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/oddsox-leads
```

### **Frontend (.env)**

```bash
VITE_GOOGLE_API_KEY=your-google-maps-api-key
VITE_BACKEND_API_URL=https://your-backend.your-subdomain.workers.dev
```

## 🌐 **Deploy su Cloudflare**

### **Frontend (Cloudflare Pages)**

1. Connettere il repository GitHub
2. Build command: `npm run build:frontend`
3. Build output directory: `frontend/dist`
4. Environment variables: Solo `VITE_GOOGLE_API_KEY` e `VITE_BACKEND_API_URL`

### **Backend (Cloudflare Workers)**

1. Installare Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Configurare variabili env nel dashboard Cloudflare
4. Deploy: `npm run deploy:backend:production`

## 📁 **Struttura Progetto**

```
oddsox-leads-form/
├── frontend/                 # React app esistente
│   ├── src/                 # Codice sorgente
│   ├── package.json         # Dependencies frontend
│   └── env.example         # Variabili frontend
├── backend/                 # Cloudflare Workers
│   ├── src/index.js        # Logica backend
│   ├── wrangler.toml       # Configurazione Workers
│   ├── package.json        # Dependencies backend
│   └── env.example         # Variabili backend
├── package.json             # Root package.json
└── README.md               # Questo file
```

## 🔄 **Flusso Dati**

```
Frontend → Backend → Supabase + N8N
   ↓           ↓         ↓
React App   Workers   Database + Automation
```

## 🛠️ **Comandi Utili**

```bash
# Sviluppo completo
npm run dev

# Build completo
npm run build

# Deploy completo
npm run deploy:backend:production
npm run deploy:frontend

# Solo frontend
npm run dev:frontend
npm run build:frontend

# Solo backend
npm run dev:backend
npm run deploy:backend:staging
```

## 🔍 **Monitoraggio e Debug**

### **Frontend**

- Console browser per errori di validazione
- Network tab per chiamate API

### **Backend**

- Cloudflare Workers dashboard per logs
- Wrangler dev per sviluppo locale

## 📝 **Note Importanti**

1. **Nessuna modifica al frontend esistente** - solo cambio endpoint
2. **Variabili env sensibili** sono ora nel backend
3. **Deploy separato** per frontend e backend
4. **1 repository GitHub** per entrambi i progetti
5. **Cloudflare Pages** per frontend e backend

## 🆘 **Supporto**

Per problemi o domande:

1. Controllare i logs del backend in Cloudflare Workers
2. Verificare le variabili env nel dashboard Cloudflare
3. Testare le API con Postman o curl
