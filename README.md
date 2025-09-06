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

## 🔄 **Compatibilità Cloudflare Pages + Vercel**

Il progetto supporta deployment sia su **Cloudflare Pages** che su **Vercel** automaticamente:

### **Sistema di Comunicazione Adattivo**

- **Su Cloudflare Pages**: Usa service bindings per comunicazione interna
- **Su Vercel/Altri**: Usa URL HTTP tradizionali
- **Fallback Automatico**: Se i bindings non sono disponibili

### **Configurazione Cloudflare Pages con Service Bindings**

Per abilitare la comunicazione ottimizzata su Cloudflare Pages:

#### 1. Deploy del Backend Worker
```bash
cd backend
npm run deploy:production
```

#### 2. Configurazione Service Binding nel Dashboard

1. Vai su **Cloudflare Pages** → Il tuo sito frontend
2. **Settings** → **Functions** 
3. **Service Bindings** → **Add binding**
4. Aggiungi:
   - **Variable name**: `BACKEND_WORKER`
   - **Service**: `oddsox-inquiry-form-backend`
   - **Environment**: `production`

#### 3. Deploy del Frontend
```bash
cd frontend
npm run build
# Deploy tramite Cloudflare Pages (Git integration)
```

### **Configurazione Vercel (invariata)**

Su Vercel continua a funzionare normalmente usando:
- `VITE_BACKEND_API_URL` che punta al Worker URL

### **Comandi Deploy Specifici**

```bash
# Per Cloudflare (backend + frontend con bindings)
npm run deploy:cloudflare

# Per Vercel (backend + frontend con URL)
npm run deploy:vercel
```

### **Vantaggi dei Service Bindings**

- ✅ **Prestazioni**: Comunicazione diretta senza HTTP esterno
- ✅ **Sicurezza**: Nessuna esposizione pubblica del backend
- ✅ **Affidabilità**: Niente CORS o problemi di rete
- ✅ **Compatibilità**: Fallback automatico se necessario

## ⚙️ **Setup Environment Variables**

### **Sviluppo Locale**

#### 1. Backend (.env)
```bash
cd backend
cp env.example .env
# Modifica .env con le tue credenziali reali
```

**Contenuto `backend/.env`:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/oddsox-leads
```

#### 2. Frontend (.env.local)
```bash
cd frontend
cp env.example .env.local
# Modifica .env.local con le tue configurazioni
```

**Contenuto `frontend/.env.local`:**
```bash
VITE_GOOGLE_API_KEY=your-google-maps-api-key
VITE_BACKEND_API_URL=http://localhost:8787
```

### **Produzione (Cloudflare)**

- **Backend**: Configura le variabili nel dashboard Cloudflare Workers
- **Frontend**: Configura le variabili nel dashboard Cloudflare Pages

## 🚀 **GitHub Actions Deploy**

### **Secrets Richiesti**

Configura questi secrets nel repository GitHub:

| Name                    | Value                         | Come ottenerlo |
|------------------------|-------------------------------|----------------|
| `CLOUDFLARE_API_TOKEN` | Token API Cloudflare         | Dashboard → API Tokens → Create Token |
| `CLOUDFLARE_ACCOUNT_ID`| Account ID Cloudflare        | Dashboard → Sidebar destra → Copy |

### **Permessi Token**
- **Account:** Cloudflare Workers:Edit
- **Account:** Cloudflare Pages:Edit

## 📁 **Architettura Migrata**

### **Prima (Vulnerabile)**
- ❌ Variabili env esposte nel frontend
- ❌ Chiavi API nel bundle JavaScript
- ❌ Chiamate dirette a Supabase/N8N dal browser

### **Dopo (Sicuro)**
- ✅ Variabili env protette nel backend
- ✅ Chiavi API nascoste in Cloudflare Workers
- ✅ Frontend comunica solo con backend sicuro

### **Flusso Dati**
```
Browser → Frontend → Backend → Supabase + N8N
   ↓         ↓         ↓         ↓
   User    React    Workers   Database + Automation
```

## 🛠️ **Development & Testing**

### **Test Locale**
```bash
# Start backend
npm run dev:backend

# Start frontend (altro terminale)
npm run dev:frontend

# Test form submission
# Il form dovrebbe connettersi a localhost:8787
```

### **Verifica Setup**
```bash
# Controlla file env creati
ls -la backend/.env
ls -la frontend/.env.local

# Verifica che NON siano nel git
git status  # Non dovrebbero apparire
```

## 🆘 **Troubleshooting**

### **Deploy Issues**
- **Error 403**: Verifica permessi token Cloudflare
- **Error 401**: Token scaduto, generane uno nuovo
- **Deploy fallito**: Controlla logs workflow GitHub Actions

### **Local Development**
- **Backend non si avvia**: Verifica file `backend/.env` esista
- **Frontend errori API**: Controlla `VITE_BACKEND_API_URL` in `.env.local`
- **CORS errors**: Riavvia il backend dopo modifiche

### **Environment Variables**
- **File .env nel git**: Verifica `.gitignore` contenga `.env` e `.env.local`
- **Variabili non caricate**: Riavvia servizi dopo creazione file env

## 📝 **Supporto**

Per problemi:
1. Controlla logs Cloudflare Workers/Pages dashboard
2. Verifica configurazione environment variables
3. Per Cloudflare Pages: verifica service bindings
4. Test API con Postman/curl
5. GitHub Actions logs per deploy issues
