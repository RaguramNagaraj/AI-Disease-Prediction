import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import Hero from './components/Hero';
import AssessmentWizard from './components/AssessmentWizard';
import AssessmentResults from './components/AssessmentResults';
import HowItWorks from './components/HowItWorks';
import EmergencyModal from './components/EmergencyModal';
import SystemSettingsModal from './components/SystemSettingsModal';
import Footer from './components/Footer';
import {
  evaluateAssessment,
  fetchOllamaStatus,
  fetchMLInfo,
} from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'wizard' | 'results'
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // System status
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [mlInfo, setMlInfo] = useState(null);

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyRedFlags, setEmergencyRedFlags] = useState([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const loadSystemStatus = async () => {
    try {
      const [oStatus, mInfo] = await Promise.all([
        fetchOllamaStatus(),
        fetchMLInfo(),
      ]);
      setOllamaStatus(oStatus);
      setMlInfo(mInfo);
    } catch (err) {
      console.warn('System status fetch issue:', err);
    }
  };

  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 30000); // Check status every 30s
    return () => clearInterval(interval);
  }, []);

  const handleStartAssessment = () => {
    setErrorMessage('');
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLearnMore = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmergencyDetected = (flags) => {
    setEmergencyRedFlags(flags);
    setIsEmergencyModalOpen(true);
  };

  const handleSubmitAssessment = async (payload) => {
    setIsLoading(true);
    setErrorMessage('');
    setLastSubmittedPayload(payload);

    try {
      const response = await evaluateAssessment(payload);
      setAssessmentResult(response);

      if (response.is_emergency) {
        setEmergencyRedFlags(response.supporting_info || []);
        setIsEmergencyModalOpen(true);
      }

      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(err.message || 'Assessment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineWithAnswers = async (newAnswers) => {
    if (!lastSubmittedPayload) return;
    setIsRefining(true);
    setErrorMessage('');

    const updatedPayload = {
      ...lastSubmittedPayload,
      answers: {
        ...(lastSubmittedPayload.answers || {}),
        ...newAnswers,
      },
    };

    try {
      const response = await evaluateAssessment(updatedPayload);
      setAssessmentResult(response);
      setLastSubmittedPayload(updatedPayload);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to refine assessment.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleResetToHome = () => {
    setCurrentView('home');
    setAssessmentResult(null);
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar
        ollamaStatus={ollamaStatus}
        onOpenEmergencyModal={() => {
          setEmergencyRedFlags([]);
          setIsEmergencyModalOpen(true);
        }}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onResetToHome={handleResetToHome}
      />

      <main className="main-content">
        <DisclaimerBanner />

        {errorMessage && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#fda4af',
              fontSize: '0.9rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage('')}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* VIEW: HOME LANDING */}
        {currentView === 'home' && (
          <>
            <Hero
              onStartAssessment={handleStartAssessment}
              onLearnMore={handleLearnMore}
            />
            <div id="how-it-works-section">
              <HowItWorks onStartAssessment={handleStartAssessment} />
            </div>
          </>
        )}

        {/* VIEW: ASSESSMENT WIZARD */}
        {currentView === 'wizard' && (
          <AssessmentWizard
            onSubmitAssessment={handleSubmitAssessment}
            isLoading={isLoading}
            onEmergencyDetected={handleEmergencyDetected}
          />
        )}

        {/* VIEW: RESULTS PRESENTATION */}
        {currentView === 'results' && (
          <AssessmentResults
            result={assessmentResult}
            onReset={handleStartAssessment}
            onRefineWithAnswers={handleRefineWithAnswers}
            isRefining={isRefining}
          />
        )}
      </main>

      {/* Emergency Red Flag Alert Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        redFlags={emergencyRedFlags}
      />

      {/* System & Ollama Configuration Modal */}
      <SystemSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        ollamaStatus={ollamaStatus}
        mlInfo={mlInfo}
        onRefreshStatus={loadSystemStatus}
      />

      <Footer
        onOpenEmergencyModal={() => {
          setEmergencyRedFlags([]);
          setIsEmergencyModalOpen(true);
        }}
      />
    </div>
  );
}
