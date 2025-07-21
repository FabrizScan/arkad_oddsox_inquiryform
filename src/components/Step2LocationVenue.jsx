import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

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
        <input
          type="text"
          name="location"
          value={fields.location}
          onChange={handleChange}
          placeholder="e.g., The Grand Hotel, Paris"
          required
        />
        {errors.location && <div className="error">{errors.location}</div>}
      </label>

      {/* Indoor / Outdoor / Both */}
      <label>
        Setting <span className="required">*</span>
      </label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="indoorOutdoor"
            value="Indoor"
            checked={fields.indoorOutdoor === "Indoor"}
            onChange={handleChange}
          />
          Indoor
        </label>
        <label>
          <input
            type="radio"
            name="indoorOutdoor"
            value="Outdoor"
            checked={fields.indoorOutdoor === "Outdoor"}
            onChange={handleChange}
          />
          Outdoor
        </label>
        <label>
          <input
            type="radio"
            name="indoorOutdoor"
            value="Both"
            checked={fields.indoorOutdoor === "Both"}
            onChange={handleChange}
          />
          Both
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