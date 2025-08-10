import React, { useState, useEffect } from "react";
import { Music } from "lucide-react";
import bandImage from "../images/band.jpg";

export default function Step4MusicDetails({ data, onNext, onBack, onUpdate }) {
  const [fields, setFields] = useState({
    dressCode: data.dressCode || "",
    concertDuration: data.concertDuration || "",
    musicians: data.musicians || [],
    otherMusician: data.otherMusician || "",
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
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validate() {
    const e = {};
    if (!fields.concertDuration) e.concertDuration = "Required";
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
        <input
          type="text"
          name="concertDuration"
          value={fields.concertDuration}
          onChange={handleChange}
          placeholder="e.g., 2 sets of 45 minutes, 3 hours total"
          required
        />
        {errors.concertDuration && (
          <div className="error">{errors.concertDuration}</div>
        )}
      </label>

      {/* Dress Code */}
      <label>
        Band Dress Code? (Optional)
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
        <div className="checkbox-item">
          <input
            type="checkbox"
            name="musicians"
            value="other"
            checked={fields.musicians.includes("other")}
            onChange={handleChange}
            id="other"
          />
          <label htmlFor="other">Other</label>
        </div>
      </div>

      {fields.musicians.includes("other") && (
        <label>
          Please specify other musician(s):
          <input
            type="text"
            name="otherMusician"
            value={fields.otherMusician}
            onChange={handleChange}
            placeholder="e.g., Violinist, backing vocalist"
          />
        </label>
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