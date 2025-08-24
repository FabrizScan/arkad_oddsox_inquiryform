# 🧪 Test Locale Frontend/Backend

## 🚀 **Setup Sviluppo Locale**

### **1. Installazione Dependencies**

```bash
# Installa tutte le dependencies
npm run install:all
```

### **2. Configurazione Environment**

#### **Backend (.env)**

Crea `backend/.env`:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/oddsox-leads
```

#### **Frontend (.env.local)**

Crea `frontend/.env.local`:

```bash
VITE_GOOGLE_API_KEY=your-google-maps-api-key
VITE_BACKEND_API_URL=http://localhost:8787
```

### **3. Avvio Servizi**

#### **Terminal 1: Backend**

```bash
cd backend
npm run dev
```

Il backend sarà disponibile su `http://localhost:8787`

#### **Terminal 2: Frontend**

```bash
cd frontend
npm run dev
```

Il frontend sarà disponibile su `http://localhost:5173`

## 🧪 **Test Backend**

### **1. Test Endpoint Base**

```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:8787 \
  -H "Origin: http://localhost:5173"

# Test endpoint con dati validi
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
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

### **2. Test Validazione Campi**

```bash
# Test con campi mancanti
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "direct_client",
    "event_type": "wedding"
  }'
```

### **3. Test Errori**

```bash
# Test metodo non supportato
curl -X GET http://localhost:8787

# Test con dati malformati
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```

## 🧪 **Test Frontend**

### **1. Test Form Completo**

1. Apri `http://localhost:5173`
2. Compila tutti i campi del form
3. Verifica che i dati vengano inviati al backend
4. Controlla la console per i logs

### **2. Test Validazione**

1. Prova a inviare il form con campi vuoti
2. Verifica i messaggi di errore
3. Controlla che la validazione funzioni

### **3. Test Integrazione**

1. Verifica che i dati arrivino a Supabase
2. Verifica che i dati arrivino a N8N
3. Controlla i logs del backend

## 🔍 **Debug e Logs**

### **Backend Logs**

```bash
# Nel terminal del backend
[2024-01-01 10:00:00] POST / - 200 OK
[2024-01-01 10:00:01] Supabase response: {...}
[2024-01-01 10:00:02] N8N webhook sent successfully
```

### **Frontend Logs**

```javascript
// Nella console del browser
=== DEBUGGING SUBMIT ===
Fields from last step: {...}
Form data from previous steps: {...}
Final payload: {...}
Backend API URL: http://localhost:8787
Response status: 200
Success response: {...}
```

### **Network Tab**

1. Apri DevTools → Network
2. Invia il form
3. Verifica la chiamata POST al backend
4. Controlla response e headers

## 🚨 **Risoluzione Problemi**

### **Backend non risponde**

```bash
# Verifica che sia in esecuzione
lsof -i :8787

# Riavvia il servizio
cd backend
npm run dev
```

### **CORS Errors**

```bash
# Verifica headers CORS nel backend
# Dovrebbe includere:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
```

### **Supabase/N8N Errors**

```bash
# Controlla le variabili env nel backend
cd backend
cat .env

# Verifica che le URL siano corrette
# Testa le API separatamente
```

### **Frontend non si connette**

```bash
# Verifica VITE_BACKEND_API_URL
cd frontend
cat .env.local

# Dovrebbe essere: http://localhost:8787
```

## 📊 **Monitoraggio Performance**

### **Backend Metrics**

- **Response time:** < 100ms per richiesta
- **Memory usage:** < 128MB
- **CPU usage:** < 10%

### **Frontend Metrics**

- **Bundle size:** < 1MB
- **Load time:** < 2s
- **Form submission:** < 500ms

## 🔧 **Configurazione Avanzata**

### **Backend con HTTPS Locale**

```bash
# Genera certificati SSL locali
mkcert localhost 127.0.0.1

# Configura Wrangler per HTTPS
# wrangler.toml
[env.local]
local = true
local_protocol = "https"
```

### **Frontend con HTTPS**

```bash
# Vite config per HTTPS
# vite.config.js
export default {
  server: {
    https: true
  }
}
```

## 📝 **Checklist Test**

### **Backend**

- [ ] Endpoint risponde su `http://localhost:8787`
- [ ] CORS headers configurati correttamente
- [ ] Validazione campi funziona
- [ ] Connessione Supabase attiva
- [ ] Webhook N8N funziona
- [ ] Logs mostrano attività

### **Frontend**

- [ ] App si carica su `http://localhost:5173`
- [ ] Form si compila correttamente
- [ ] Validazione client-side funziona
- [ ] Submit invia dati al backend
- [ ] Console mostra logs corretti
- [ ] Network tab mostra chiamate API

### **Integrazione**

- [ ] Dati arrivano a Supabase
- [ ] Dati arrivano a N8N
- [ ] Errori gestiti correttamente
- [ ] Success message mostrato
- [ ] Form si resetta dopo submit

## 🎯 **Test Scenari**

### **Scenario 1: Form Completo**

1. Compila tutti i campi
2. Invia il form
3. Verifica successo
4. Controlla database

### **Scenario 2: Campi Mancanti**

1. Lascia campi obbligatori vuoti
2. Prova a inviare
3. Verifica messaggi errore
4. Controlla validazione

### **Scenario 3: Errori Backend**

1. Disabilita Supabase temporaneamente
2. Invia form
3. Verifica gestione errori
4. Controlla user experience

### **Scenario 4: Performance**

1. Invia form multipli rapidamente
2. Monitora response time
3. Verifica rate limiting
4. Controlla memory usage
