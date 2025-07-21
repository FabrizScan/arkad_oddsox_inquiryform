import React, { useState } from "react";
import { Music } from "lucide-react";

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
      setFields((prev) => {
        const newMusicians = checked
          ? [...prev.musicians, value]
          : prev.musicians.filter((m) => m !== value);
        return { ...prev, musicians: newMusicians };
      });
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validate() {
    const e = {};
    if (!fields.concertDuration) e.concertDuration = "Required"; // Reso obbligatorio
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
        <h2 className="section-title">Music & Group Preferences</h2>
        <p className="section-subtitle">Customize your musical experience.</p>
      </div>

      {/* Band Setup Explanation */}
      <div className="info-box">
        <p>
          Our standard band setup includes:
          <br />
          <strong>Vocals, Guitar, Bass, Drums, and Keyboards.</strong>
          <br />
          This configuration provides a full, dynamic sound perfect for most events.
        </p>
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
        Any specific dress code for the band? (Optional)
        <textarea
          name="dressCode"
          value={fields.dressCode}
          onChange={handleChange}
          rows="3"
          placeholder="e.g., Black tie, casual, themed costume"
        ></textarea>
      </label>

      {/* Additional Musicians */}
      <label>Additional musicians? (Optional)</label>
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            name="musicians"
            value="saxophonist"
            checked={fields.musicians.includes("saxophonist")}
            onChange={handleChange}
          />
          Saxophonist
        </label>
        <label>
          <input
            type="checkbox"
            name="musicians"
            value="percussionist"
            checked={fields.musicians.includes("percussionist")}
            onChange={handleChange}
          />
          Percussionist
        </label>
        <label>
          <input
            type="checkbox"
            name="musicians"
            value="trumpeter"
            checked={fields.musicians.includes("trumpeter")}
            onChange={handleChange}
          />
          Trumpeter
        </label>
        <label>
          <input
            type="checkbox"
            name="musicians"
            value="other"
            checked={fields.musicians.includes("other")}
            onChange={handleChange}
          />
          Other
        </label>
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