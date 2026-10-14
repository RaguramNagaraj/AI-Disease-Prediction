import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  HeartPulse,
  Printer,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Info,
  Sparkles,
} from 'lucide-react';

export default function AssessmentResults({
  result,
  onReset,
  onRefineWithAnswers,
  isRefining,
}) {
  const [copied, setCopied] = useState(false);
  const [expandedCondition, setExpandedCondition] = useState(0);
  const [followUpAnswers, setFollowUpAnswers] = useState({});

  if (!result) return null;

  const isEmergency = result.triage_level === 'emergency';
  const isUrgent = result.triage_level === 'urgent_same_day';
  const isRoutine = result.triage_level === 'routine_primary_care';
  const isSelfCare = result.triage_level === 'self_care_monitor';

  const triageClass = isEmergency
    ? 'emergency'
    : isUrgent
    ? 'urgent_same_day'
    : isRoutine
    ? 'routine_primary_care'
    : 'self_care_monitor';

  const triageTitle = isEmergency
    ? 'Emergency Care Needed'
    : isUrgent
    ? 'Urgent Medical Attention'
    : isRoutine
    ? 'Routine Healthcare Consultation'
    : 'Self-Care & Symptom Monitoring';

  const handleCopySummary = () => {
    const text = `HealthAI Clinical Assessment Report
ID: ${result.assessment_id}
Date: ${new Date(result.timestamp).toLocaleString()}
Triage Level: ${triageTitle}
Reason: ${result.triage_explanation}

Summary: ${result.symptom_summary}

Possible Considerations:
${result.possible_conditions
  .map(
    (c) =>
      `- ${c.condition_name} (${c.confidence_category}) | Match: ${(c.match_score * 100).toFixed(0)}%\n  Matched: ${c.matched_symptoms.join(', ')}`
  )
  .join('\n')}

Doctor Discussion Questions:
${result.possible_conditions
  .flatMap((c) => c.questions_for_doctor)
  .slice(0, 5)
  .map((q) => `- ${q}`)
  .join('\n')}

Red Flags:
${result.red_flags.map((rf) => `- ${rf}`).join('\n')}

Disclaimer: This report is for educational decision-support only. Not a medical diagnosis.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAnswerSelect = (questionId, option) => {
    setFollowUpAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  return (
    <div className="results-card glass-panel">
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Report ID: <strong style={{ color: '#fff' }}>{result.assessment_id}</strong> · Generated: {new Date(result.timestamp).toLocaleTimeString()}
          </span>
          <div style={{ fontSize: '0.78rem', color: 'var(--primary-400)', marginTop: '2px' }}>
            Processed via: {result.engine_source === 'ollama_qwen' ? `Local Ollama (${result.model_name})` : 'Clinical ML Classifier & Rule Engine'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopySummary}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            {copied ? <Check size={15} style={{ color: '#10b981' }} /> : <Copy size={15} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrint}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onReset}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <RotateCcw size={15} />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Triage Level Banner */}
      <div className={`triage-header-banner ${triageClass}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: isEmergency ? 'rgba(244, 63, 94, 0.25)' : isUrgent ? 'rgba(245, 158, 11, 0.25)' : isRoutine ? 'rgba(14, 165, 233, 0.25)' : 'rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isEmergency ? '#f43f5e' : isUrgent ? '#f59e0b' : isRoutine ? '#38bdf8' : '#10b981',
            }}
          >
            {isEmergency ? <AlertTriangle size={26} /> : <Stethoscope size={26} />}
          </div>
          <div>
            <div className="triage-badge" style={{ color: isEmergency ? '#f43f5e' : isUrgent ? '#f59e0b' : isRoutine ? '#38bdf8' : '#10b981' }}>
              Triage Level: {triageTitle}
            </div>
            <div style={{ fontSize: '0.92rem', color: '#ffffff', marginTop: '4px', maxWidth: '650px' }}>
              {result.triage_explanation}
            </div>
          </div>
        </div>
      </div>

      {/* Reported Symptoms Clinical Summary */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-400)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>
          <Info size={16} /> Clinical Summary of Presentation
        </div>
        <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {result.symptom_summary}
        </p>
      </div>

      {/* Possible Conditions Differential List */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.3rem' }}>
            Possible Explanations to Discuss with a Doctor
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Educational differential considerations
          </span>
        </div>

        {result.possible_conditions && result.possible_conditions.length > 0 ? (
          <div className="conditions-list">
            {result.possible_conditions.map((condition, idx) => {
              const isExpanded = expandedCondition === idx;
              const matchPercent = Math.round(condition.match_score * 100);

              return (
                <div key={idx} className="condition-card">
                  <div
                    className="condition-card-header"
                    onClick={() => setExpandedCondition(isExpanded ? -1 : idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div className="condition-title">{condition.condition_name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--primary-400)', marginTop: '2px' }}>
                        {condition.confidence_category}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="match-score-bar-wrapper">
                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', minWidth: '42px' }}>
                          {matchPercent}%
                        </div>
                        <div className="match-score-track">
                          <div
                            className="match-score-fill"
                            style={{ width: `${matchPercent}%` }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', animation: 'fadeIn 0.2s ease-in' }}>
                      <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                        {condition.overview}
                      </p>

                      {/* Matched symptoms */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                          Matched Symptoms in Your Presentation:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {condition.matched_symptoms.map((ms, i) => (
                            <span
                              key={i}
                              style={{
                                background: 'rgba(6, 182, 212, 0.15)',
                                color: '#67e8f9',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                borderRadius: 'var(--radius-full)',
                                padding: '3px 10px',
                                fontSize: '0.78rem',
                                fontWeight: '600',
                              }}
                            >
                              ✓ {ms}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Questions for doctor */}
                      {condition.questions_for_doctor && condition.questions_for_doctor.length > 0 && (
                        <div
                          style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '12px 14px',
                            marginTop: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', marginBottom: '6px' }}>
                            <HelpCircle size={15} style={{ color: 'var(--primary-400)' }} /> Questions to Ask Your Doctor:
                          </div>
                          <ul style={{ paddingLeft: '20px', color: '#94a3b8', fontSize: '0.84rem', lineHeight: '1.5' }}>
                            {condition.questions_for_doctor.map((q, qIdx) => (
                              <li key={qIdx} style={{ marginBottom: '4px' }}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No specific condition correlations matched. Please consult a healthcare professional for clinical examination.
          </p>
        )}
      </div>

      {/* Clinical Notes & Reasoning */}
      {result.clinical_notes && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '28px',
          }}
        >
          <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '8px' }}>
            Clinical Reasoning & Considerations
          </h4>
          <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6' }}>
            {result.clinical_notes}
          </p>
        </div>
      )}

      {/* Supporting vs Missing Clinical Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px' }}>
            <CheckCircle2 size={16} /> Supporting Clinical Findings
          </div>
          <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6' }}>
            {result.supporting_info.map((info, i) => (
              <li key={i}>{info}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px' }}>
            <HelpCircle size={16} /> Missing Information (Needed by Doctor)
          </div>
          <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6' }}>
            {result.missing_info.map((info, i) => (
              <li key={i}>{info}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Clarifying Follow-Up Questions (Requirement B & D) */}
      {result.follow_up_questions && result.follow_up_questions.length > 0 && onRefineWithAnswers && (
        <div
          style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '22px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-400)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '6px' }}>
            <Sparkles size={18} /> Clarifying Questions to Refine Assessment
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '16px' }}>
            Select answers below to provide additional clinical context and refine this assessment.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result.follow_up_questions.map((q) => (
              <div key={q.id} style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px 16px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ffffff', marginBottom: '4px' }}>
                  {q.question}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Clinical rationale: {q.reason}
                </div>
                {q.options && q.options.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = followUpAnswers[q.id] === opt;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          className={`quick-tag ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleAnswerSelect(q.id, opt)}
                        >
                          {isSelected ? '✓ ' : ''}{opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onRefineWithAnswers(followUpAnswers)}
              disabled={Object.keys(followUpAnswers).length === 0 || isRefining}
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              {isRefining ? 'Updating Assessment...' : 'Submit Clarifications & Refine'}
            </button>
          </div>
        </div>
      )}

      {/* General Safe Self-Care Guidance */}
      {result.general_self_care && result.general_self_care.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '10px' }}>
            General Supportive Self-Care Advice
          </h4>
          <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.7' }}>
            {result.general_self_care.map((sc, i) => (
              <li key={i}>{sc}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags Alert Section */}
      {result.red_flags && result.red_flags.length > 0 && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: '700', fontSize: '0.95rem', marginBottom: '8px' }}>
            <ShieldAlert size={18} /> Warning Signs Requiring Immediate Emergency Attention (Red Flags)
          </div>
          <p style={{ color: '#fda4af', fontSize: '0.82rem', marginBottom: '10px' }}>
            If you develop any of the following symptoms, call <strong>112 (India)</strong> or go to an emergency room immediately:
          </p>
          <ul style={{ paddingLeft: '20px', color: '#fecdd3', fontSize: '0.85rem', lineHeight: '1.6' }}>
            {result.red_flags.map((rf, i) => (
              <li key={i}>{rf}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Regulatory Educational Disclaimer */}
      <div
        style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '20px',
          color: 'var(--text-dim)',
          fontSize: '0.8rem',
          lineHeight: '1.5',
        }}
      >
        <strong>Legal & Clinical Disclaimer:</strong> {result.medical_disclaimer}
      </div>
    </div>
  );
}
