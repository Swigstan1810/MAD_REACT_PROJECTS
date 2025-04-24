// Mock data for the Drug Speak app
export const drugCategories = [
  { id: '1', name: 'Antibiotics', count: 8 },
  { id: '2', name: 'Antivirals', count: 6 },
  { id: '3', name: 'Antifungals', count: 5 },
  { id: '4', name: 'Antihypertensives', count: 7 },
  { id: '5', name: 'Antidepressants', count: 6 },
  { id: '6', name: 'Anti-inflammatory', count: 9 },
];

export const drugs = [
  // Antibiotics
  { id: '101', name: 'Amoxicillin', categories: ['1'], molecularFormulas: 'C₁₆H₁₉N₃O₅S', description: '...', femaleAudio: 'amoxicillin_female.mp3', maleAudio: 'amoxicillin_male.mp3' },
  { id: '102', name: 'Azithromycin', categories: ['1'], molecularFormulas: 'C₃₈H₇₂N₂O₁₂', description: '...', femaleAudio: 'azithromycin_female.mp3', maleAudio: 'azithromycin_male.mp3' },
  { id: '103', name: 'Ciprofloxacin', categories: ['1'], molecularFormulas: 'C₁₇H₁₈FN₃O₃', description: '...', femaleAudio: 'ciprofloxacin_female.mp3', maleAudio: 'ciprofloxacin_male.mp3' },
  { id: '104', name: 'Doxycycline', categories: ['1'], molecularFormulas: 'C₂₂H₂₄N₂O₈', description: '...', femaleAudio: 'doxycycline_female.mp3', maleAudio: 'doxycycline_male.mp3' },
  { id: '105', name: 'Erythromycin', categories: ['1'], molecularFormulas: 'C₃₇H₆₇NO₁₃', description: '...', femaleAudio: 'erythromycin_female.mp3', maleAudio: 'erythromycin_male.mp3' },
  { id: '106', name: 'Penicillin', categories: ['1'], molecularFormulas: 'C₁₆H₁₈N₂O₄S', description: '...', femaleAudio: 'penicillin_female.mp3', maleAudio: 'penicillin_male.mp3' },
  { id: '107', name: 'Tetracycline', categories: ['1'], molecularFormulas: 'C₂₂H₂₄N₂O₈', description: '...', femaleAudio: 'tetracycline_female.mp3', maleAudio: 'tetracycline_male.mp3' },
  { id: '108', name: 'Vancomycin', categories: ['1'], molecularFormulas: 'C₆₆H₇₅Cl₂N₉O₂₄', description: '...', femaleAudio: 'vancomycin_female.mp3', maleAudio: 'vancomycin_male.mp3' },

  // Antivirals
  { id: '201', name: 'Acyclovir', categories: ['2'], molecularFormulas: 'C₈H₁₁N₅O₃', description: '...', femaleAudio: 'acyclovir_female.mp3', maleAudio: 'acyclovir_male.mp3' },
  { id: '202', name: 'Oseltamivir', categories: ['2'], molecularFormulas: 'C₁₆H₂₈N₂O₄', description: '...', femaleAudio: 'oseltamivir_female.mp3', maleAudio: 'oseltamivir_male.mp3' },
  { id: '203', name: 'Ribavirin', categories: ['2', '4'], molecularFormulas: 'C₈H₁₂N₄O₅', description: '...', femaleAudio: 'ribavirin_female.mp3', maleAudio: 'ribavirin_male.mp3' },
  { id: '204', name: 'Valacyclovir', categories: ['2'], molecularFormulas: 'C13H20N6O4', description: '...', femaleAudio: 'valacyclovir_female.mp3', maleAudio: 'valacyclovir_male.mp3' },
  { id: '205', name: 'Zanamivir', categories: ['2'], molecularFormulas: 'C12H20N4O7', description: '...', femaleAudio: 'zanamivir_female.mp3', maleAudio: 'zanamivir_male.mp3' },
  { id: '206', name: 'Remdesivir', categories: ['2'], molecularFormulas: 'C27H35N6O8P', description: '...', femaleAudio: 'remdesivir_female.mp3', maleAudio: 'remdesivir_male.mp3' },

  // Antifungals
  { id: '301', name: 'Fluconazole', categories: ['3', '6'], molecularFormulas: 'C₁₃H₁₂F₂N₆O', description: '...', femaleAudio: 'fluconazole_female.mp3', maleAudio: 'fluconazole_male.mp3' },
  { id: '302', name: 'Ketoconazole', categories: ['3'], molecularFormulas: 'C26H28Cl2N4O4', description: '...', femaleAudio: 'ketoconazole_female.mp3', maleAudio: 'ketoconazole_male.mp3' },
  { id: '303', name: 'Clotrimazole', categories: ['3'], molecularFormulas: 'C22H17ClN2', description: '...', femaleAudio: 'clotrimazole_female.mp3', maleAudio: 'clotrimazole_male.mp3' },
  { id: '304', name: 'Itraconazole', categories: ['3'], molecularFormulas: 'C35H38Cl2N8O4', description: '...', femaleAudio: 'itraconazole_female.mp3', maleAudio: 'itraconazole_male.mp3' },
  { id: '305', name: 'Terbinafine', categories: ['3'], molecularFormulas: 'C21H25N', description: '...', femaleAudio: 'terbinafine_female.mp3', maleAudio: 'terbinafine_male.mp3' },

  // Antihypertensives
  { id: '401', name: 'Lisinopril', categories: ['4'], molecularFormulas: 'C21H31N3O5', description: '...', femaleAudio: 'lisinopril_female.mp3', maleAudio: 'lisinopril_male.mp3' },
  { id: '402', name: 'Amlodipine', categories: ['4'], molecularFormulas: 'C20H25ClN2O5', description: '...', femaleAudio: 'amlodipine_female.mp3', maleAudio: 'amlodipine_male.mp3' },
  { id: '403', name: 'Losartan', categories: ['4'], molecularFormulas: 'C22H23ClN6O', description: '...', femaleAudio: 'losartan_female.mp3', maleAudio: 'losartan_male.mp3' },
  { id: '404', name: 'Metoprolol', categories: ['4'], molecularFormulas: 'C15H25NO3', description: '...', femaleAudio: 'metoprolol_female.mp3', maleAudio: 'metoprolol_male.mp3' },
  { id: '405', name: 'Hydrochlorothiazide', categories: ['4'], molecularFormulas: 'C7H8ClN3O4S2', description: '...', femaleAudio: 'hydrochlorothiazide_female.mp3', maleAudio: 'hydrochlorothiazide_male.mp3' },
  { id: '406', name: 'Valsartan', categories: ['4'], molecularFormulas: 'C24H29N5O3', description: '...', femaleAudio: 'valsartan_female.mp3', maleAudio: 'valsartan_male.mp3' },
  { id: '407', name: 'Propranolol', categories: ['4'], molecularFormulas: 'C16H21NO2', description: '...', femaleAudio: 'propranolol_female.mp3', maleAudio: 'propranolol_male.mp3' },

  // Antidepressants
  { id: '501', name: 'Fluoxetine', categories: ['5'], molecularFormulas: 'C17H18F3NO', description: '...', femaleAudio: 'fluoxetine_female.mp3', maleAudio: 'fluoxetine_male.mp3' },
  { id: '502', name: 'Sertraline', categories: ['5'], molecularFormulas: 'C17H17Cl2N', description: '...', femaleAudio: 'sertraline_female.mp3', maleAudio: 'sertraline_male.mp3' },
  { id: '503', name: 'Citalopram', categories: ['5'], molecularFormulas: 'C20H21FN2O', description: '...', femaleAudio: 'citalopram_female.mp3', maleAudio: 'citalopram_male.mp3' },
  { id: '504', name: 'Amitriptyline', categories: ['5'], molecularFormulas: 'C20H23N', description: '...', femaleAudio: 'amitriptyline_female.mp3', maleAudio: 'amitriptyline_male.mp3' },
  { id: '505', name: 'Venlafaxine', categories: ['5'], molecularFormulas: 'C17H27NO2', description: '...', femaleAudio: 'venlafaxine_female.mp3', maleAudio: 'venlafaxine_male.mp3' },
  { id: '506', name: 'Duloxetine', categories: ['5'], molecularFormulas: 'C18H19NOS', description: '...', femaleAudio: 'duloxetine_female.mp3', maleAudio: 'duloxetine_male.mp3' },

  // Anti-inflammatory
  { id: '601', name: 'Ibuprofen', categories: ['6'], molecularFormulas: 'C13H18O2', description: '...', femaleAudio: 'ibuprofen_female.mp3', maleAudio: 'ibuprofen_male.mp3' },
  { id: '602', name: 'Naproxen', categories: ['6'], molecularFormulas: 'C14H14O3', description: '...', femaleAudio: 'naproxen_female.mp3', maleAudio: 'naproxen_male.mp3' },
  { id: '603', name: 'Diclofenac', categories: ['6'], molecularFormulas: 'C14H11Cl2NO2', description: '...', femaleAudio: 'diclofenac_female.mp3', maleAudio: 'diclofenac_male.mp3' },
  { id: '604', name: 'Celecoxib', categories: ['6'], molecularFormulas: 'C17H14F3N3O2S', description: '...', femaleAudio: 'celecoxib_female.mp3', maleAudio: 'celecoxib_male.mp3' },
  { id: '605', name: 'Aspirin', categories: ['6'], molecularFormulas: 'C9H8O4', description: '...', femaleAudio: 'aspirin_female.mp3', maleAudio: 'aspirin_male.mp3' },
  { id: '606', name: 'Meloxicam', categories: ['6'], molecularFormulas: 'C14H13N3O4S2', description: '...', femaleAudio: 'meloxicam_female.mp3', maleAudio: 'meloxicam_male.mp3' },
  { id: '607', name: 'Indomethacin', categories: ['6'], molecularFormulas: 'C19H16ClNO4', description: '...', femaleAudio: 'indomethacin_female.mp3', maleAudio: 'indomethacin_male.mp3' },
  { id: '608', name: 'Etodolac', categories: ['6'], molecularFormulas: 'C17H21NO3', description: '...', femaleAudio: 'etodolac_female.mp3', maleAudio: 'etodolac_male.mp3' },
  { id: '609', name: 'Piroxicam', categories: ['6'], molecularFormulas: 'C15H13N3O4S', description: '...', femaleAudio: 'piroxicam_female.mp3', maleAudio: 'piroxicam_male.mp3' },
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
