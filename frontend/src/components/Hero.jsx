import React from 'react';
import { ArrowRight, ShieldCheck, HeartPulse, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function Hero({ onStartAssessment, onLearnMore }) {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Sparkles size={14} />
        <span>Powered by Local Qwen 3.5 AI & Calibrated Clinical Engine</span>
      </div>

      <h1 className="hero-title">
        Intelligent Symptom Assessment & <br />
        <span className="text-gradient">Clinical Decision Support</span>
      </h1>

      <p className="hero-subtitle">
        Enter your symptoms, receive evidence-guided triage insights, understand potential medical explanations,
        and prepare informed questions for your next healthcare consultation.
      </p>

      <div className="hero-actions">
        <button
          className="btn btn-primary"
          onClick={onStartAssessment}
          style={{ fontSize: '1.05rem', padding: '14px 32px' }}
        >
          <HeartPulse size={20} />
          <span>Start Symptom Assessment</span>
          <ArrowRight size={18} />
        </button>

        <button
          className="btn btn-secondary"
          onClick={onLearnMore}
          style={{ fontSize: '1rem', padding: '14px 24px' }}
        >
          <BookOpen size={18} />
          <span>How It Works</span>
        </button>
      </div>

      <div className="hero-stats">
        <div className="stat-card">
          <div className="stat-value">Instant</div>
          <div className="stat-label">Emergency Screening</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">40+</div>
          <div className="stat-label">Clinical Profiles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">100%</div>
          <div className="stat-label">Local & Private</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Qwen 3.5</div>
          <div className="stat-label">Cognitive Reasoning</div>
        </div>
      </div>
    </section>
  );
}
