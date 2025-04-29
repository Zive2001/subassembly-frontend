// src/utils/sectionConfig.js

// Define the mapping between workcenters and sections
// This is easily configurable - just add or modify entries as needed
const sectionConfig = {
    // Each section contains an array of workcenters
    'CUP': ['S2CU1', 'S2CU2', 'S2CU3'],
    'CENTER PART': ['S2CP1', 'S2CP2'],
    'MOTIF': ['S2MU', 'S2MU2'],
    // Add more sections as needed
  };
  
  // Create a reverse lookup from workcenter to section
  const workcenterToSection = {};
  Object.entries(sectionConfig).forEach(([section, workcenters]) => {
    workcenters.forEach(workcenter => {
      workcenterToSection[workcenter] = section;
    });
  });
  
  // Get all available sections
  const getAllSections = () => {
    return ['All', ...Object.keys(sectionConfig)];
  };
  
  // Get workcenters for a specific section
  // If section is 'All', return all workcenters
  const getWorkcentersBySection = (section, allWorkcenters) => {
    if (section === 'All') {
      return allWorkcenters;
    }
    return sectionConfig[section] || [];
  };
  
  // Get section for a workcenter
  const getSectionForWorkcenter = (workcenter) => {
    return workcenterToSection[workcenter] || 'Other';
  };
  
  export {
    sectionConfig,
    getAllSections,
    getWorkcentersBySection,
    getSectionForWorkcenter
  };