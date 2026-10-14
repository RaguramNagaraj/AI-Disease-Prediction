import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, Cpu, RefreshCw, Settings } from 'lucide-react';

export default function Navbar({
  ollamaStatus,
  onOpenEmergencyModal,
  onOpenSettingsModal,
  onResetToHome,
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand" onClick={onResetToHome} title="Go to Home">
          <div className="nav-brand-icon">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div className="nav-brand-title">
            Health<span>AI</span>
          </div>
        </div>

        <div className="nav-status-group">
          {/* AI / ML Runtime Indicator */}
          <div
            className="status-chip"
            onClick={onOpenSettingsModal}
            style={{ cursor: 'pointer' }}
            title="Click to view AI & ML Engine Status"
          >
            <span
              className={`status-dot ${
                ollamaStatus?.connected ? 'online' : 'standby'
              }`}
            />
            <Cpu size={13} style={{ color: 'var(--primary-400)' }} />
            <span>
              {ollamaStatus?.connected
                ? `Ollama: ${ollamaStatus.configured_model || 'qwen3.5:4b'}`
                : 'ML Engine (Local Active)'}
            </span>
          </div>

          {/* Quick Settings Icon */}
          <button
            className="btn btn-secondary"
            onClick={onOpenSettingsModal}
            title="Configure Ollama Runtime & Engine"
            style={{ padding: '7px 10px', borderRadius: 'var(--radius-full)' }}
          >
            <Settings size={15} />
          </button>

          {/* Emergency Direct Hotlink */}
          <button
            className="emergency-btn-nav"
            onClick={onOpenEmergencyModal}
            title="View Emergency Guidance & Helplines"
          >
            <AlertTriangle size={14} />
            <span>Emergency (112)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
