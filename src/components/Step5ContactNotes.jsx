import React, { useState } from "react";
import { User } from "lucide-react";

export default function Step5ContactNotes({ data, onBack, onSubmit, submitting, error }) {
  const [fields, setFields] = useState({
    fullName: data.fullName || "",
    email: data.email || "",
    phone: data.phone || "",
    notes: data.notes || "",
    airtableRecordId: data.airtableRecordId || "",
    airtableContactId: data.airtableContactId || "",
  });

  // Debug logging
  console.log('Step5ContactNotes - data received:', data);
  console.log('Step5ContactNotes - fields state:', fields);
  console.log('Step5ContactNotes - airtableRecordId:', fields.airtableRecordId);
  console.log('Step5ContactNotes - readOnly condition:', Boolean(fields.airtableRecordId && fields.airtableRecordId.trim() !== ''));
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!fields.fullName) e.fullName = "Required";
    if (!fields.email) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = "Invalid email format";
    // Phone non è più obbligatorio
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length === 0) {
      onSubmit(fields);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="section-header">
        <User className="section-icon" />
        <h2 className="section-title">Final Details & Contact</h2>
        <p className="section-subtitle">We're almost there! Please provide your contact information and any final details.</p>
      </div>

      <label>
        Full Name <span className="required">*</span>
        <input
          type="text"
          name="fullName"
          value={fields.fullName}
          onChange={handleChange}
          required
        />
        {errors.fullName && <div className="error">{errors.fullName}</div>}
      </label>

      <label>
        Email <span className="required">*</span>
        <input
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          required
          readOnly={Boolean(fields.airtableRecordId && fields.airtableRecordId.trim() !== '')}
          style={Boolean(fields.airtableRecordId && fields.airtableRecordId.trim() !== '') ? { 
            backgroundColor: '#f8f9fa', 
            color: '#6c757d',
            cursor: 'not-allowed'
          } : {}}
        />
        {Boolean(fields.airtableRecordId && fields.airtableRecordId.trim() !== '') && (
          <small style={{ color: '#6c757d', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            Email non modificabile per record esistenti (Record ID: {fields.airtableRecordId})
          </small>
        )}
        {errors.email && <div className="error">{errors.email}</div>}
      </label>

      <label>
        Phone (Optional)
        <input
          type="tel"
          name="phone"
          value={fields.phone}
          onChange={handleChange}
        />
        {errors.phone && <div className="error">{errors.phone}</div>}
      </label>

      <label>
        Additional Notes (Optional)
        <textarea
          name="notes"
          value={fields.notes}
          onChange={handleChange}
          rows="4"
          placeholder="Any special requests, song preferences, or additional information..."
        ></textarea>
      </label>

      {error && <div className="error">{error}</div>}

      <div className="form-navigation">
        <button type="button" onClick={onBack} className="button secondary">
          Back
        </button>
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}