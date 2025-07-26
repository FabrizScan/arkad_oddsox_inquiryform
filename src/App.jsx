import React, { useState, useEffect } from "react";
import Step1EventInfo from "./components/Step1EventInfo"; // Sarà il nuovo Step 1
import Step2LocationVenue from "./components/Step2LocationVenue"; // Nuovo Step 2
import Step3Guests from "./components/Step3Guests"; // Nuovo Step 3
import Step4MusicDetails from "./components/Step4MusicDetails"; // Nuovo Step 4
import Step5ContactNotes from "./components/Step5ContactNotes"; // Nuovo Step 5
import Stepper from "./components/Stepper";
import { Music, Calendar, MapPin, Users, MessageCircle } from "lucide-react";
import "./styles/main.css";

// --- SOLO PER DEMO LOCALE! ---
// Inserisci qui la tua URL e chiave anon di Supabase (NON service_role!)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_TABLE = "n8n_oddsox_leads_form";

const steps = [
  "Tell us about your event",
  "Location",
  "Number of Guests",
  "Music & Group Preferences",
  "Contact & Notes"
];

// Funzione per leggere i parametri URL
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    eventType: urlParams.get('event_type') || '',
    location: urlParams.get('location') || '',
    dateType: urlParams.get('date_type') || 'single',
    startDate: urlParams.get('start_date') || '',
    endDate: urlParams.get('end_date') || ''
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
    if (urlParams.eventType || urlParams.location || urlParams.startDate) {
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
        endDate: urlParams.endDate
      };
      setFormData(prefillData);
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
    return {
      user_type: formData.userType,
      event_type: formData.eventType === "other" ? formData.otherEventType : formData.eventType,
      date_type: formData.isDateRange ? "range" : "single",
      start_date: formData.startDate,
      end_date: formData.isDateRange ? formData.endDate : null,
      // Combine venue and location for Supabase
      location: formData.venue && formData.location ? `${formData.venue}, ${formData.location}` : (formData.location || formData.venue || ""),
      indoor_outdoor: formData.indoorOutdoor,
      guests: formData.guests,
      dress_code: formData.dressCode,
      concert_duration: formData.concertDuration,
      musicians: formData.musicians || [],
      other_musician: formData.otherMusician,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
    };
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
    } catch (err) {
      console.error("Submission error:", err);
      setError(`Errore: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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
              <div className="brand-main">
                <span className="brand-prefix">the</span>
                <span className="brand-name">Odd Sox</span>
              </div>
              <span className="brand-suffix">INTERNATIONAL</span>
            </div>
            <div className="header-icons">
              <Music className="header-icon" />
              <Calendar className="header-icon" />
              <MapPin className="header-icon" />
            </div>
            <h1 className="page-title">
              <span className="title-main">Interactive</span>
              <span className="title-accent">Booking</span>
            </h1>
            <p className="page-description">
              Let's create the perfect musical experience for your special day. Our step-by-step form helps us understand your vision and provide a personalized quote.
            </p>
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