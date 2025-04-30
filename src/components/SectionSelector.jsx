// src/components/SectionSelector.jsx
import { getAllSections } from '../utils/sectionConfig';
import { motion } from 'framer-motion';

const SectionSelector = ({ activeSection, setActiveSection }) => {
  const sections = getAllSections();
  
  return (
    <div className="space-y-1.5 w-full">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => setActiveSection(section)}
          className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium transition-all duration-200 flex items-center group ${
            activeSection === section
              ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-l-2 border-transparent'
          }`}
        >
          <span className={`w-2 h-2 rounded-full mr-2 ${
            activeSection === section ? 'bg-blue-500' : 'bg-slate-600 group-hover:bg-slate-400'
          }`}></span>
          
          {section}
          
          {activeSection === section && (
            <motion.div 
              className="ml-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </button>
      ))}
    </div>
  );
};

export default SectionSelector;