import React from 'react';
import {
  ShieldAlert,
  Search,
  Cpu,
  Stethoscope,
  HeartPulse,
  Lock,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export default function HowItWorks({ onStartAssessment }) {
  const steps = [
    {
      icon: <Search size={24} style={{ color: 'var(--primary-400)' }} />,
      number: '01',
      title: 'Report Your Symptoms',
      desc: 'Select or search for the symptoms you are experiencing. Filter by body systems or enter your own custom terms with immediate emergency safety checks.',
    },
    {
      icon: <ShieldAlert size={24} style={{ color: '#f43f5e' }} />,
      number: '02',
      title: 'Instant Red Flag Screening',
      desc: 'Before routine assessment, our safety screener checks for life-threatening symptoms (stroke FAST indicators, cardiac chest pain, severe hypoxia) directing to 112 / 911 immediately.',
    },
    {
      icon: <Cpu size={24} style={{ color: '#3b82f6' }} />,
      number: '03',
      title: 'Dual Engine Clinical Synthesis',
      desc: 'Our scikit-learn classifier maps symptom overlap against 40+ clinical conditions, while local Qwen 3.5 AI provides natural language reasoning without sending data to third-party clouds.',
    },
    {
      icon: <Stethoscope size={24} style={{ color: '#10b981' }} />,
      number: '04',
      title: 'Actionable Doctor Guidance',
      desc: 'Receive clear triage urgency levels, possible condition overviews, targeted questions to bring to your physician, safe self-care advice, and vital red flag indicators.',
    },
  ];

  return (
    <div style={{ marginTop: '48px', marginBottom: '48px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>
          How <span className="text-gradient">HealthAI</span> Works
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          A transparent, evidence-based triage support system designed to inform your healthcare decisions.
        </p>
      </div>

      {/* Step Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {steps.map((step, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step.icon}
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-dim)' }}>
                {step.number}
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#ffffff' }}>
              {step.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Responsible Use & Limitations Section */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid var(--border-glass)',
          marginBottom: '36px',
        }}
      >
        <h3 style={{ fontSize: '1.35rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
          <Lock size={20} style={{ color: 'var(--primary-400)' }} /> System Limitations & Responsible Use
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6' }}>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
              Educational Decision Support
            </strong>
            HealthAI does not replace clinical judgment, diagnostic testing, imaging, or physical palpation by a licensed doctor.
          </div>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
              Zero Prescription Policy
            </strong>
            The system never prescribes pharmaceuticals or instructs discontinuation of prescribed therapies.
          </div>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
              Local & Transient Privacy
            </strong>
            No personal identifiers or medical records are retained or sold. Inference is run locally on your machine or transiently.
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onStartAssessment}
          style={{ padding: '14px 32px', fontSize: '1.05rem' }}
        >
          <HeartPulse size={20} />
          <span>Start Symptom Assessment</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
