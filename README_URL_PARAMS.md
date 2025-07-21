# Precompilazione Form via URL Parameters

Il form può essere precompilato passando parametri nell'URL. Questo è utile per integrare il form in altri sistemi o per creare link diretti con dati predefiniti.

## Parametri Supportati

| Parametro    | Tipo | Descrizione                 | Esempio                                                                                  |
| ------------ | ---- | --------------------------- | ---------------------------------------------------------------------------------------- |
| `event_type` | text | Tipo di evento              | `wedding`, `private_event`, `corporate_event`, `other` o qualsiasi valore personalizzato |
| `location`   | text | Località dell'evento        | `Milano, Italia`                                                                         |
| `date_type`  | text | Tipo di data                | `single` o `range`                                                                       |
| `start_date` | date | Data di inizio (YYYY-MM-DD) | `2025-07-15`                                                                             |
| `end_date`   | date | Data di fine (YYYY-MM-DD)   | `2025-07-16`                                                                             |

## Gestione Event Type Personalizzati

Se passi un `event_type` che non è nelle opzioni predefinite (es. `festival`, `concert`, `exhibition`), il form:

1. **Seleziona automaticamente "Other"** nel radio button
2. **Precompila il campo "Please specify"** con il valore passato
3. **Mantiene la validazione** normale

### Esempio con evento personalizzato:

```
http://localhost:5173/?event_type=festival&location=Milano&date_type=single&start_date=2025-07-20
```

**Risultato:**

- Radio button "Other" selezionato
- Campo "Please specify" precompilato con "festival"
- Tutti gli altri campi funzionano normalmente

## Esempi di Utilizzo

### 1. Evento singolo

```
https://tuodominio.com/form?event_type=wedding&location=Milano&date_type=single&start_date=2025-07-15
```

### 2. Evento con range di date

```
https://tuodominio.com/form?event_type=corporate_event&location=Roma&date_type=range&start_date=2025-08-01&end_date=2025-08-03
```

### 3. Solo tipo evento

```
https://tuodominio.com/form?event_type=private_event
```

### 4. Solo location

```
https://tuodominio.com/form?location=Parigi, Francia
```

## Comportamento

- I parametri sono **opzionali**
- Se un parametro non è presente, il campo rimane vuoto
- Se `date_type=range` ma `end_date` non è specificata, il campo end date rimane vuoto
- I valori vengono decodificati automaticamente (spazi, caratteri speciali, ecc.)

## Integrazione con Altri Sistemi

### WordPress

```php
$form_url = 'https://tuodominio.com/form?' . http_build_query([
    'event_type' => get_field('event_type'),
    'location' => get_field('location'),
    'date_type' => 'single',
    'start_date' => get_field('event_date')
]);
```

### CRM/Email Marketing

```
https://tuodominio.com/form?event_type={{event_type}}&location={{location}}&start_date={{event_date}}
```

### Landing Page

```html
<a
  href="https://tuodominio.com/form?event_type=wedding&location=Milano"
  class="cta-button"
>
  Prenota per il tuo matrimonio
</a>
```

## Note Tecniche

- I parametri vengono letti al caricamento della pagina
- I campi precompilati possono essere modificati dall'utente
- La validazione funziona normalmente sui campi precompilati
- I parametri URL non vengono salvati nel database (solo i dati del form)
