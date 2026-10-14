import React from 'react';
import { AlertOctagon, PhoneCall, X, ShieldAlert, HeartPulse, Clock } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose, redFlags = [] }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content-emergency">
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
          }}
          aria-label="Close Emergency Notice"
        >
          <X size={24} />
        </button>

        <div className="emergency-pulse-icon">
          <AlertOctagon size={36} strokeWidth={2.5} />
        </div>

        <h2 style={{ textAlign: 'center', color: '#f43f5e', fontSize: '1.75rem', marginBottom: '8px' }}>
          CRITICAL EMERGENCY WARNING
        </h2>

        <p style={{ textAlign: 'center', color: '#fda4af', fontSize: '0.95rem', marginBottom: '20px' }}>
          Potential life-threatening warning signs detected. Do NOT wait for an online assessment.
          Contact emergency medical services immediately.
        </p>

        {redFlags && redFlags.length > 0 && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', marginBottom: '6px' }}>
              Identified Emergency Red Flags:
            </div>
            <ul style={{ paddingLeft: '20px', color: '#fecdd3', fontSize: '0.85rem' }}>
              {redFlags.map((flag, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Emergency Dispatch Phone Numbers */}
        <div className="emergency-numbers-grid">
          <div className="emergency-call-card" style={{ borderColor: '#f43f5e' }}>
            <div className="emergency-call-label">India Emergency</div>
            <div className="emergency-call-number" style={{ color: '#f43f5e' }}>112</div>
          </div>
          <div className="emergency-call-card">
            <div className="emergency-call-label">US / Canada</div>
            <div className="emergency-call-number">911</div>
          </div>
          <div className="emergency-call-card">
            <div className="emergency-call-label">UK Emergency</div>
            <div className="emergency-call-number">999</div>
          </div>
          <div className="emergency-call-card">
            <div className="emergency-call-label">European Union</div>
            <div className="emergency-call-number">112</div>
          </div>
        </div>

        {/* FAST Stroke Protocol Callout */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>
            <Clock size={16} /> Suspected Stroke? Remember F.A.S.T.:
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            <strong>F</strong>ace drooping · <strong>A</strong>rm weakness · <strong>S</strong>peech difficulty · <strong>T</strong>ime to call emergency services.
          </p>
        </div>

        {/* Immediate Safe Actions */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.88rem', marginBottom: '8px' }}>
            Immediate Actions:
          </div>
          <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <li>Request an ambulance immediately. Do NOT drive yourself to the hospital.</li>
            <li>Unlock your front door so emergency paramedics can enter quickly.</li>
            <li>If alone, notify a neighbor, family member, or colleague right away.</li>
            <li>Sit in a semi-upright or restful position while awaiting dispatch.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="tel:112"
            className="btn btn-emergency"
            style={{ flex: 1, textDecoration: 'none' }}
          >
            <PhoneCall size={18} />
            <span>Call 112 (India)</span>
          </a>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ minWidth: '130px' }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
