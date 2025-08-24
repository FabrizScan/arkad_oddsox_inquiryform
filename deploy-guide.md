# 🚀 Guida Deploy su Cloudflare

## 📋 **Prerequisiti**

1. **Account Cloudflare** attivo
2. **Repository GitHub** con il progetto
3. **Node.js** installato localmente
4. **Wrangler CLI** per il backend

## 🔧 **Setup Iniziale**

### **1. Installazione Wrangler CLI**

```bash
npm install -g wrangler
```

### **2. Login Cloudflare**

```bash
wrangler login
```

### **3. Installazione Dependencies**

```bash
npm run install:all
```

## 🌐 **Deploy Backend (Cloudflare Workers)**

### **1. Configurazione Variabili Environment**

Nel dashboard Cloudflare Workers, configura:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/oddsox-leads
```

### **2. Deploy Staging**

```bash
npm run deploy:backend:staging
```

### **3. Deploy Production**

```bash
npm run deploy:backend:production
```

### **4. Verifica Deploy**

```bash
# Test endpoint
curl -X POST https://your-backend-staging.your-subdomain.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 📄 **Deploy Frontend (Cloudflare Pages)**

### **1. Connessione Repository**

1. Vai su [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Clicca "Create a project"
3. Seleziona "Connect to Git"
4. Connetti il tuo repository GitHub

### **2. Configurazione Build**

```
Project name: oddsox-leads-frontend
Production branch: main
Framework preset: None
Build command: npm run build:frontend
Build output directory: frontend/dist
```

### **3. Environment Variables**

Nel dashboard Cloudflare Pages, configura:

```bash
VITE_GOOGLE_API_KEY=your-google-maps-api-key
VITE_BACKEND_API_URL=https://your-backend.your-subdomain.workers.dev
```

### **4. Deploy Automatico**

Il deploy avviene automaticamente ad ogni push su `main`.

## 🔄 **Workflow Deploy Completo**

### **1. Sviluppo Locale**

```bash
# Terminal 1: Frontend
npm run dev:frontend

# Terminal 2: Backend
npm run dev:backend
```

### **2. Test Locale**

```bash
# Test backend
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### **3. Deploy Backend**

```bash
npm run deploy:backend:staging
# Test staging
npm run deploy:backend:production
```

### **4. Deploy Frontend**

```bash
git add .
git commit -m "Update frontend for backend integration"
git push origin main
# Deploy automatico su Cloudflare Pages
```

## 🧪 **Test e Validazione**

### **1. Test Backend**

```bash
# Test endpoint
curl -X POST https://your-backend.your-subdomain.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "direct_client",
    "event_type": "wedding",
    "start_date": "2025-08-15",
    "location": "Milan, Italy",
    "indoor_outdoor": "indoor",
    "guests": "100-150",
    "concert_duration": "2 sets of 45 min",
    "full_name": "Test User",
    "email": "test@example.com"
  }'
```

### **2. Test Frontend**

1. Apri l'URL di Cloudflare Pages
2. Compila il form completo
3. Verifica che i dati arrivino a Supabase
4. Verifica che i dati arrivino a N8N

### **3. Verifica Logs**

- **Backend:** Cloudflare Workers dashboard
- **Frontend:** Console browser
- **Supabase:** Dashboard Supabase
- **N8N:** Logs workflow

## 🚨 **Risoluzione Problemi**

### **Backend non risponde**

```bash
# Verifica status
wrangler whoami
wrangler dev --local

# Verifica variabili env
wrangler secret list
```

### **Frontend non si connette al backend**

1. Verifica `VITE_BACKEND_API_URL` in Cloudflare Pages
2. Controlla CORS nel backend
3. Verifica che il backend sia attivo

### **Errori Supabase/N8N**

1. Verifica le variabili env nel backend
2. Controlla i logs del backend
3. Testa le API separatamente

## 📊 **Monitoraggio**

### **Cloudflare Analytics**

- **Workers:** Request count, errors, response time
- **Pages:** Page views, performance, errors

### **Logs Importanti**

- **Backend errors:** Cloudflare Workers dashboard
- **Frontend errors:** Browser console
- **API calls:** Network tab browser

## 🔒 **Sicurezza**

### **Variabili Environment**

- ✅ **Backend:** Tutte le variabili sensibili
- ✅ **Frontend:** Solo variabili pubbliche necessarie

### **CORS**

- Backend configurato per accettare richieste dal frontend
- Domini specifici possono essere limitati se necessario

### **Rate Limiting**

- Cloudflare Workers include rate limiting di base
- Configurabile per limiti specifici

## 📈 **Scaling**

### **Backend (Workers)**

- Automatico con Cloudflare
- Supporta migliaia di richieste/secondo
- Costi basati su utilizzo

### **Frontend (Pages)**

- CDN globale automatico
- Build automatico ad ogni push
- SSL automatico

## 💰 **Costi Stimati**

### **Cloudflare Workers**

- **Free tier:** 100,000 requests/day
- **Paid:** $5/month per 10M requests

### **Cloudflare Pages**

- **Free tier:** Illimitato
- **Paid:** $20/month per funzionalità avanzate

### **Totale Stimato**

- **Sviluppo/Test:** Gratuito
- **Produzione:** $5-25/month
