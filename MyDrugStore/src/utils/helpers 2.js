// Helper functions for the Drug Speak app

// Format the molecular formula with proper subscripts
export const formatMolecularFormula = (formula) => {
    // This function would replace numbers with subscripts in real implementation
    // For milestone 1, we're using Unicode subscripts directly in the mock data
    return formula;
  };
  
  // Get drug categories as comma-separated string
  export const getCategoriesString = (drug, categoryMap) => {
    if (!drug || !drug.categories || drug.categories.length === 0) {
      return 'None';
    }
    
    return drug.categories
      .map(catId => categoryMap[catId] || 'Unknown')
      .join(', ');
  };
  
  // For audio playback (will be implemented in future milestones)
  export const playAudio = (audioFile, speed = 1.0) => {
    console.log(`Playing ${audioFile} at speed ${speed}`);
    // Actual audio playback would be implemented here
  };
  
  // For future milestones - calculate score for pronunciation
  export const calculateScore = (recordedAudio, referenceAudio) => {
    // This would be implemented in future milestones
    // For now, return a random score between 0-100
    return Math.floor(Math.random() * 101);
  };