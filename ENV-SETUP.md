# ⚙️ Configurazione Variabili Environment - GUIDA RAPIDA

## 🎯 **File da CREARE (per sviluppo locale)**

### **1. Backend (.env)**

```bash
# Crea questo file: backend/.env
cd backend
cp env.example .env
# Ora modifica .env con le tue credenziali reali
```

**Contenuto `backend/.env`:**

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/oddsox-leads
```

### **2. Frontend (.env.local)**

```bash
# Crea questo file: frontend/.env.local
cd frontend
cp env.example .env.local
# Ora modifica .env.local con le tue configurazioni reali
```

**Contenuto `frontend/.env.local`:**

```bash
VITE_GOOGLE_API_KEY=your-google-maps-api-key
VITE_BACKEND_API_URL=http://localhost:8787
```

## 📁 **Struttura Finale**

```
oddsox-leads-form/
├── backend/
│   ├── .env                    ← CREA (tue credenziali reali)
│   └── env.example            ← Template (committare)
├── frontend/
│   ├── .env.local             ← CREA (tue configurazioni locali)
│   └── env.example            ← Template (committare)
└── .gitignore                 ← Già configurato correttamente
```

## 🚨 **IMPORTANTE - Sicurezza**

### **✅ File SICURI (committare)**

- `backend/env.example` - Template per backend
- `frontend/env.example` - Template per frontend

### **❌ File SENSIBILI (NON committare)**

- `backend/.env` - Credenziali reali
- `frontend/.env.local` - Configurazioni locali

### **🔒 Protezione Automatica**

- `.gitignore` è già configurato
- I file `.env` e `.env.local` NON verranno mai committati
- Le credenziali sono al sicuro

## 🚀 **Comandi Rapidi**

### **Setup Completo**

```bash
# 1. Crea file backend
cd backend
cp env.example .env
# Modifica .env con le tue credenziali

# 2. Crea file frontend
cd ../frontend
cp env.example .env.local
# Modifica .env.local con le tue configurazioni

# 3. Torna alla root
cd ..
```

### **Verifica Setup**

```bash
# Controlla che i file siano creati
ls -la backend/.env
ls -la frontend/.env.local

# Controlla che NON siano nel git
git status
# Non dovrebbero apparire file .env
```

## 🌐 **Configurazione Produzione**

### **Backend (Cloudflare Workers)**

- Le variabili vanno configurate nel dashboard Cloudflare
- Usa `wrangler secret put` per variabili sensibili

### **Frontend (Cloudflare Pages)**

- Le variabili vanno configurate nel dashboard Cloudflare Pages
- `VITE_BACKEND_API_URL` sarà l'URL del tuo Workers

## 🔍 **Troubleshooting**

### **File .env non trovato**

```bash
# Verifica che sia nella cartella giusta
pwd
ls -la .env

# Se non esiste, crealo
cp env.example .env
```

### **Variabili non caricate**

```bash
# Riavvia il servizio dopo aver creato .env
npm run dev:backend
npm run dev:frontend
```

### **Git status mostra file .env**

```bash
# Verifica .gitignore
cat .gitignore

# Se necessario, aggiungi
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

## 📝 **Checklist Setup**

- [ ] Creato `backend/.env` con credenziali reali
- [ ] Creato `frontend/.env.local` con configurazioni locali
- [ ] File `.env` e `.env.local` NON appaiono in `git status`
- [ ] Backend si avvia con `npm run dev:backend`
- [ ] Frontend si avvia con `npm run dev:frontend`
- [ ] Form si connette al backend locale

## 🎯 **Riepilogo**

1. **CREA** `backend/.env` e `frontend/.env.local`
2. **COPIA** i template da `env.example`
3. **COMPILA** con i tuoi valori reali
4. **VERIFICA** che non siano nel git
5. **TESTA** lo sviluppo locale

I file `.env` sono per TE, i file `env.example` sono per il TEAM! 🚀
