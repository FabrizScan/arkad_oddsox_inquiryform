import React, { useState, useEffect } from "react";
import Step1EventInfo from "./components/Step1EventInfo"; // Sarà il nuovo Step 1
import Step2LocationVenue from "./components/Step2LocationVenue"; // Nuovo Step 2
import Step3Guests from "./components/Step3Guests"; // Nuovo Step 3
import Step4MusicDetails from "./components/Step4MusicDetails"; // Nuovo Step 4
import Step5ContactNotes from "./components/Step5ContactNotes"; // Nuovo Step 5
import Stepper from "./components/Stepper";
import { Zap, Sparkles } from "lucide-react";
import { apiClient } from "./utils/apiClient";
import "./styles/main.css";
import logoImage from "./images/ORANGE_HORIZONTAL.png";


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

  // Determine source with priority: utm_source > social > referrer
  let source = '';
  const utmSource = urlParams.get('utm_source');
  const socialParam = urlParams.get('social');

  if (utmSource) {
    // Use UTM source if available (industry standard)
    source = utmSource;
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');

    // Append additional UTM parameters if available
    if (utmMedium) source += `/${utmMedium}`;
    if (utmCampaign) source += `/${utmCampaign}`;
  } else if (socialParam) {
    // Fallback to custom 'social' parameter
    source = socialParam;
  } else if (document.referrer) {
    // Fallback to referrer if no params provided
    try {
      const referrerUrl = new URL(document.referrer);
      source = `referrer:${referrerUrl.hostname}`;
    } catch (e) {
      source = 'direct';
    }
  } else {
    source = 'direct';
  }

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
    source: source, // Add source tracking
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
      source: urlParams.source, // ALWAYS save source tracking
    };

    setFormData(prefillData);

    console.log('📊 Form initialized with URL params:', prefillData);
    console.log('🎯 Traffic source detected:', urlParams.source);
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
      record_id: formData.airtableRecordId || "",
      contact_id: formData.airtableContactId || "",
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
      concert_duration: (() => {
        let baseDuration = formData.concertDurationType;
        let extraSets = formData.extraSets || "";

        if (!extraSets) {
          return baseDuration;
        }

        if (extraSets === '1_extra_set') {
          return baseDuration + ' + 1 extra set';
        } else if (extraSets === '2_extra_sets') {
          return baseDuration + ' + 2 extra sets';
        }

        return baseDuration;
      })(),
      musicians: formData.musicians || [],
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
      marketing_consent: formData.marketingConsent || false,
      source: formData.source || 'direct', // Add source tracking
    };
    return payload;
  }

  // Unisce i dati dell'ultimo step e invia tutto al backend
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

      // Use the API client for backend communication
      const result = await apiClient.submitForm(payload);
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
          <div className="success-buttons">
            <button
              onClick={() => {
                window.open('https://www.theoddsoxinternational.com/', '_blank');
              }}
              className="button button-primary"
            >
              Back to Website
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(0); // Torna allo step 1
                setFormData({}); // Resetta tutti i dati
                setError(null);
              }}
              className="button button-secondary"
            >
              Submit another form
            </button>
          </div>
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

      {/* Footer - powered by arkad.agency */}
      <footer className="arkad-footer">
        <div className="arkad-footer-content">
          <Sparkles className="arkad-icon" size={20} />
          <span className="arkad-text">
            Powered by{' '}
            <a
              href="https://arkad.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="arkad-link"
            >
              arkad.agency
            </a>
          </span>
          <Zap className="arkad-icon" size={20} />
        </div>
        <p className="arkad-tagline">Tailored automation. Intelligent results.</p>
      </footer>
    </div>
  );
}