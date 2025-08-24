import React from "react";

export default function Stepper({ steps, currentStep }) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-step">Step {currentStep + 1} of {steps.length}</span>
        <span className="progress-percentage">{Math.round(progressPercentage)}% Complete</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}