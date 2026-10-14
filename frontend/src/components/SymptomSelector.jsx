import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Tag, Sparkles, Filter } from 'lucide-react';
import { fetchSymptomsList, fetchSymptomsCategories, checkEmergency } from '../services/api';

const DEFAULT_CATEGORIES = {
  'Respiratory & Chest': [
    'persistent cough', 'dry cough', 'shortness of breath', 'mild wheezing',
    'chest tightness', 'pleuritic chest pain', 'productive cough with discolored phlegm'
  ],
  'Head, ENT & Eyes': [
    'runny nose', 'sneezing', 'sore throat', 'nasal congestion', 'facial pain and pressure',
    'throbbing unilateral headache', 'dull aching head pain', 'loss of taste', 'loss of smell'
  ],
  'Gastrointestinal': [
    'nausea', 'vomiting', 'watery diarrhea', 'abdominal cramping', 'heartburn',
    'acid regurgitation', 'bloating', 'loss of appetite'
  ],
  'Systemic & Fever': [
    'high fever', 'low grade fever', 'chills', 'severe body aches', 'extreme fatigue',
    'chronic fatigue', 'cold intolerance', 'unexplained weight loss'
  ],
  'Urinary & Pelvic': [
    'burning sensation during urination', 'frequent urge to urinate',
    'cloudy or strong smelling urine', 'lower pelvic pressure'
  ],
  'Skin & Joints': [
    'joint pain', 'morning joint stiffness', 'localized red skin rash', 'intense skin itching',
    'dry cracked scaly skin', 'muscle aches'
  ]
};

export default function SymptomSelector({
  selectedSymptoms,
  onSymptomsChange,
  onEmergencyDetected,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Load symptoms from backend
  useEffect(() => {
    async function loadData() {
      try {
        const list = await fetchSymptomsList();
        if (list && list.length > 0) {
          setAllSymptoms(list);
        }
      } catch (e) {
        // Fallback to flatten DEFAULT_CATEGORIES
        const fallbackList = Object.values(DEFAULT_CATEGORIES).flat();
        setAllSymptoms([...new Set(fallbackList)]);
      }

      try {
        const catMap = await fetchSymptomsCategories();
        if (catMap && Object.keys(catMap).length > 0) {
          setCategories(catMap);
        }
      } catch (e) {
        // Use default
      }
    }
    loadData();
  }, []);

  // Filter autocomplete suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const matches = allSymptoms.filter(
      (s) =>
        s.toLowerCase().includes(term) &&
        !selectedSymptoms.some((sel) => sel.toLowerCase() === s.toLowerCase())
    );
    setFilteredSuggestions(matches.slice(0, 8));
    setIsDropdownOpen(true);
  }, [searchTerm, allSymptoms, selectedSymptoms]);

  // Click outside listener for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSymptom = async (symptom) => {
    const clean = symptom.trim().toLowerCase();
    if (!clean) return;

    if (!selectedSymptoms.some((s) => s.toLowerCase() === clean)) {
      const updated = [...selectedSymptoms, clean];
      onSymptomsChange(updated);

      // Perform fast real-time emergency check
      try {
        const check = await checkEmergency(updated);
        if (check.is_emergency && onEmergencyDetected) {
          onEmergencyDetected(check.red_flags_detected);
        }
      } catch (err) {
        console.error('Real-time emergency check error:', err);
      }
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const removeSymptom = (symptomToRemove) => {
    const updated = selectedSymptoms.filter((s) => s !== symptomToRemove);
    onSymptomsChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        addSymptom(filteredSuggestions[0]);
      } else if (searchTerm.trim()) {
        addSymptom(searchTerm);
      }
    }
  };

  // Symptoms in active category
  const activeCategorySymptoms =
    activeCategory === 'All'
      ? allSymptoms.slice(0, 40)
      : categories[activeCategory] || [];

  return (
    <div>
      <div className="form-group" ref={searchContainerRef}>
        <label className="form-label" htmlFor="symptom-search-input">
          Search or Enter Symptoms
        </label>
        <div className="symptom-search-box">
          <Search size={18} className="search-icon" />
          <input
            id="symptom-search-input"
            type="text"
            className="search-input"
            placeholder="Type symptoms (e.g., headache, fever, persistent cough, chest pain)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (filteredSuggestions.length > 0) setIsDropdownOpen(true);
            }}
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => addSymptom(searchTerm)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--primary-500)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={14} /> Add
            </button>
          )}

          {isDropdownOpen && filteredSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {filteredSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => addSymptom(item)}
                >
                  <span>{item}</span>
                  <Plus size={14} style={{ color: 'var(--primary-400)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Symptoms Tray */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Selected Symptoms ({selectedSymptoms.length})
          </span>
          {selectedSymptoms.length > 0 && (
            <button
              type="button"
              onClick={() => onSymptomsChange([])}
              style={{
                background: 'none',
                border: 'none',
                color: '#f43f5e',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Clear All
            </button>
          )}
        </div>

        <div className="selected-symptoms-tray">
          {selectedSymptoms.length === 0 ? (
            <span style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>
              No symptoms added yet. Type in the box above or select from the common symptoms below.
            </span>
          ) : (
            selectedSymptoms.map((symptom, idx) => (
              <span key={idx} className="symptom-chip">
                <span>{symptom}</span>
                <button
                  type="button"
                  className="symptom-chip-remove"
                  onClick={() => removeSymptom(symptom)}
                  aria-label={`Remove ${symptom}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Category Pills & Quick Select */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '600' }}>
          <Filter size={14} /> Browse by Clinical Category:
        </div>
        <div className="category-pills">
          <button
            type="button"
            className={`category-pill ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All Common Symptoms
          </button>
          {Object.keys(categories).map((catName) => (
            <button
              key={catName}
              type="button"
              className={`category-pill ${activeCategory === catName ? 'active' : ''}`}
              onClick={() => setActiveCategory(catName)}
            >
              {catName}
            </button>
          ))}
        </div>

        <div className="quick-tags-grid">
          {activeCategorySymptoms.map((symptom, idx) => {
            const isSelected = selectedSymptoms.some(
              (s) => s.toLowerCase() === symptom.toLowerCase()
            );
            return (
              <button
                key={idx}
                type="button"
                className={`quick-tag ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    removeSymptom(symptom);
                  } else {
                    addSymptom(symptom);
                  }
                }}
              >
                {isSelected ? '✓ ' : '+ '}
                {symptom}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
