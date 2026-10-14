import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Activity, Clock, Shield, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';
import SymptomSelector from './SymptomSelector';

const SEVERITY_OPTIONS = [
  {
    id: 'mild',
    title: 'Mild Intensity',
    desc: 'Noticeable discomfort, but does not interfere with daily activities or work.',
  },
  {
    id: 'moderate',
    title: 'Moderate Intensity',
    desc: 'Noticeably disruptive to daily tasks, but still able to function.',
  },
  {
    id: 'severe',
    title: 'Severe Intensity',
    desc: 'Significant distress, severely limiting normal functioning or movement.',
  },
];

const PROGRESSION_OPTIONS = [
  {
    id: 'improving',
    title: 'Improving / Resolving',
    desc: 'Symptoms are milder than when they first started.',
  },
  {
    id: 'stable',
    title: 'Stable / Unchanged',
    desc: 'Symptoms have remained relatively steady without major change.',
  },
  {
    id: 'worsening',
    title: 'Worsening / Deteriorating',
    desc: 'Symptoms are escalating in frequency, area, or intensity.',
  },
];

const COMMON_CONDITIONS = [
  'Hypertension (High Blood Pressure)',
  'Type 2 Diabetes',
  'Asthma / Chronic Lung Disease',
  'Allergies / Hay Fever',
  'GERD / Acid Reflux',
  'Thyroid Disorder',
  'Heart Disease',
  'None / Healthy',
];

