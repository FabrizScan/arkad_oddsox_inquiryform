# 🔐 GitHub Secrets Configuration

## 📋 **Secrets Richiesti per Deploy Automatico**

Questi secrets devono essere configurati nel repository GitHub per abilitare il deploy automatico su Cloudflare.

### **1. CLOUDFLARE_API_TOKEN**

**Come ottenere:**

1. Vai su [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Clicca "Create Token"
3. Usa il template "Custom token"
4. Permessi richiesti:
   - **Account:** Cloudflare Workers:Edit
   - **Account:** Cloudflare Pages:Edit
   - **Zone:** Cloudflare Workers:Edit (se necessario)

**Valore:** Il token generato (es: `abc123def456...`)

### **2. CLOUDFLARE_ACCOUNT_ID**

**Come ottenere:**

1. Vai su [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. L'Account ID è visibile nella sidebar destra
3. Clicca "Copy" per copiarlo

**Valore:** 32 caratteri alfanumerici (es: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### **3. GITHUB_TOKEN**

**Note:** Questo token è automaticamente fornito da GitHub Actions, non devi configurarlo manualmente.

## ⚙️ **Configurazione Secrets**

### **1. Vai su GitHub Repository**

```
https://github.com/username/repository-name/settings/secrets/actions
```

### **2. Clicca "New repository secret"**

### **3. Aggiungi ogni secret:**

| Name                    | Value                        |
| ----------------------- | ---------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Il tuo Cloudflare API token  |
| `CLOUDFLARE_ACCOUNT_ID` | Il tuo Cloudflare Account ID |

## 🔍 **Verifica Configurazione**

### **1. Controlla i Secrets**

- Vai su `Settings` → `Secrets and variables` → `Actions`
- Verifica che tutti i secrets siano presenti

### **2. Test Deploy**

- Fai un push su `main`
- Vai su `Actions` tab
- Verifica che il workflow si avvii correttamente

### **3. Verifica Logs**

- Se ci sono errori, controlla i logs del workflow
- Verifica che i secrets siano accessibili

## 🚨 **Sicurezza**

### **Best Practices:**

- ✅ **Non condividere** mai i tokens
- ✅ **Ruotare** periodicamente i tokens
- ✅ **Limitare** i permessi al minimo necessario
- ✅ **Monitorare** l'uso dei tokens

### **Permessi Minimi:**

- **Workers:** Solo deploy e gestione
- **Pages:** Solo deploy
- **Zone:** Solo se necessario per Workers

## 📊 **Monitoraggio**

### **Cloudflare Dashboard:**

- **Workers:** Verifica deploy e logs
- **Pages:** Verifica build e deploy
- **Analytics:** Monitora performance

### **GitHub Actions:**

- **Workflow runs:** Controlla status deploy
- **Logs:** Debug errori e problemi
- **Artifacts:** Verifica build frontend

## 🔧 **Troubleshooting**

### **Error 403 (Forbidden)**

- Verifica che il token abbia i permessi corretti
- Controlla che l'Account ID sia corretto

### **Error 401 (Unauthorized)**

- Il token potrebbe essere scaduto
- Genera un nuovo token

### **Deploy Fallito**

- Controlla i logs del workflow
- Verifica la configurazione di Wrangler
- Controlla le variabili env nel backend

## 📝 **Note Importanti**

1. **I secrets sono crittografati** e non visibili nel codice
2. **Ogni push su main** triggera il deploy automatico
3. **Il backend viene deployato prima** del frontend
4. **I secrets sono condivisi** tra tutti i workflow
5. **Non committare mai** tokens o secrets nel codice
