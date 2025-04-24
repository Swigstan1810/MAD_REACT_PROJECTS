// Mock data for the Drug Speak app
// This simulates data that would be loaded from resources

export const drugCategories = [
  {
    id: '1',
    name: 'Antibiotics',
    count: 8,
  },
  {
    id: '2',
    name: 'Antivirals',
    count: 6,
  },
  {
    id: '3',
    name: 'Antifungals',
    count: 5,
  },
  {
    id: '4',
    name: 'Antihypertensives',
    count: 7,
  },
  {
    id: '5',
    name: 'Antidepressants',
    count: 6,
  },
  {
    id: '6',
    name: 'Anti-inflammatory',
    count: 9,
  },
];

export const drugs = [
  // Antibiotics
  {
    id: '101',
    name: 'Amoxicillin',
    categories: ['1'], // Belongs to Antibiotics
    molecularFormulas: 'C₁₆H₁₉N₃O₅S',
    description: 'A penicillin antibiotic that fights bacteria in your body. Used to treat many different types of infection caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.',
    femaleAudio: 'amoxicillin_female.mp3',
    maleAudio: 'amoxicillin_male.mp3',
  },
  {
    id: '102',
    name: 'Azithromycin',
    categories: ['1'], // Belongs to Antibiotics
    molecularFormulas: 'C₃₈H₇₂N₂O₁₂',
    description: 'A macrolide antibiotic that fights bacteria in the body. Used to treat many different types of infections caused by bacteria, such as respiratory infections, skin infections, ear infections, and sexually transmitted diseases.',
    femaleAudio: 'azithromycin_female.mp3',
    maleAudio: 'azithromycin_male.mp3',
  },
  {
    id: '103',
    name: 'Ciprofloxacin',
    categories: ['1'], // Belongs to Antibiotics
    molecularFormulas: 'C₁₇H₁₈FN₃O₃',
    description: 'A fluoroquinolone antibiotic that fights bacteria in the body. Used to treat different types of bacterial infections, including skin infections, bone and joint infections, respiratory or urinary tract infections, and certain types of diarrhea.',
    femaleAudio: 'ciprofloxacin_female.mp3',
    maleAudio: 'ciprofloxacin_male.mp3',
  },
  {
    id: '104',
    name: 'Doxycycline',
    categories: ['1'], // Belongs to Antibiotics
    molecularFormulas: 'C₂₂H₂₄N₂O₈',
    description: 'A tetracycline antibiotic that fights bacteria in the body. Used to treat many different bacterial infections, such as acne, urinary tract infections, intestinal infections, respiratory infections, eye infections, gonorrhea, chlamydia, syphilis, and others.',
    femaleAudio: 'doxycycline_female.mp3',
    maleAudio: 'doxycycline_male.mp3',
  },
  {
    id: '105',
    name: 'Erythromycin',
    categories: ['1'], // Belongs to Antibiotics
    molecularFormulas: 'C₃₇H₆₇NO₁₃',
    description: 'A macrolide antibiotic that fights bacteria in the body. Used to treat several types of infections, including respiratory tract infections, skin infections, chlamydia infections, pelvic inflammatory disease, and syphilis.',
    femaleAudio: 'erythromycin_female.mp3',
    maleAudio: 'erythromycin_male.mp3',
  },
  {
    id: '106',
    name: 'Penicillin',
    categories: ['1'], // Belongs to Antibiotics
    molecularFormulas: 'C₁₆H₁₈N₂O₄S',
    description: 'One of the first and still widely used antibiotics. Used to treat various bacterial infections including strep throat, pneumonia, and ear infections.',
    femaleAudio: 'penicillin_female.mp3',
    maleAudio: 'penicillin_male.mp3',
  },
  {
    id: '107',
    name: 'Tetracycline',
    categories: ['1'], // Belongs to Antibiotics
    molecularFormulas: 'C₂₂H₂₄N₂O₈',
    description: 'A broad-spectrum antibiotic used to treat a variety of infections. Its particularly effective against acne, urinary tract infections, gonorrhea, chlamydia, and rosacea.',
    femaleAudio: 'tetracycline_female.mp3',
    maleAudio: 'tetracycline_male.mp3',
  },
  {
    id: '108',
    name: 'Vancomycin',
    categories: ['1'], // Belongs to Antibiotics
    molecularFormulas: 'C₆₆H₇₅Cl₂N₉O₂₄',
    description: 'A glycopeptide antibiotic used to treat serious bacterial infections. It is particularly effective against infections caused by gram-positive bacteria including methicillin-resistant Staphylococcus aureus (MRSA).',
    femaleAudio: 'vancomycin_female.mp3',
    maleAudio: 'vancomycin_male.mp3',
  },
  
  // Antivirals
  {
    id: '201',
    name: 'Acyclovir',
    categories: ['2'], // Belongs to Antivirals
    molecularFormulas: 'C₈H₁₁N₅O₃',
    description: 'An antiviral medication used to treat herpes simplex virus infections, chickenpox, and shingles. It works by stopping the growth of the virus.',
    femaleAudio: 'acyclovir_female.mp3',
    maleAudio: 'acyclovir_male.mp3',
  },
  {
    id: '202',
    name: 'Oseltamivir',
    categories: ['2'], // Belongs to Antivirals
    molecularFormulas: 'C₁₆H₂₈N₂O₄',
    description: 'An antiviral medication used to treat and prevent influenza A and influenza B (flu). It blocks the actions of influenza virus neuraminidase, preventing the virus release from infected cells.',
    femaleAudio: 'oseltamivir_female.mp3',
    maleAudio: 'oseltamivir_male.mp3',
  },
  {
    id: '203',
    name: 'Ribavirin',
    categories: ['2', '4'], // Belongs to Antivirals and Antihypertensives
    molecularFormulas: 'C₈H₁₂N₄O₅',
    description: 'An antiviral medication used to treat RSV infection, hepatitis C, and viral hemorrhagic fevers. It stops viral replication by inhibiting viral RNA synthesis and viral mRNA capping.',
    femaleAudio: 'ribavirin_female.mp3',
    maleAudio: 'ribavirin_male.mp3',
  },
  
  // Add more drugs for each category...
  
  // Example of a drug belonging to multiple categories
  {
    id: '301',
    name: 'Fluconazole',
    categories: ['3', '6'], // Belongs to Antifungals and Anti-inflammatory
    molecularFormulas: 'C₁₃H₁₂F₂N₆O',
    description: 'An antifungal medication used to treat fungal infections including candidiasis, blastomycosis, coccidioidomycosis, cryptococcosis, histoplasmosis, dermatophytosis, and pityriasis versicolor.',
    femaleAudio: 'fluconazole_female.mp3',
    maleAudio: 'fluconazole_male.mp3',
  },
];

// Helper function to get drugs by category
export const getDrugsByCategory = (categoryId) => {
  return drugs.filter(drug => drug.categories.includes(categoryId));
};

// Helper function to get category name by ID
export const getCategoryNameById = (categoryId) => {
  const category = drugCategories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Unknown';
};

// Helper function to get drug by ID
export const getDrugById = (drugId) => {
  return drugs.find(drug => drug.id === drugId);
};