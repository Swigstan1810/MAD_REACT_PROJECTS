// Mock data for the Drug Speak app
export const drugCategories = [
  { id: '1', name: 'Antibiotics', count: 2 },
  { id: '2', name: 'Antivirals', count: 2 },
  { id: '3', name: 'Antifungals', count: 2 },
  { id: '4', name: 'Antihypertensives', count: 5 },
  { id: '5', name: 'Antidepressants', count: 2 },
  { id: '6', name: 'Anti-inflammatory', count: 4 },
  { id: '7', name: 'Antihistamines', count: 1 },
  { id: '8', name: 'Analgesics', count: 2 },
  { id: '9', name: 'Other', count: 9 }
];

export const drugs = [
  // Antibiotics
  { id: '101', name: 'Chloramphenicol', categories: ['1'], molecularFormulas: 'C₁₁H₁₂Cl₂N₂O₅', description: 'A broad-spectrum antibiotic effective against various bacterial infections. It works by inhibiting bacterial protein synthesis.', femaleAudio: 'chloramphenicol_female.wav', maleAudio: 'chloramphenicol_male.wav' },
  { id: '102', name: 'Famciclovir', categories: ['1', '2'], molecularFormulas: 'C₁₄H₁₉N₃O₄', description: 'An antiviral medication used to treat herpes zoster (shingles), genital herpes, and cold sores.', femaleAudio: 'famciclovir_female.wav', maleAudio: 'famciclovir_male.wav' },

  // Antivirals - Famciclovir already included above as it spans categories
  { id: '201', name: 'Naloxone', categories: ['2'], molecularFormulas: 'C₁₉H₂₁NO₄', description: 'Used to block the effects of opioid medications, particularly in overdose situations.', femaleAudio: 'naloxone_female.wav', maleAudio: 'naloxone_male.wav' },

  // Antifungals
  { id: '301', name: 'Fluconazole', categories: ['3'], molecularFormulas: 'C₁₃H₁₂F₂N₆O', description: 'An antifungal medication used to treat fungal infections, including yeast infections, thrush, and certain types of meningitis.', femaleAudio: 'fluconazole_female.wav', maleAudio: 'fluconazole_male.wav' },
  { id: '302', name: 'Triamcinolone', categories: ['3', '6'], molecularFormulas: 'C₂₁H₂₇FO₆', description: 'A corticosteroid used to treat various conditions including skin disorders, allergic conditions, and arthritis.', femaleAudio: 'triamcinolone_female.wav', maleAudio: 'triamcinolone_male.wav' },

  // Antihypertensives
  { id: '401', name: 'Hydrocortisone', categories: ['4', '6'], molecularFormulas: 'C₂₁H₃₀O₅', description: 'A steroid medication used to treat various inflammatory conditions and auto-immune diseases.', femaleAudio: 'hydrocortisone_female.wav', maleAudio: 'hydrocortisone_male.wav' },
  { id: '402', name: 'Levonorgestrel', categories: ['4'], molecularFormulas: 'C₂₁H₂₈O₂', description: 'A hormonal medication used in birth control and emergency contraception.', femaleAudio: 'levonorgestrel_female.wav', maleAudio: 'levonorgestrel_male.wav' },
  { id: '403', name: 'Salbutamol', categories: ['4'], molecularFormulas: 'C₁₃H₂₁NO₃', description: 'A medication that opens the airways in the lungs, used to treat asthma and COPD.', femaleAudio: 'salbutamol_female.wav', maleAudio: 'salbutamol_male.wav' },
  { id: '404', name: 'Terbutaline', categories: ['4'], molecularFormulas: 'C₁₂H₁₉NO₃', description: 'A bronchodilator that relaxes muscles in the airways and increases airflow to the lungs.', femaleAudio: 'terbutaline_female.wav', maleAudio: 'terbutaline_male.wav' },
  { id: '405', name: 'Glyceryl trinitrate', categories: ['4'], molecularFormulas: 'C₃H₅N₃O₉', description: 'Used to treat angina and heart failure, working by relaxing blood vessels.', femaleAudio: 'glyceryl_trinitrate_female.wav', maleAudio: 'glyceryl_trinitrate_male.wav' },

  // Antidepressants
  { id: '501', name: 'Melatonin', categories: ['5'], molecularFormulas: 'C₁₃H₁₆N₂O₂', description: 'A hormone that regulates sleep-wake cycles, often used as a supplement to treat sleep disorders.', femaleAudio: 'melatonin_female.wav', maleAudio: 'melatonin_male.wav' },
  { id: '502', name: 'Metoclopramide', categories: ['5'], molecularFormulas: 'C₁₄H₂₂ClN₃O₂', description: 'Used to treat nausea, vomiting, and gastroesophageal reflux disease.', femaleAudio: 'metoclopramide_female.wav', maleAudio: 'metoclopramide_female.wav' },

  // Anti-inflammatory
  { id: '601', name: 'Ibuprofen', categories: ['6'], molecularFormulas: 'C₁₃H₁₈O₂', description: 'A nonsteroidal anti-inflammatory drug used for treating pain, fever, and inflammation.', femaleAudio: 'ibuprofen_female.wav', maleAudio: 'ibuprofen_male.wav' },
  { id: '602', name: 'Prochlorperazine', categories: ['6'], molecularFormulas: 'C₂₀H₂₄ClN₃S', description: 'Used to treat severe nausea, vomiting, and vertigo.', femaleAudio: 'prochlorperazine_female.wav', maleAudio: 'prochlorperazine_female.wav' },
  // Hydrocortisone and Triamcinolone already included above as they span categories

  // Sedatives/Hypnotics
  { id: '701', name: 'Promethazine', categories: ['7'], molecularFormulas: 'C₁₇H₂₀N₂S', description: 'An antihistamine with strong sedative effects, used to treat allergies and motion sickness.', femaleAudio: 'promethazine_female.wav', maleAudio: 'promethazine_male.wav' },

  // Analgesics/Pain relievers
  { id: '801', name: 'Paracetamol', categories: ['8'], molecularFormulas: 'C₈H₉NO₂', description: 'Also known as acetaminophen, used to treat pain and fever.', femaleAudio: 'paracetamol_female.wav', maleAudio: 'paracetamol_male.wav' },
  { id: '802', name: 'Pantoprazole', categories: ['8'], molecularFormulas: 'C₁₆H₁₅F₂N₃O₄S', description: 'A proton pump inhibitor used to treat certain stomach and esophagus problems.', femaleAudio: 'pantoprazole_female.wav', maleAudio: 'pantoprazole_male.wav' },

  // Other medications
  { id: '901', name: 'Celecoxib', categories: ['9'], molecularFormulas: 'C₁₇H₁₄F₃N₃O₂S', description: 'A selective COX-2 inhibitor used to treat pain and inflammation.', femaleAudio: 'celecoxib_female.wav', maleAudio: 'celecoxib_male.wav' },
  { id: '902', name: 'Dihydrocodeine', categories: ['9'], molecularFormulas: 'C₁₈H₂₃NO₃', description: 'An opioid analgesic used to treat moderate to severe pain.', femaleAudio: 'dihydrocodeine_female.wav', maleAudio: 'dihydrocodeine_female.wav' },
  { id: '903', name: 'Diphenoxylate', categories: ['9'], molecularFormulas: 'C₃₀H₃₂N₂O₂', description: 'An opioid medication used to treat diarrhea.', femaleAudio: 'diphenoxylate_female.wav', maleAudio: 'diphenoxylate_male.wav' },
  { id: '904', name: 'Doxylamine', categories: ['9'], molecularFormulas: 'C₁₇H₂₂N₂O', description: 'An antihistamine used to treat allergies and insomnia.', femaleAudio: 'doxylamine_female.wav', maleAudio: 'doxylamine_female.wav' },
  { id: '905', name: 'Pseudoephedrine', categories: ['9'], molecularFormulas: 'C₁₀H₁₅NO', description: 'A decongestant that relieves nasal congestion from colds and allergies.', femaleAudio: 'pseudoephedrine_female.wav', maleAudio: 'pseudoephedrine_male.wav' },
  { id: '906', name: 'Sumatriptan', categories: ['9'], molecularFormulas: 'C₁₄H₂₁N₃O₂S', description: 'Used to treat migraine headaches, working by narrowing blood vessels in the brain.', femaleAudio: 'sumatriptan_female.wav', maleAudio: 'sumatriptan_male.wav' },
];

export const getDrugsByCategory = (categoryId) => {
  return drugs.filter(drug => drug.categories.includes(categoryId));
};

export const getCategoryNameById = (categoryId) => {
  const category = drugCategories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Unknown';
};

export const getDrugById = (drugId) => {
  return drugs.find(drug => drug.id === drugId);
};