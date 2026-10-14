/**
 * HealthAI Frontend API Client
 * Interfaces with FastAPI backend and handles fallbacks gracefully.
 */

const API_BASE = '/api';

export async function evaluateAssessment(payload) {
  const response = await fetch(`${API_BASE}/assessment/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error (${response.status})`);
  }

  return response.json();
}

export async function checkEmergency(symptoms, context = '') {
  const response = await fetch(`${API_BASE}/assessment/emergency-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms, context }),
  });

  if (!response.ok) {
    throw new Error('Emergency check failed');
  }

  return response.json();
}

export async function fetchSymptomsList() {
  const response = await fetch(`${API_BASE}/assessment/symptoms/list`);
  if (!response.ok) {
    throw new Error('Failed to load symptoms list');
  }
  return response.json();
}

export async function fetchSymptomsCategories() {
  const response = await fetch(`${API_BASE}/assessment/symptoms/categories`);
  if (!response.ok) {
    throw new Error('Failed to load symptom categories');
  }
  return response.json();
}

export async function fetchOllamaStatus() {
  const response = await fetch(`${API_BASE}/system/ollama/status`);
  if (!response.ok) {
    return {
      connected: false,
      message: 'Backend system service offline',
    };
  }
  return response.json();
}

export async function fetchMLInfo() {
  const response = await fetch(`${API_BASE}/system/ml/info`);
  if (!response.ok) {
    return {
      is_trained: false,
      notes: 'ML service unreachable',
    };
  }
  return response.json();
}

export async function updateRuntimeConfig(ollamaUrl, ollamaModel) {
  const response = await fetch(`${API_BASE}/system/config/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ollama_url: ollamaUrl, ollama_model: ollamaModel }),
  });
  return response.json();
}
