import React, { useState, useEffect } from "react";
import { Users, Volume2 } from "lucide-react";

export default function Step3Guests({ data, onNext, onBack, onUpdate }) {
  const [fields, setFields] = useState({
    guests: data.guests || "",
    soundSystemRequired: data.soundSystemRequired || false,
  });
  const [errors, setErrors] = useState({});
  const [soundSystemText, setSoundSystemText] = useState("");
  const [showSoundSystemCheckbox, setShowSoundSystemCheckbox] = useState(false);

  function handleRadioChange(e) {
    const { name, value } = e.target;
    if (name === "guests") {
      setFields((prev) => ({ ...prev, [name]: value }));
      
      // Sound system logic based on guest count and event type
      const eventType = data.indoorOutdoor; // Get from previous step
      
      if (value === "Intimate (0-50)" || value === "Medium (51-100)") {
        setSoundSystemText("No sound system required");
        setShowSoundSystemCheckbox(false);
        setFields(prev => ({ ...prev, soundSystemRequired: false }));
      } else if (value === "Very Large (Above 150)") {
        setSoundSystemText("Sound system highly recommended");
        setShowSoundSystemCheckbox(true);
        setFields(prev => ({ ...prev, soundSystemRequired: false }));
      } else if (value === "Large (101-150)") {
        if (eventType === "Indoor") {
          setSoundSystemText("Sound system may be required depends on venue acoustics");
          setShowSoundSystemCheckbox(true);
        } else if (eventType === "Outdoor" || eventType === "Both") {
          setSoundSystemText("Sound system definitely recommended for outdoor events");
          setShowSoundSystemCheckbox(true);
        }
        setFields(prev => ({ ...prev, soundSystemRequired: false }));
      }
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
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
        <h2 className="section-title">Guest Count</h2>
        <p className="section-subtitle">How many people will be attending your event?</p>
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

      {/* Sound System Information */}
      {soundSystemText && (
        <div className="info-box" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>{soundSystemText}</p>
        </div>
      )}

      {/* Sound System Checkbox (when required) */}
      {showSoundSystemCheckbox && (
        <div className="checkbox-item date-range">
          <input
            type="checkbox"
            name="soundSystemRequired"
            checked={fields.soundSystemRequired}
            onChange={(e) => setFields(prev => ({ ...prev, soundSystemRequired: e.target.checked }))}
            id="soundSystemRequired"
          />
          <label htmlFor="soundSystemRequired">
            <Volume2 className="speaker-icon" />
            Sound and Wireless System to be provided by the Hirer
          </label>
        </div>
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