import { drugData, drugCategory } from '../resources /resource';

// Convert drugs to the format expected by the app
export const drugs = drugData.map(drug => ({
  id: drug.id,
  name: drug.name,
  categories: drug.categories,
  molecularFormulas: drug.molecular_formula,
  description: drug.desc,
  femaleAudio: drug.sounds.find(s => s.gender === 'female')?.file || '',
  maleAudio: drug.sounds.find(s => s.gender === 'male')?.file || '',
  otherNames: drug.other_names || []
}));

// Convert categories to the format expected by the app
export const drugCategories = Object.keys(drugCategory).map(key => {
  const category = drugCategory[key];
  return {
    id: category.id,
    name: category.name,
    count: drugs.filter(drug => drug.categories.includes(category.id)).length
  };
});

// Helper functions
export const getDrugsByCategory = (categoryId) => {
  return drugs.filter(drug => drug.categories.includes(categoryId));
};

export const getCategoryNameById = (categoryId) => {
  return drugCategory[categoryId]?.name || 'Unknown';
};

export const getDrugById = (drugId) => {
  return drugs.find(drug => drug.id === drugId);
}