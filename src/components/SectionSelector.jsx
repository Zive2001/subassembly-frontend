// src/components/SectionSelector.jsx
import { getAllSections } from '../utils/sectionConfig';

const SectionSelector = ({ activeSection, setActiveSection }) => {
  const sections = getAllSections();
  
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => setActiveSection(section)}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            activeSection === section
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {section}
        </button>
      ))}
    </div>
  );
};

export default SectionSelector;