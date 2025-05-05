// This file maps audio filenames to static requires
// React Native can't use dynamic requires, so we need to map each filename to a static import

// Map for all female voice audio files
const femaleAudioMap = {
    "Celecoxib - female.wav": require('../resources/Celecoxib - female.wav'),
    "Chloramphenicol - female.wav": require('../resources/Chloramphenicol - female.wav'),
    "Dihydrocodeine - female.wav": require('../resources/Dihydrocodeine - female.wav'),
    "Diphenoxylate - female.wav": require('../resources/Diphenoxylate - female.wav'),
    "Doxylamine - female.wav": require('../resources/Doxylamine - female.wav'),
    "Famciclovir - female.wav": require('../resources/Famciclovir - female.wav'),
    "Fluconazole - female.wav": require('../resources/Fluconazole - female.wav'),
    "Glyceryl trinitrate - female.wav": require('../resources/Glyceryl trinitrate - female.wav'),
    "Hydrocortisone - female.wav": require('../resources/Hydrocortisone - female.wav'),
    "Ibuprofen - female.wav": require('../resources/Ibuprofen - female.wav'),
    "Levonorgestrel - female.wav": require('../resources/Levonorgestrel - female.wav'),
    "Melatonin - female.wav": require('../resources/Melatonin - female.wav'),
    "Metoclopramide - female.wav": require('../resources/Metoclopramide - female.wav'),
    "Naloxone - female.wav": require('../resources/Naloxone - female.wav'),
    "Pantoprazole - female.wav": require('../resources/Pantoprazole - female.wav'),
    "Paracetamol - female.wav": require('../resources/Paracetamol - female.wav'),
    "Prochlorperazine - female.wav": require('../resources/Prochlorperazine - female.wav'),
    "Promethazine - female.wav": require('../resources/Promethazine - female.wav'),
    "Pseudoephedrine - female.wav": require('../resources/Pseudoephedrine - female.wav'),
    "Salbutamol - female.wav": require('../resources/Salbutamol - female.wav'),
    "Sumatriptan - female.wav": require('../resources/Sumatriptan - female.wav'),
    "Terbutaline - female.wav": require('../resources/Terbutaline - female.wav'),
    "Triamcinolone - female.wav": require('../resources/Triamcinolone - female.wav'),
    "Ulipristal - female.wav": require('../resources/Ulipristal - female.wav'),
  };
  
  // Map for all male voice audio files
  const maleAudioMap = {
    "Celecoxib 1 - male.wav": require('../resources/Celecoxib 1 - male.wav'),
    "Chloramphenicol 1 - male.wav": require('../resources/Chloramphenicol 1 - male.wav'),
    "Diphenoxylate 1 - male.wav": require('../resources/Diphenoxylate 1 - male.wav'),
    "Famciclovir 1 - male.wav": require('../resources/Famciclovir 1 - male.wav'),
    "Fluconazole 1 - male.wav": require('../resources/Fluconazole 1 - male.wav'),
    "Glyceryl trinitrate 1 - male.wav": require('../resources/Glyceryl trinitrate 1 - male.wav'),
    "Hydrocortisone 1 - male.wav": require('../resources/Hydrocortisone 1 - male.wav'),
    "Ibuprofen 1 - male.wav": require('../resources/Ibuprofen 1 - male.wav'),
    "Levonorgestrel 1 - male.wav": require('../resources/Levonorgestrel 1 - male.wav'),
    "Melatonin 1 - male.wav": require('../resources/Melatonin 1 - male.wav'),
    "Naloxone 1 - male.wav": require('../resources/Naloxone 1 - male.wav'),
    "Pantoprazole 1 - male.wav": require('../resources/Pantoprazole 1 - male.wav'),
    "Paracetamol 1 - male.wav": require('../resources/Paracetamol 1 - male.wav'),
    "Promethazine 1 - male.wav": require('../resources/Promethazine 1 - male.wav'),
    "Pseudoephedrine 1 - male.wav": require('../resources/Pseudoephedrine 1 - male.wav'),
    "Salbutamol 1 - male.wav": require('../resources/Salbutamol 1 - male.wav'),
    "Sumatriptan 1 - male.wav": require('../resources/Sumatriptan 1 - male.wav'),
    "Terbutaline 1 - male.wav": require('../resources/Terbutaline 1 - male.wav'),
    "Triamcinolone 1 - male.wav": require('../resources/Triamcinolone 1 - male.wav'),
    "Ulipristal 1 - male.wav": require('../resources/Ulipristal 1 - male.wav'),
  };
  
  // Combined map to export
  export const soundsMap = {
    ...femaleAudioMap,
    ...maleAudioMap
  };
  
  // Helper function to get the audio file based on drug name and gender
  export const getAudioForDrug = (drugName, gender) => {
    const fileName = gender === 'female' 
      ? `${drugName} - female.wav` 
      : `${drugName} 1 - male.wav`;
    
    return soundsMap[fileName];
  };