export default function AssessmentWizard({
  onSubmitAssessment,
  isLoading,
  onEmergencyDetected,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [symptoms, setSymptoms] = useState([]);
  const [duration, setDuration] = useState('1-3 days');
  const [customDuration, setCustomDuration] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [progression, setProgression] = useState('stable');
  const [ageGroup, setAgeGroup] = useState('adult_18_39');
  const [biologicalSex, setBiologicalSex] = useState('unspecified');
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [allergiesText, setAllergiesText] = useState('');
  const [answers, setAnswers] = useState({});

  const toggleMedicalHistory = (condition) => {
    if (condition === 'None / Healthy') {
      setMedicalHistory(['None / Healthy']);
      return;
    }
    const filtered = medicalHistory.filter((c) => c !== 'None / Healthy');
    if (filtered.includes(condition)) {
      setMedicalHistory(filtered.filter((c) => c !== condition));
    } else {
      setMedicalHistory([...filtered, condition]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && symptoms.length === 0) {
      alert('Please select at least one symptom to proceed.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = () => {
    const payload = {
      symptoms,
      duration: customDuration.trim() ? customDuration.trim() : duration,
      severity,
      progression,
      age_group: ageGroup,
      biological_sex: biologicalSex,
      medical_history: medicalHistory,
      allergies: allergiesText
        ? allergiesText.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      answers,
    };
    onSubmitAssessment(payload);
  };

  return (
    <div className="wizard-container">
      {/* Step Progress Indicators */}
      <div className="wizard-stepper">
        <div className={`step-node ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{currentStep > 1 ? '✓' : '1'}</div>
          <span className="step-label">Symptoms</span>
        </div>
        <div className={`step-node ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{currentStep > 2 ? '✓' : '2'}</div>
          <span className="step-label">Timeline & Severity</span>
        </div>
        <div className={`step-node ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <div className="step-circle">{currentStep > 3 ? '✓' : '3'}</div>
          <span className="step-label">History & Profile</span>
        </div>
        <div className={`step-node ${currentStep === 4 ? 'active' : ''}`}>
          <div className="step-circle">4</div>
          <span className="step-label">Review & AI Assess</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* STEP 1: Symptom Input */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>What symptoms are you experiencing?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Search for symptoms or pick from common categories. You can add multiple symptoms and remove them anytime.
              </p>
            </div>

            <SymptomSelector
              selectedSymptoms={symptoms}
              onSymptomsChange={setSymptoms}
              onEmergencyDetected={onEmergencyDetected}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={symptoms.length === 0}
              >
                <span>Continue to Timeline & Severity</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Timeline & Severity */}
        {currentStep === 2 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Symptom Onset & Intensity</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Understanding how long symptoms have persisted and their progression aids in accurate clinical triage.
              </p>
            </div>

            {/* Duration */}
            <div className="form-group">
              <label className="form-label" htmlFor="duration-select">
                When did these symptoms begin?
              </label>
              <select
                id="duration-select"
                className="form-select"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="Less than 24 hours">Less than 24 hours ago</option>
                <option value="1-3 days">1 to 3 days ago</option>
                <option value="4-7 days">4 to 7 days ago</option>
                <option value="1-2 weeks">1 to 2 weeks ago</option>
                <option value="Over a month">Chronic / Over a month</option>
              </select>
            </div>

            {/* Severity Radio Cards */}
            <div className="form-group">
              <label className="form-label">Perceived Severity Level</label>
              <div className="option-cards-grid">
                {SEVERITY_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`option-card ${severity === opt.id ? 'selected' : ''}`}
                    onClick={() => setSeverity(opt.id)}
                  >
                    <div className="option-card-title">{opt.title}</div>
                    <div className="option-card-desc">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progression Radio Cards */}
            <div className="form-group">
              <label className="form-label">How are symptoms changing over time?</label>
              <div className="option-cards-grid">
                {PROGRESSION_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`option-card ${progression === opt.id ? 'selected' : ''}`}
                    onClick={() => setProgression(opt.id)}
                  >
                    <div className="option-card-title">{opt.title}</div>
                    <div className="option-card-desc">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                <span>Continue to Profile</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Context & Voluntary History */}
        {currentStep === 3 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Relevant Background Information</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Providing demographic context and chronic health background is entirely optional and helps contextualize your assessment.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="age-select">
                  Age Range
                </label>
                <select
                  id="age-select"
                  className="form-select"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                >
                  <option value="child_under_12">Child (under 12)</option>
                  <option value="teen_13_17">Teenager (13-17)</option>
                  <option value="adult_18_39">Young Adult (18-39)</option>
                  <option value="adult_40_64">Middle-aged Adult (40-64)</option>
                  <option value="senior_65_plus">Senior (65+)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sex-select">
                  Biological Sex (Optional)
                </label>
                <select
                  id="sex-select"
                  className="form-select"
                  value={biologicalSex}
                  onChange={(e) => setBiologicalSex(e.target.value)}
                >
                  <option value="unspecified">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            {/* Voluntary Medical Conditions */}
            <div className="form-group">
              <label className="form-label">
                Do you have any existing medical conditions? (Optional)
              </label>
              <div className="quick-tags-grid">
                {COMMON_CONDITIONS.map((cond, idx) => {
                  const isSelected = medicalHistory.includes(cond);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`quick-tag ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleMedicalHistory(cond)}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Known Allergies */}
            <div className="form-group">
              <label className="form-label" htmlFor="allergies-input">
                Known Drug or Environmental Allergies (Optional)
              </label>
              <input
                id="allergies-input"
                type="text"
                className="form-input"
                placeholder="e.g., Penicillin, Sulfa drugs, Peanuts, Pollen..."
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button type="button" className="btn btn-secondary" onClick={handleBack}>
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                <span>Review & Analyze</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Presentation & Submit */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Ready for Clinical Assessment</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Please review your reported information. When you click Analyze, HealthAI will synthesize your symptoms through our clinical decision engine.
              </p>
            </div>

            {/* Review Summary Card */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                marginBottom: '28px',
              }}
            >
              <div style={{ marginBottom: '14px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Reported Symptoms:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {symptoms.map((s, idx) => (
                    <span key={idx} className="symptom-chip" style={{ fontSize: '0.8rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', fontSize: '0.85rem', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Duration:</span>{' '}
                  <strong>{duration}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Severity:</span>{' '}
                  <strong style={{ textTransform: 'capitalize' }}>{severity}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Progression:</span>{' '}
                  <strong style={{ textTransform: 'capitalize' }}>{progression}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Age Group:</span>{' '}
                  <strong>{ageGroup.replace(/_/g, ' ')}</strong>
                </div>
              </div>

              {medicalHistory.length > 0 && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Voluntary Medical History:</span>{' '}
                  <span>{medicalHistory.join(', ')}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={isLoading}
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                style={{ padding: '14px 36px', fontSize: '1.05rem' }}
              >
                {isLoading ? (
                  <>
                    <Activity size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Analyzing Symptoms...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Clinical Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
