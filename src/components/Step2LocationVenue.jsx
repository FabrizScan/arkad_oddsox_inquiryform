import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { AddressAutofill } from '@mapbox/search-js-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Step2LocationVenue({ data, onNext, onBack, onUpdate }) {
  const [fields, setFields] = useState({
    location: data.location || "",
    indoorOutdoor: data.indoorOutdoor || "",
  });
  const [errors, setErrors] = useState({});

  // Aggiorna i campi quando cambiano i dati dal parent
  useEffect(() => {
    setFields({
      location: data.location || "",
      indoorOutdoor: data.indoorOutdoor || "",
    });
  }, [data]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!fields.location) e.location = "Required";
    if (!fields.indoorOutdoor) e.indoorOutdoor = "Required";
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
        <MapPin className="section-icon" />
        <h2 className="section-title">Location</h2>
        <p className="section-subtitle">Tell us about your venue and location.</p>
      </div>

      {/* Location */}
      <label>
        Location <span className="required">*</span>
        <AddressAutofill accessToken={MAPBOX_TOKEN}>
          <input
            type="text"
            name="location"
            value={fields.location}
            onChange={handleChange}
            placeholder="e.g., The Grand Hotel, Paris"
            autoComplete="address-line1"
            required
          />
        </AddressAutofill>
      </label>
      {errors.location && <div className="error">{errors.location}</div>}

      {/* Indoor / Outdoor / Both */}
      <label>
        Setting <span className="required">*</span>
      </label>
      <div className="radio-grid">
        <label className="radio-card">
          <input
            type="radio"
            name="indoorOutdoor"
            value="Indoor"
            checked={fields.indoorOutdoor === "Indoor"}
            onChange={handleChange}
          />
          <div>
            <strong>Indoor</strong>
            <span>Inside venue or building</span>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="indoorOutdoor"
            value="Outdoor"
            checked={fields.indoorOutdoor === "Outdoor"}
            onChange={handleChange}
          />
          <div>
            <strong>Outdoor</strong>
            <span>Outside venue or garden</span>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="indoorOutdoor"
            value="Both"
            checked={fields.indoorOutdoor === "Both"}
            onChange={handleChange}
          />
          <div>
            <strong>Both</strong>
            <span>Combination of indoor and outdoor</span>
          </div>
        </label>
      </div>
      {errors.indoorOutdoor && (
        <div className="error">{errors.indoorOutdoor}</div>
      )}

      <div className="form-navigation">
        <button type="button" onClick={onBack} className="button secondary">
          Back
        </button>
        <button type="submit" className="button primary">
          Next
        </button>
      </div>
    </form>
  );
} 