// src/utils/sectionConfig.js


// This is easily configurable - just add or modify entries as needed
const sectionConfig = {
    // Each section contains an array of workcenters
    'CUP': ['S2CU1', 'S2CU2', 'S2CU3', 'S2CU4'],
    'CENTER PART': ['S2CP1', 'S2CP2'],
    'MOTIF': ['S2MU', 'S2MU1'],
    'LABEL': ['S2LU', 'S2LU1'],
    
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
    return workcenterToSection[workcenter] || 'OTHER';
  };
  
  export {
    sectionConfig,
    getAllSections,
    getWorkcentersBySection,
    getSectionForWorkcenter
  };