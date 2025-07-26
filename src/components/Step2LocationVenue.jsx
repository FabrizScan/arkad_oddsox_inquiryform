import React, { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Step2LocationVenue({ data, onNext, onBack, onUpdate }) {
  const [fields, setFields] = useState({
    indoorOutdoor: data.indoorOutdoor || "",
  });
  const [errors, setErrors] = useState({});
  const locationInputRef = useRef(null);
  const [locationValue, setLocationValue] = useState(data.location || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setFields({
      indoorOutdoor: data.indoorOutdoor || "",
    });
    setLocationValue(data.location || "");
  }, [data]);

  // Handle input changes and get suggestions
  async function handleInputChange(e) {
    const value = e.target.value;
    setLocationValue(value);
    
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${MAPBOX_TOKEN}&types=poi,address&limit=5`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error getting suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  // Handle suggestion selection
  async function handleSelectSuggestion(suggestion) {
    try {
      // Compose: title + ', ' + full address
      const title = suggestion.text || suggestion.place_name || "";
      const fullAddress = suggestion.place_name || "";
      
      setLocationValue(fullAddress);
      setSuggestions([]);
      setShowSuggestions(false);
      console.log('Selected:', fullAddress);
    } catch (error) {
      console.error('Error retrieving suggestion:', error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!locationValue) e.location = "Required";
    if (!fields.indoorOutdoor) e.indoorOutdoor = "Required";
    return e;
  }

  function handleNext(e) {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length === 0) {
      onUpdate({
        location: locationValue,
        indoorOutdoor: fields.indoorOutdoor,
      });
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
      <label>
        Location <span className="required">*</span>
        <div className="location-input-container">
          <input
            ref={locationInputRef}
            type="text"
            name="location"
            placeholder="e.g., The Grand Hotel, Paris"
            autoComplete="address-line1"
            required
            value={locationValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="suggestion-title">{suggestion.text}</div>
                  <div className="suggestion-address">{suggestion.place_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </label>
      {errors.location && <div className="error">{errors.location}</div>}
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