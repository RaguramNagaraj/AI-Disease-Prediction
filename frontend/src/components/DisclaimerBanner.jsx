import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner">
      <AlertCircle size={20} className="disclaimer-icon" />
      <div className="disclaimer-text">
        <strong>Important Medical Notice:</strong> HealthAI is an educational decision-support application,
        not a doctor or clinically validated diagnostic system. This tool does not provide definitive medical diagnoses,
        prescribe medications, or replace emergency care. In the event of a medical emergency, call <strong>112 (India)</strong>,
        <strong>911 (US)</strong>, or your local emergency dispatch immediately.
      </div>
    </div>
  );
}
