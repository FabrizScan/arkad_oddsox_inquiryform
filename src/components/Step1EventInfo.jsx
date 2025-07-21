import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function Step1EventInfo({ data, onNext, onUpdate }) {
  const [fields, setFields] = useState({
    eventType: data.eventType || "",
    otherEventType: data.otherEventType || "",
    startDate: data.startDate || "",
    endDate: data.endDate || "",
    isDateRange: data.isDateRange || false,
  });
  const [errors, setErrors] = useState({});

  // Aggiorna i campi quando cambiano i dati dal parent
  useEffect(() => {
    setFields({
      eventType: data.eventType || "",
      otherEventType: data.otherEventType || "",
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      isDateRange: data.isDateRange || false,
    });
  }, [data]);

  // Calcola la data attuale in formato ISO per l'attributo min (solo data, senza ora)
  const todayISO = new Date().toISOString().split('T')[0];

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value,
      // Reset endDate se disabilitiamo il date range
      ...(name === "isDateRange" && !checked && { endDate: "" })
    }));
  }

  function handleRadioChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
      // Reset otherEventType if not 'other'
      ...(name === "eventType" && value !== "other" && { otherEventType: "" }),
    }));
  }

  function validate() {
    const e = {};
    if (!fields.eventType) e.eventType = "Required";
    if (fields.eventType === "other" && !fields.otherEventType)
      e.otherEventType = "Please specify event type";
    if (!fields.startDate) e.startDate = "Required";
    else if (new Date(fields.startDate) < new Date(todayISO))
      e.startDate = "Date cannot be in the past";

    if (fields.isDateRange) {
      if (!fields.endDate) e.endDate = "Required for date range";
      else if (new Date(fields.endDate) <= new Date(fields.startDate))
        e.endDate = "End date must be after start date";
    }
    return e;
  }

  function handleNext(e) {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length === 0) {
      onUpdate(fields);
      onNext();
    }
  }

  return (
    <form onSubmit={handleNext}>
      <div className="section-header">
        <Calendar className="section-icon" />
        <h2 className="section-title">Tell us about your event</h2>
        <p className="section-subtitle">What type of celebration are you planning?</p>
      </div>

      {/* Event Type */}
      <label>
        Event Type <span className="required">*</span>
      </label>
      <div className="radio-grid">
        <label className="radio-card">
          <input
            type="radio"
            name="eventType"
            value="wedding"
            checked={fields.eventType === "wedding"}
            onChange={handleRadioChange}
          />
          <div>
            <strong>Wedding</strong>
            <span>Your special day</span>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="eventType"
            value="private_event"
            checked={fields.eventType === "private_event"}
            onChange={handleRadioChange}
          />
          <div>
            <strong>Private Event</strong>
            <span>Birthday, anniversary, etc.</span>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="eventType"
            value="corporate_event"
            checked={fields.eventType === "corporate_event"}
            onChange={handleRadioChange}
          />
          <div>
            <strong>Corporate Event</strong>
            <span>Company celebration</span>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="eventType"
            value="other"
            checked={fields.eventType === "other"}
            onChange={handleRadioChange}
          />
          <div>
            <strong>Other</strong>
            <span>Tell us more</span>
          </div>
        </label>
      </div>
      {errors.eventType && <div className="error">{errors.eventType}</div>}

      {fields.eventType === "other" && (
        <label>
          Please specify <span className="required">*</span>
          <input
            type="text"
            name="otherEventType"
            value={fields.otherEventType}
            onChange={handleChange}
            placeholder="e.g., Festival, Charity Gala"
            required
          />
          {errors.otherEventType && (
            <div className="error">{errors.otherEventType}</div>
          )}
        </label>
      )}

      {/* Event Date */}
      <label>
        Event date <span className="required">*</span>
      </label>
      <div className="date-row">
        <input
          type="date"
          name="startDate"
          value={fields.startDate}
          onChange={handleChange}
          required
          min={todayISO}
          className="date-input"
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isDateRange"
            checked={fields.isDateRange}
            onChange={handleChange}
          />
          Insert date range
        </label>
      </div>
      {errors.startDate && <div className="error">{errors.startDate}</div>}

      {/* End Date (conditionally rendered) */}
      {fields.isDateRange && (
        <>
          <label>
            End date <span className="required">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={fields.endDate}
            onChange={handleChange}
            required
            min={fields.startDate || todayISO}
            className="date-input"
          />
          {errors.endDate && <div className="error">{errors.endDate}</div>}
        </>
      )}

      <div className="form-navigation">
        <div></div> {/* Spacer per il pulsante Back che non c'è nel primo step */}
        <button type="submit" className="button primary">
          Next
        </button>
      </div>
    </form>
  );
} 