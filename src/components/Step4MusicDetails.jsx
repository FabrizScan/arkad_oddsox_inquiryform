import React, { useState, useEffect } from "react";
import { Music } from "lucide-react";
import bandImage from "../images/band.jpg";

export default function Step4MusicDetails({ data, onNext, onBack, onUpdate }) {
  const [fields, setFields] = useState({
    dressCode: data.dressCode || "",
    concertDuration: data.concertDuration || "",
    concertDurationType: data.concertDurationType || "",
    otherConcertDuration: data.otherConcertDuration || "",
    musicians: data.musicians || [],
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked) {
        setFields((prev) => ({
          ...prev,
          musicians: [...prev.musicians, value],
        }));
      } else {
        setFields((prev) => ({
          ...prev,
          musicians: prev.musicians.filter((m) => m !== value),
        }));
      }
    } else if (type === "radio" && name === "concertDurationType") {
      setFields((prev) => ({ 
        ...prev, 
        concertDurationType: value,
        // Reset otherConcertDuration if not selecting "other"
        ...(value !== "other" && { otherConcertDuration: "" })
      }));
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validate() {
    const e = {};
    if (!fields.concertDurationType) e.concertDurationType = "Required";
    if (fields.concertDurationType === "other" && !fields.otherConcertDuration.trim()) {
      e.otherConcertDuration = "Please specify the concert duration";
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
        <Music className="section-icon" />
        <h2 className="section-title">Musical Preferences</h2>
        <p className="section-subtitle">Configure your ideal band setup</p>
      </div>

      <div className="info-box">
        <div className="band-info-content">
          <img src={bandImage} alt="Odd Sox Band" className="band-image" />
          <div className="band-description">
            <p>
              Our standard strolling band setup includes:
              <br />
              <strong>Guitars, Double Bass, and Percussion, with all members contributing vocals.</strong>
              <br />
              This configuration provides a full, dynamic sound perfect for most events.
            </p>
          </div>
        </div>
      </div>

      {/* Expected Concert Duration */}
      <label>
        Expected concert duration <span className="required">*</span>
      </label>
      <div className="radio-group">
        <label className="radio-card">
          <input
            type="radio"
            name="concertDurationType"
            value="2_sets_45min"
            checked={fields.concertDurationType === "2_sets_45min"}
            onChange={handleChange}
          />
          <div>
            <strong>2 sets of 45 min</strong>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="concertDurationType"
            value="3_sets_30min"
            checked={fields.concertDurationType === "3_sets_30min"}
            onChange={handleChange}
          />
          <div>
            <strong>3 sets of 30 min</strong>
          </div>
        </label>
        <label className="radio-card">
          <input
            type="radio"
            name="concertDurationType"
            value="other"
            checked={fields.concertDurationType === "other"}
            onChange={handleChange}
          />
          <div>
            <strong>Other</strong>
          </div>
        </label>
      </div>
      {errors.concertDurationType && (
        <div className="error">{errors.concertDurationType}</div>
      )}

      {/* Other Concert Duration (conditionally rendered) */}
      {fields.concertDurationType === "other" && (
        <label>
          Please specify concert duration:
          <input
            type="text"
            name="otherConcertDuration"
            value={fields.otherConcertDuration}
            onChange={handleChange}
            placeholder="e.g., 4 sets of 20 min, 2 hours total, 1 set of 90 min"
            required
          />
          {errors.otherConcertDuration && (
            <div className="error">{errors.otherConcertDuration}</div>
          )}
        </label>
      )}

      {/* Dress Code */}
      <label>
        Band Dress Code (Optional)
        <textarea
          name="dressCode"
          value={fields.dressCode}
          onChange={handleChange}
          rows="3"
          placeholder="e.g., Black tie, casual, themed costume"
        ></textarea>
      </label>

      {/* Additional Musicians */}
      <label>Additional musicians (Optional)</label>
      <div className="checkbox-group">
        <div className="checkbox-item">
          <input
            type="checkbox"
            name="musicians"
            value="saxophonist"
            checked={fields.musicians.includes("saxophonist")}
            onChange={handleChange}
            id="saxophonist"
          />
          <label htmlFor="saxophonist">Saxophonist</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            name="musicians"
            value="percussionist"
            checked={fields.musicians.includes("percussionist")}
            onChange={handleChange}
            id="percussionist"
          />
          <label htmlFor="percussionist">Percussionist</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            name="musicians"
            value="trumpeter"
            checked={fields.musicians.includes("trumpeter")}
            onChange={handleChange}
            id="trumpeter"
          />
          <label htmlFor="trumpeter">Trumpeter</label>
        </div>
      </div>

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