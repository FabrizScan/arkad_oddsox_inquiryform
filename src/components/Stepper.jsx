import React from "react";

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="stepper">
      {steps.map((label, idx) => (
        <div
          key={label}
          className={`step ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`}
        >
          <div className="step-number">{idx + 1}</div>
          <div className="step-label">{label}</div>
        </div>
      ))}
    </div>
  );
} 