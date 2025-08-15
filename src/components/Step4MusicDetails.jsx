import React, { useState, useEffect } from "react";
import { Music } from "lucide-react";
import bandImage from "../images/band.jpg";
import { Info } from "lucide-react";

export default function Step4MusicDetails({ data, onNext, onBack, onUpdate }) {
  const [fields, setFields] = useState({
    dressCode: data.dressCode || "",
    concertDuration: data.concertDuration || "",
    concertDurationType: data.concertDurationType || "",
    extraSets: data.extraSets || "",
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
    } else if (type === "radio") {
      if (name === "extraSets") {
        setFields((prev) => ({ ...prev, extraSets: value }));
      } else if (name === "concertDurationType") {
        setFields((prev) => ({ ...prev, concertDurationType: value }));
      }
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validate() {
    const e = {};
    if (!fields.concertDurationType) e.concertDurationType = "Required";
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
        Concert's duration and sets <span className="required">*</span>
      </label>
      <div className="radio-group concert-duration">
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
      </div>
      {errors.concertDurationType && (
        <div className="error">{errors.concertDurationType}</div>
      )}

      {/* Extra Sets Section */}
      <label>Additional Sets (Optional)</label>
      <div className="radio-group extra-sets">
        <label className="radio-card extra-set-option">
          <input
            type="radio"
            name="extraSets"
            value="1_extra_set"
            checked={fields.extraSets === "1_extra_set"}
            onChange={handleChange}
          />
          <div>
            <strong>1 extra set - €500</strong>
          </div>
        </label>
        <label className="radio-card extra-set-option">
          <input
            type="radio"
            name="extraSets"
            value="2_extra_sets"
            checked={fields.extraSets === "2_extra_sets"}
            onChange={handleChange}
          />
          <div>
            <strong>2 extra sets - €800</strong>
          </div>
        </label>
      </div>
      <p>
        <Info className="info-icon" size={16} />
        For more options ask us on next page's additional notes
      </p>

      {/* Dress Code */}
      <label>
        Band Dress Code (Optional)
      </label>
      <textarea
        name="dressCode"
        value={fields.dressCode}
        onChange={handleChange}
        rows="3"
        placeholder="The group always wears suits. If you have a specific outfit, let us know and we'll check the price for its purchase. Examples: Black tie, casual, themed costume"
      ></textarea>

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