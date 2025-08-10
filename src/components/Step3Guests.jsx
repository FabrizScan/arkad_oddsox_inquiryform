import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function Step3Guests({ data, onNext, onBack, onUpdate }) {
  const [fields, setFields] = useState({
    guests: data.guests || "",
  });
  const [errors, setErrors] = useState({});

  function handleRadioChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!fields.guests) e.guests = "Required";
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
        <Users className="section-icon" />
      </div>

      {/* Guests */}
      <label>
        Expected Number of Guests <span className="required">*</span>
      </label>
      <div className="radio-grid">
        <label className="radio-card">
          <input
            type="radio"
            name="guests"
            value="Intimate (0-50)"
            checked={fields.guests === "Intimate (0-50)"}
            onChange={handleRadioChange}
          />
          <div>
            <strong>Intimate</strong>
            <span>(0-50)</span>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="guests"
            value="Medium (51-100)"
            checked={fields.guests === "Medium (51-100)"}
            onChange={handleRadioChange}
          />
          <div>
            <strong>Medium</strong>
            <span>(51-100)</span>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="guests"
            value="Large (101-150)"
            checked={fields.guests === "Large (101-150)"}
            onChange={handleRadioChange}
          />
          <div>
            <strong>Large</strong>
            <span>(101-150)</span>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="guests"
            value="Very Large (Above 150)"
            checked={fields.guests === "Very Large (Above 150)"}
            onChange={handleRadioChange}
          />
          <div>
            <strong>Very Large</strong>
            <span>(Above 150)</span>
          </div>
        </label>
      </div>
      {errors.guests && <div className="error">{errors.guests}</div>}

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