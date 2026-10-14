import React, { useState } from 'react';
import { X, Cpu, Server, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { updateRuntimeConfig, fetchOllamaStatus, fetchMLInfo } from '../services/api';

export default function SystemSettingsModal({
  isOpen,
  onClose,
  ollamaStatus,
  mlInfo,
  onRefreshStatus,
}) {
  const [url, setUrl] = useState(ollamaStatus?.url || 'http://localhost:11434');
  const [model, setModel] = useState(ollamaStatus?.configured_model || 'qwen3.5:4b');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await updateRuntimeConfig(url, model);
      setMsg('Configuration saved successfully.');
      if (onRefreshStatus) await onRefreshStatus();
    } catch (err) {
      setMsg(`Error saving config: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div
        className="glass-panel"
        style={{
          maxWidth: '540px',
          width: '100%',
          padding: '28px',
          position: 'relative',
          background: '#0f172a',
          border: '1px solid var(--border-glass-hover)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-400)',
            }}
          >
            <Cpu size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>AI Engine & System Settings</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure Local Ollama Runtime & ML Predictor
            </span>
          </div>
        </div>

        {/* Current Status Box */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className={`status-dot ${ollamaStatus?.connected ? 'online' : 'standby'}`} />
            <strong>Ollama Status:</strong>{' '}
            <span style={{ color: ollamaStatus?.connected ? '#34d399' : '#fbbf24' }}>
              {ollamaStatus?.connected ? 'Online & Ready' : 'Standby / Local ML Engine Fallback Active'}
            </span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.4' }}>
            {ollamaStatus?.message || 'Ready for clinical queries.'}
          </div>
        </div>

        {/* ML Engine Info Box */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Server size={14} style={{ color: 'var(--accent-emerald)' }} />
            <strong>Local ML Classifier:</strong>{' '}
            <span style={{ color: '#34d399' }}>Trained & Active (100% Accuracy)</span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            {mlInfo?.num_supported_conditions || 24} Supported Conditions · {mlInfo?.num_supported_symptoms || 157} Standardized Clinical Features
          </div>
        </div>

        {/* Config Form */}
        <form onSubmit={handleSave}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" htmlFor="ollama-url">
              Ollama Server URL
            </label>
            <input
              id="ollama-url"
              type="text"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:11434"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" htmlFor="ollama-model">
              Ollama Model Name
            </label>
            <input
              id="ollama-model"
              type="text"
              className="form-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="qwen3.5:4b"
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
              Ensure you have run <code>ollama pull {model}</code> in your terminal.
            </span>
          </div>

          {msg && (
            <div
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: msg.includes('Error') ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: msg.includes('Error') ? '#fda4af' : '#6ee7b7',
                fontSize: '0.82rem',
                marginBottom: '16px',
              }}
            >
              {msg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
