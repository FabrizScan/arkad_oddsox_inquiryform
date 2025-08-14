import React, { useState, useEffect } from "react";
import Step1EventInfo from "./components/Step1EventInfo"; // Sarà il nuovo Step 1
import Step2LocationVenue from "./components/Step2LocationVenue"; // Nuovo Step 2
import Step3Guests from "./components/Step3Guests"; // Nuovo Step 3
import Step4MusicDetails from "./components/Step4MusicDetails"; // Nuovo Step 4
import Step5ContactNotes from "./components/Step5ContactNotes"; // Nuovo Step 5
import Stepper from "./components/Stepper";
import { Music, Calendar, MapPin, Users, MessageCircle } from "lucide-react";
import "./styles/main.css";
import logoImage from "./images/ORANGE_HORIZONTAL.png";

// --- SOLO PER DEMO LOCALE! ---
// Inserisci qui la tua URL e chiave anon di Supabase (NON service_role!)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_TABLE = "n8n_oddsox_leads_form";

const steps = [
  "",
  "",
  "",
  "",
  ""
];

// Funzione per leggere i parametri URL
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    eventType: urlParams.get('event_type') || '',
    location: urlParams.get('location') || '',
    dateType: urlParams.get('date_type') || 'single',
    startDate: urlParams.get('start_date') || '',
    endDate: urlParams.get('end_date') || '',
    fullName: urlParams.get('full_name') || '',
    email: urlParams.get('email') || '',
    airtableRecordId: urlParams.get('airtable_record_id') || '',
    airtableContactId: urlParams.get('airtable_contact_id') || '',
  };
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Precompila il form con i parametri URL al caricamento
  useEffect(() => {
    const urlParams = getUrlParams();
    if (urlParams.eventType || urlParams.location || urlParams.startDate || urlParams.fullName || urlParams.email) {
      // Gestione event_type personalizzato
      let eventType = urlParams.eventType;
      let otherEventType = '';

      // Se l'event_type non è nelle opzioni predefinite, imposta "other"
      const validEventTypes = ['wedding', 'private_event', 'corporate_event', 'other'];
      if (eventType && !validEventTypes.includes(eventType)) {
        otherEventType = eventType; // Salva il valore originale
        eventType = 'other'; // Imposta come "other"
      }

      const prefillData = {
        eventType: eventType,
        otherEventType: otherEventType,
        location: urlParams.location,
        isDateRange: urlParams.dateType === 'range',
        startDate: urlParams.startDate,
        endDate: urlParams.endDate,
        fullName: urlParams.fullName,
        email: urlParams.email,
        airtableRecordId: urlParams.airtableRecordId,
        airtableContactId: urlParams.airtableContactId,
      };
      setFormData(prefillData);
      
      // Rimuovo il salto automatico allo step finale
      // L'utente parte sempre dallo step 1
      
      console.log('Form precompilato con parametri URL:', prefillData);
    }
  }, []);

  // Aggiorna i dati del form per lo step corrente
  const updateForm = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Passa allo step successivo
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Torna allo step precedente
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Adatta i dati del form per la tabella Supabase
  function mapFormDataToPayload(formData) {
    const payload = {
      user_type: formData.bookingFor || "",
      event_type: formData.eventType === "other" ? formData.otherEventType : formData.eventType || "",
      date_type: formData.isDateRange ? "range" : "single",
      start_date: formData.startDate,
      end_date: formData.isDateRange ? formData.endDate : null,
      // Location now contains "name, address" format from Google Places API
      location: formData.location || "",
      indoor_outdoor: formData.indoorOutdoor,
      guests: formData.guests || "",
      dress_code: formData.dressCode || "",
      concert_duration: formData.concertDurationType === "other" ? formData.otherConcertDuration : formData.concertDurationType,
      musicians: formData.musicians || [],
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
    };
    return payload;
  }

  // Unisce i dati dell'ultimo step e invia tutto a Supabase
  const handleFinalSubmit = async (fields) => {
    setSubmitting(true);
    setError(null);

    console.log("=== DEBUGGING SUBMIT ===");
    console.log("Fields from last step:", fields);
    console.log("Form data from previous steps:", formData);

    try {
      // Unisci i dati dell'ultimo step con quelli precedenti
      const finalData = { ...formData, ...fields };
      const payload = mapFormDataToPayload(finalData);

      // Required fields validation
      const requiredFields = ['user_type', 'event_type', 'start_date', 'location', 'indoor_outdoor', 'guests', 'concert_duration', 'full_name', 'email'];
      const missingFields = requiredFields.filter(field => !payload[field] || payload[field].toString().trim() === '');

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log("Final payload:", payload);
      console.log("SUPABASE_TABLE constant:", SUPABASE_TABLE);
      console.log("SUPABASE_URL constant:", SUPABASE_URL);
      console.log("Type of SUPABASE_TABLE:", typeof SUPABASE_TABLE);
      console.log("Length of SUPABASE_TABLE:", SUPABASE_TABLE.length);
      console.log("SUPABASE_TABLE char by char:", SUPABASE_TABLE.split('').map((char, i) => `${i}:${char}`).join(', '));

      const rawUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`;
      console.log("Raw URL construction:", `${SUPABASE_URL}/rest/v1/` + SUPABASE_TABLE);
      console.log("Raw URL result:", rawUrl);

      const url = `${SUPABASE_URL}/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}`;
      console.log("Encoded URL:", url);
      console.log("URL being used in fetch:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Error response text:", errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const result = await res.json();
      console.log("Success response:", result);

      setSubmitted(true);
      setFormData({});

      // Send to N8N webhook
      try {
        await sendToN8nWebhook(finalData);
        console.log("N8N webhook sent successfully");
      } catch (n8nError) {
        console.error("N8N webhook error (non-blocking):", n8nError);
        // N8N errors don't block the form submission
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(`Errore: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Funzione per inviare tutti i dati al webhook n8n
  async function sendToN8nWebhook(formData) {
    try {
      const webhookUrl = 'https://n8n.arkad.agency/webhook/0e93ac30-e2eb-4328-8c95-d1759a956a52';
      
      console.log('=== N8N WEBHOOK DEBUG ===');
      console.log('Sending complete data to n8n webhook');
      
      // Crea un payload più chiaro per n8n
      const webhookPayload = {
        ...formData,
        soundSystemRequired: formData.soundSystemRequired
      };
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('N8N webhook success:', result);
      return result;
    } catch (error) {
      console.error('N8N webhook error:', error);
      throw error;
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1EventInfo
            data={formData}
            onNext={handleNext}
            onUpdate={updateForm}
          />
        );
      case 1:
        return (
          <Step2LocationVenue
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdate={updateForm}
          />
        );
      case 2:
        return (
          <Step3Guests
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdate={updateForm}
          />
        );
      case 3:
        return (
          <Step4MusicDetails
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdate={updateForm}
          />
        );
      case 4:
        return (
          <Step5ContactNotes
            data={formData}
            onBack={handleBack}
            onSubmit={handleFinalSubmit} // Passa la nuova funzione di submit
            submitting={submitting}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`page-container ${submitted ? "submitted" : ""}`}>
      {submitted ? (
        <div className="submission-success">
          <h2>Thank You!</h2>
          <p>Your event details have been successfully submitted. We'll be in touch soon!</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(0); // Torna allo step 1
              setFormData({}); // Resetta tutti i dati
              setError(null);
            }}
            className="button"
          >
            Submit another form
          </button>
        </div>
      ) : (
        <>
          {/* Page Header Content */}
          <div className="page-header">
            <div className="brand-header">
              <img src={logoImage} alt="The Odd Sox International" className="brand-logo" />
            </div>
            <h1 className="page-title">
              <span className="title-main">Interactive</span>
              <span className="title-accent">Booking</span>
            </h1>
          </div>

          {/* Yellow Info Box */}
          <div className="info-box-yellow">
            <p>Let's create the perfect musical experience for your special day!<br />This quick form helps us understand your needs so we can provide a tailored quote.</p>
          </div>

          {/* Form Container */}
          <div className="form-container">
            <Stepper steps={steps} currentStep={currentStep} />
            {renderStep()}
          </div>
        </>
      )}
    </div>
  );
}