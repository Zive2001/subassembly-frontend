// src/components/DebugDisplay.jsx
const DebugDisplay = ({ productionData }) => {
    if (!productionData) return null;
  
    return (
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Data Structure:</h3>
        <pre className="bg-gray-900 p-2 rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(productionData, null, 2)}
        </pre>
      </div>
    );
  };
  
  export default DebugDisplay;