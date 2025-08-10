import React, { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export default function Step2LocationVenue({ data, onNext, onBack, onUpdate }) {
  const [fields, setFields] = useState({
    indoorOutdoor: data.indoorOutdoor || "",
  });
  const [errors, setErrors] = useState({});
  const locationInputRef = useRef(null);
  const [locationValue, setLocationValue] = useState(data.location || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [placeData, setPlaceData] = useState({
    place_id: "",
    name: "",
    formatted_address: "",
    lat: null,
    lng: null
  });

  useEffect(() => {
    setFields({
      indoorOutdoor: data.indoorOutdoor || "",
    });
    setLocationValue(data.location || "");
  }, [data]);

  // Handle input changes and get autocomplete suggestions
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setLocationValue(value);

    if (value.length > 2 && GOOGLE_MAPS_API_KEY) {
      setIsLoading(true);
      try {
        const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat'
          },
          body: JSON.stringify({
            input: value,
            includedPrimaryTypes: ['establishment', 'geocode'],
            languageCode: 'en'
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Autocomplete response:', data);

        const placePredictions = data.suggestions
          ?.filter(suggestion => suggestion.placePrediction)
          ?.map(suggestion => suggestion.placePrediction) || [];

        setSuggestions(placePredictions);
        setShowSuggestions(placePredictions.length > 0);
      } catch (error) {
        console.error('❌ Error getting autocomplete suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection and get place details
  const handleSelectSuggestion = async (suggestion) => {
    try {
      console.log('Selected suggestion:', suggestion);

      // Get place details using the place ID
      const response = await fetch(`https://places.googleapis.com/v1/places/${suggestion.placeId}`, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,location'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const placeDetails = await response.json();
      console.log('✅ Place details:', placeDetails);

      // Extract the place information
      const placeName = placeDetails.displayName?.text || suggestion.text?.text || '';
      const placeAddress = placeDetails.formattedAddress || suggestion.structuredFormat?.secondaryText?.text || '';

      // Combine name and address for the location field
      const combinedLocation = placeAddress ? `${placeName}, ${placeAddress}` : placeName;

      setLocationValue(combinedLocation);
      setPlaceData({
        place_id: suggestion.placeId,
        name: placeName,
        formatted_address: placeAddress,
        lat: placeDetails.location?.latitude || null,
        lng: placeDetails.location?.longitude || null
      });

      setSuggestions([]);
      setShowSuggestions(false);

      console.log('✅ Location set:', combinedLocation);
      console.log('✅ Place data:', {
        place_id: suggestion.placeId,
        name: placeName,
        formatted_address: placeAddress,
        lat: placeDetails.location?.latitude || null,
        lng: placeDetails.location?.longitude || null
      });
    } catch (error) {
      console.error('❌ Error getting place details:', error);
      // Fallback: just use the suggestion text
      setLocationValue(suggestion.text?.text || suggestion.structuredFormat?.mainText?.text || '');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!locationValue.trim()) e.location = "Required";
    if (!fields.indoorOutdoor) e.indoorOutdoor = "Required";
    return e;
  }

  function handleNext(e) {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length === 0) {
      onUpdate({ ...fields, location: locationValue });
      onNext();
    }
  }

  return (
    <ErrorBoundary>
      <form onSubmit={handleNext}>
        <div className="section-header">
          <MapPin className="section-icon" />
        </div>

        {/* Location */}
        <label>
          Event Location <span className="required">*</span>
        </label>
        <div className="location-input-container">
          <input
            type="text"
            name="location"
            ref={locationInputRef}
            placeholder="e.g., The Grand Hotel, Paris"
            autoComplete="off"
            required
            value={locationValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            disabled={!GOOGLE_MAPS_API_KEY}
          />
          {isLoading && (
            <div style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6c757d',
              fontSize: '0.875rem'
            }}>
              Loading...
            </div>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="suggestion-title">
                    {suggestion.structuredFormat?.mainText?.text || suggestion.text?.text}
                  </div>
                  <div className="suggestion-address">
                    {suggestion.structuredFormat?.secondaryText?.text || ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
    </ErrorBoundary>
  );
}