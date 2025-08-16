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
    privacyPolicy: false,
    marketingConsent: false,
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFields((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validate() {
    const e = {};
    if (!fields.fullName) e.fullName = "Required";
    if (!fields.email) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = "Invalid email format";
    if (!fields.privacyPolicy) e.privacyPolicy = "You must accept the Privacy Policy to continue";
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
            Email field is read-only for existing records
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

      {/* GDPR Consent */}
      <div className="gdpr-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="privacyPolicy"
            checked={fields.privacyPolicy}
            onChange={handleChange}
            required
          />
          <span>I accept the <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a> <span className="required">*</span></span>
        </label>
        {errors.privacyPolicy && <div className="error">{errors.privacyPolicy}</div>}
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="marketingConsent"
            checked={fields.marketingConsent}
            onChange={handleChange}
          />
          <span>I agree to receive promotional emails and newsletters (optional)</span>
        </label>
      </div>

      {/* Hidden fields for Airtable */}
      <input type="hidden" name="airtableRecordId" value={fields.airtableRecordId} />
      <input type="hidden" name="airtableContactId" value={fields.airtableContactId} />

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