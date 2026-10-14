"""
Medical knowledge base and dataset definitions for the ML Disease Prediction Engine.
Contains curated clinical symptom-disease associations across multiple specialties.
"""

from typing import Dict, List, Any

# Standard clinical condition dictionary
CLINICAL_DISEASE_PROFILES: Dict[str, Dict[str, Any]] = {
    "Common Cold": {
        "category": "Respiratory",
        "hallmark_symptoms": ["runny nose", "sneezing", "sore throat", "mild cough", "nasal congestion"],
        "secondary_symptoms": ["mild fatigue", "low grade fever", "headache", "watery eyes"],
        "overview": "A viral infectious disease of the upper respiratory tract that primarily affects the respiratory mucosa of the nose, throat, and sinuses.",
        "questions_for_doctor": [
            "Are my symptoms consistent with a common cold rather than influenza or sinusitis?",
            "What symptomatic relief measures do you recommend?",
            "At what point should I seek further evaluation if symptoms persist beyond 10 days?",
        ],
    },
    "Influenza (Flu)": {
        "category": "Respiratory",
        "hallmark_symptoms": ["high fever", "chills", "severe body aches", "dry cough", "extreme fatigue"],
        "secondary_symptoms": ["headache", "sore throat", "runny nose", "loss of appetite"],
        "overview": "An acute viral infection of the respiratory tract caused by influenza viruses, characterized by sudden onset of high fever and systemic symptoms.",
        "questions_for_doctor": [
            "Would antiviral medications (e.g., oseltamivir) be beneficial based on symptom onset?",
            "What signs would indicate secondary bacterial pneumonia?",
            "How long should I self-isolate to prevent transmission?",
        ],
    },
    "COVID-19": {
        "category": "Respiratory / Infectious",
        "hallmark_symptoms": ["fever", "dry cough", "loss of taste", "loss of smell", "fatigue", "shortness of breath"],
        "secondary_symptoms": ["body aches", "sore throat", "headache", "nasal congestion", "nausea", "diarrhea"],
        "overview": "An infectious respiratory illness caused by the SARS-CoV-2 coronavirus, with clinical manifestations ranging from mild upper airway symptoms to severe systemic illness.",
        "questions_for_doctor": [
            "Should I perform a rapid antigen or RT-PCR test?",
            "Am I eligible for antiviral therapies or monoclonal antibody treatments?",
            "What oxygen saturation threshold (SpO2) requires immediate emergency evaluation?",
        ],
    },
    "Acute Bronchitis": {
        "category": "Respiratory",
        "hallmark_symptoms": ["persistent cough", "phlegm production", "chest discomfort with coughing", "mild wheezing"],
        "secondary_symptoms": ["low grade fever", "fatigue", "sore throat", "shortness of breath on exertion"],
        "overview": "Inflammation of the tracheobronchial tree, frequently following an upper respiratory viral infection, characterized by cough with or without sputum production.",
        "questions_for_doctor": [
            "Is my bronchitis likely viral or bacterial?",
            "Would a bronchodilator inhaler help ease my cough and breathing?",
            "Are there any signs suggesting development of pneumonia?",
        ],
    },
    "Pneumonia": {
        "category": "Respiratory",
        "hallmark_symptoms": ["productive cough with discolored phlegm", "high fever", "shaking chills", "pleuritic chest pain", "shortness of breath"],
        "secondary_symptoms": ["rapid shallow breathing", "fatigue", "confusion in elderly", "sweating", "loss of appetite"],
        "overview": "An inflammatory condition of the lung affecting primarily the microscopic air sacs (alveoli), usually caused by viral or bacterial infection.",
        "questions_for_doctor": [
            "Do I require a chest X-ray to confirm lung consolidation?",
            "Do I need prescription antibiotics?",
            "What is my blood oxygen level and is hospitalization required?",
        ],
    },
    "Allergic Rhinitis": {
        "category": "Immunology",
        "hallmark_symptoms": ["sneezing paroxysms", "itchy watery eyes", "clear runny nose", "nasal congestion", "itchy throat"],
        "secondary_symptoms": ["post-nasal drip", "dark under-eye circles", "fatigue from disturbed sleep"],
        "overview": "An allergic inflammation of the nasal airways triggered by airborne allergens such as pollen, pet dander, or dust mites.",
        "questions_for_doctor": [
            "Which antihistamine or corticosteroid nasal spray is best suited for my symptoms?",
            "Should I consider formal allergy testing?",
            "How can I minimize allergen exposure at home?",
        ],
    },
    "Acute Sinusitis": {
        "category": "ENT",
        "hallmark_symptoms": ["facial pain and pressure", "thick discolored nasal discharge", "nasal congestion", "headache worse bending forward"],
        "secondary_symptoms": ["tooth pain in upper jaw", "halitosis", "fever", "reduced sense of smell"],
        "overview": "Inflammation of the tissue lining the paranasal sinuses, resulting in mucus blockage, facial pressure, and headache.",
        "questions_for_doctor": [
            "Has my sinusitis progressed to a bacterial infection requiring antibiotics?",
            "Are saline nasal irrigations recommended for my sinus clearance?",
            "How can I relieve intense facial pressure safely?",
        ],
    },
    "Strep Throat (Pharyngitis)": {
        "category": "ENT / Infectious",
        "hallmark_symptoms": ["severe throat pain", "painful swallowing", "fever", "swollen tender cervical lymph nodes", "white exudate on tonsils"],
        "secondary_symptoms": ["headache", "absence of cough", "abdominal pain in children", "red spots on roof of mouth"],
        "overview": "Bacterial pharyngitis caused by Group A Streptococcus, requiring diagnostic confirmation to prevent complications like rheumatic fever.",
        "questions_for_doctor": [
            "Can we do a rapid strep throat swab test?",
            "Do I need penicillin or an alternative antibiotic?",
            "When will I no longer be contagious after starting treatment?",
        ],
    },
    "GERD (Acid Reflux)": {
        "category": "Gastroenterology",
        "hallmark_symptoms": ["heartburn", "acid regurgitation", "chest discomfort after eating", "sour taste in mouth"],
        "secondary_symptoms": ["difficulty swallowing", "chronic dry cough", "hoarseness in morning", "bloating"],
        "overview": "A digestive disease where stomach acid or bile irritates the lining of the food pipe (esophagus), causing burning retrosternal discomfort.",
        "questions_for_doctor": [
            "Is my chest discomfort attributable to gastroesophageal reflux rather than cardiac issues?",
            "What lifestyle and dietary modifications should I prioritize?",
            "Should I take an H2 blocker or proton pump inhibitor (PPI)?",
        ],
    },
    "Gastroenteritis (Stomach Flu)": {
        "category": "Gastroenterology",
        "hallmark_symptoms": ["watery diarrhea", "abdominal cramping", "nausea", "vomiting", "low grade fever"],
        "secondary_symptoms": ["dehydration symptoms", "headache", "muscle aches", "loss of appetite"],
        "overview": "Inflammation of the gastrointestinal tract involving both the stomach and small intestine, causing acute diarrhea and emesis.",
        "questions_for_doctor": [
            "What oral rehydration electrolyte protocol should I follow?",
            "What warning signs of severe dehydration should prompt hospital care?",
            "Are stool tests needed to rule out bacterial or parasitic pathogens?",
        ],
    },
    "Migraine": {
        "category": "Neurology",
        "hallmark_symptoms": ["throbbing unilateral headache", "photophobia (light sensitivity)", "phonophobia (sound sensitivity)", "nausea"],
        "secondary_symptoms": ["visual aura or blind spots", "vomiting", "dizziness", "worsened by physical activity"],
        "overview": "A neurological condition characterized by recurrent intense, pulsating headaches, often accompanied by autonomic and sensory symptoms.",
        "questions_for_doctor": [
            "Could prescription abortive medications (such as triptans) be appropriate for my attacks?",
            "What prophylactic therapy should be considered if attacks become frequent?",
            "What non-pharmacological migraine trigger tracking methods are recommended?",
        ],
    },
    "Tension Headache": {
        "category": "Neurology",
        "hallmark_symptoms": ["dull aching head pain", "sensation of tight band around forehead", "tenderness on scalp or neck muscles"],
        "secondary_symptoms": ["mild fatigue", "trouble sleeping", "difficulty concentrating"],
        "overview": "The most common type of primary headache, presenting as bilateral dull, non-pulsatile pain without typical migraine associated features.",
        "questions_for_doctor": [
            "Are my headaches primary tension-type headaches?",
            "Could ergonomic or physical therapy alleviate my neck and shoulder tension?",
            "How do I prevent medication overuse (rebound) headaches?",
        ],
    },
    "Urinary Tract Infection (UTI)": {
        "category": "Urology",
        "hallmark_symptoms": ["burning sensation during urination", "frequent urge to urinate", "cloudy or strong smelling urine", "lower pelvic pressure"],
        "secondary_symptoms": ["low grade fever", "traces of blood in urine", "fatigue"],
        "overview": "An infection in any part of the urinary system (kidneys, ureters, bladder, and urethra), most commonly affecting the lower urinary tract.",
        "questions_for_doctor": [
            "Can we conduct a urine dipstick and culture test today?",
            "What antibiotic is most effective for uncomplicated cystitis based on local resistance?",
            "What symptoms would suggest the infection has ascended to the kidneys (pyelonephritis)?",
        ],
    },
    "Asthma Exacerbation": {
        "category": "Respiratory",
        "hallmark_symptoms": ["wheezing breath sounds", "coughing especially at night", "chest tightness", "shortness of breath during exertion"],
        "secondary_symptoms": ["anxiety with breathing", "rapid breathing", "fatigue"],
        "overview": "A chronic inflammatory condition of the airways that causes recurrent episodes of airflow obstruction, wheezing, and coughing.",
        "questions_for_doctor": [
            "How should I adjust my rescue inhaler and controller medication according to my asthma action plan?",
            "Do I need an oral course of corticosteroids to resolve this flare-up?",
            "What peak flow meter readings should trigger urgent medical care?",
        ],
    },
    "Hypertension (Essential)": {
        "category": "Cardiovascular",
        "hallmark_symptoms": ["often asymptomatic", "morning occipital headaches", "occasional dizziness", "mild palpitations"],
        "secondary_symptoms": ["facial flushing", "fatigue", "blurred vision if severe"],
        "overview": "Persistent elevation of systemic arterial blood pressure requiring clinical confirmation through ambulatory or repeated clinic readings.",
        "questions_for_doctor": [
            "What is my target blood pressure based on my cardiovascular risk profile?",
            "Should I maintain a home blood pressure log before starting medication?",
            "What dietary (DASH diet) and sodium restriction goals should I set?",
        ],
    },
    "Type 2 Diabetes Mellitus": {
        "category": "Endocrinology",
        "hallmark_symptoms": ["frequent urination (polyuria)", "excessive thirst (polydipsia)", "unexplained weight loss", "persistent fatigue"],
        "secondary_symptoms": ["blurred vision", "slow healing cuts or sores", "recurrent fungal infections", "tingling in feet"],
        "overview": "A metabolic disorder characterized by chronic hyperglycemia resulting from defects in insulin secretion, insulin action, or both.",
        "questions_for_doctor": [
            "Should we check fasting plasma glucose and HbA1c levels?",
            "What comprehensive lifestyle interventions are recommended?",
            "How often should I monitor my blood glucose at home?",
        ],
    },
    "Hypothyroidism": {
        "category": "Endocrinology",
        "hallmark_symptoms": ["unexplained weight gain", "cold intolerance", "chronic fatigue", "constipation", "dry coarse skin"],
        "secondary_symptoms": ["muscle weakness", "brittle hair and nails", "depression", "puffy face", "joint pain"],
        "overview": "A condition in which the thyroid gland produces insufficient thyroid hormone (T3 and T4), slowing basal metabolic rate.",
        "questions_for_doctor": [
            "Can we order a serum TSH and free T4 panel?",
            "If diagnosed, what is the starting dose for levothyroxine?",
            "Are there any drug interactions or dietary considerations with thyroid therapy?",
        ],
    },
    "Dengue Fever": {
        "category": "Infectious Disease",
        "hallmark_symptoms": ["sudden high fever", "severe retro-orbital pain (behind eyes)", "severe joint and muscle pain (breakbone fever)", "petechial rash"],
        "secondary_symptoms": ["nausea and vomiting", "mild bleeding from gums or nose", "extreme fatigue"],
        "overview": "A mosquito-borne viral infection endemic in tropical and subtropical regions, caused by the dengue virus (flavivirus).",
        "questions_for_doctor": [
            "Should we do a Dengue NS1 antigen and complete blood count (platelet count)?",
            "What platelet monitoring frequency is advised?",
            "What critical warning signs (abdominal pain, persistent vomiting, mucosal bleeding) require hospital admission?",
        ],
    },
    "Malaria": {
        "category": "Infectious Disease",
        "hallmark_symptoms": ["cyclical high fever with rigors", "intense shivering chills", "profuse drenching sweating", "severe headache"],
        "secondary_symptoms": ["nausea and vomiting", "abdominal pain", "diarrhea", "generalized muscle aches", "jaundice"],
        "overview": "A life-threatening disease caused by Plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes.",
        "questions_for_doctor": [
            "Can we run a malaria rapid diagnostic test (RDT) and peripheral blood smear?",
            "What species of malaria is suspected and which artemisinin combination therapy (ACT) is indicated?",
            "Are liver function tests or hemolytic markers needed?",
        ],
    },
    "Irritable Bowel Syndrome (IBS)": {
        "category": "Gastroenterology",
        "hallmark_symptoms": ["cramping abdominal pain relieved by defecation", "alternating diarrhea and constipation", "abdominal bloating"],
        "secondary_symptoms": ["feeling of incomplete bowel evacuation", "mucus in stool", "gas and flatulence"],
        "overview": "A common disorder of brain-gut interaction affecting the large intestine, characterized by abdominal pain associated with altered bowel habits.",
        "questions_for_doctor": [
            "Are my symptoms meeting the Rome IV criteria for IBS?",
            "Do we need tests (celiac serology, fecal calprotectin) to rule out inflammatory bowel disease?",
            "Would a trial of the low-FODMAP diet or antispasmodics help?",
        ],
    },
    "Osteoarthritis": {
        "category": "Rheumatology",
        "hallmark_symptoms": ["joint pain exacerbated by activity", "morning joint stiffness under 30 minutes", "joint crepitus (grating sound)", "joint swelling"],
        "secondary_symptoms": ["reduced range of motion", "bony enlargement", "instability in weight-bearing joints"],
        "overview": "A degenerative joint disease involving the breakdown of articular cartilage and underlying bone, most frequently affecting knees, hips, and hands.",
        "questions_for_doctor": [
            "Do we need weight-bearing radiographs of the affected joints?",
            "What targeted physical therapy exercises are recommended for joint preservation?",
            "What are the safest long-term pain management options for my joints?",
        ],
    },
    "Contact Dermatitis": {
        "category": "Dermatology",
        "hallmark_symptoms": ["localized red skin rash", "intense skin itching", "dry cracked scaly skin", "blisters or weeping skin"],
        "secondary_symptoms": ["burning sensation on skin", "swelling around rash area"],
        "overview": "An inflammatory skin reaction caused by direct contact with a substance that acts as an allergen or irritant (e.g., metals, soaps, chemicals).",
        "questions_for_doctor": [
            "Is this reaction irritant contact dermatitis or allergic contact dermatitis?",
            "Would a topical corticosteroid cream help resolve this inflammation?",
            "Should patch testing be arranged to pinpoint specific contact allergens?",
        ],
    },
    "Appendicitis": {
        "category": "Emergency / Surgery",
        "hallmark_symptoms": ["pain starting around navel then shifting to right lower abdomen", "rebound tenderness at McBurney's point", "low fever", "nausea and vomiting"],
        "secondary_symptoms": ["loss of appetite", "constipation or diarrhea", "abdominal swelling"],
        "overview": "Acute inflammation of the vermiform appendix, requiring urgent surgical evaluation to prevent rupture and peritonitis.",
        "questions_for_doctor": [
            "Is an urgent ultrasound or abdominal CT scan indicated?",
            "Should I remain nil-by-mouth (fasting) in case urgent surgery is required?",
            "What is the surgical opinion regarding immediate appendectomy?",
        ],
    },
    "Iron Deficiency Anemia": {
        "category": "Hematology",
        "hallmark_symptoms": ["chronic fatigue", "pale skin and conjunctiva", "shortness of breath on mild exertion", "brittle nails", "cold hands and feet"],
        "secondary_symptoms": ["dizziness upon standing", "headache", "pica (craving ice or non-food items)", "rapid heart rate"],
        "overview": "A condition in which blood lacks adequate healthy red blood cells due to insufficient iron, leading to impaired oxygen delivery to tissues.",
        "questions_for_doctor": [
            "Can we check a Complete Blood Count (CBC) and serum ferritin level?",
            "What is the underlying cause of iron deficiency (e.g., occult blood loss, malabsorption)?",
            "What oral iron supplementation regimen and absorption enhancers are recommended?",
        ],
    },
}

# Collect all unique symptoms recognized across the database
def get_all_supported_symptoms() -> List[str]:
    symptoms = set()
    for profile in CLINICAL_DISEASE_PROFILES.values():
        for s in profile["hallmark_symptoms"]:
            symptoms.add(s.lower().strip())
        for s in profile["secondary_symptoms"]:
            symptoms.add(s.lower().strip())
    return sorted(list(symptoms))

ALL_SUPPORTED_SYMPTOMS = get_all_supported_symptoms()
ALL_SUPPORTED_CONDITIONS = sorted(list(CLINICAL_DISEASE_PROFILES.keys()))
