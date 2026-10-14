import React from 'react';
import { Activity, ShieldCheck, Heart, PhoneCall } from 'lucide-react';

export default function Footer({ onOpenEmergencyModal }) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-glass)',
        background: 'rgba(9, 13, 22, 0.95)',
        padding: '40px 20px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Activity size={16} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
              Health<span style={{ color: 'var(--primary-400)' }}>AI</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f43f5e', cursor: 'pointer', fontWeight: '600' }} onClick={onOpenEmergencyModal}>
              <PhoneCall size={14} /> India Emergency: 112
            </span>
            <span>·</span>
            <span>US/Intl: 911 / Local Emergency</span>
            <span>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} /> Local & Private
            </span>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '20px',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            lineHeight: '1.6',
          }}
        >
          <p style={{ marginBottom: '8px' }}>
            <strong>Legal Notice:</strong> HealthAI is an artificial intelligence-assisted clinical decision-support and educational tool.
            It is not a licensed healthcare provider, medical device, or diagnostic authority. Never disregard professional medical advice
            or delay seeking it because of something you have read or received from this system.
          </p>
          <p>
            © {new Date().getFullYear()} HealthAI Systems. All clinical assessments are processed transiently with strict privacy standards.
          </p>
        </div>
      </div>
    </footer>
  );
}
