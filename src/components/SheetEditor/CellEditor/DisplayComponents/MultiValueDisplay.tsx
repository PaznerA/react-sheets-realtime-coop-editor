
import React from 'react';

interface MultiValueDisplayProps {
  value: string[];
}

const MultiValueDisplay: React.FC<MultiValueDisplayProps> = ({ value }) => {
  // Ensure value is always an array, even if null or undefined
  const safeValue = Array.isArray(value) ? value : [];
  
  if (safeValue.length === 0) return <div className="min-h-[24px]"></div>;
  
  return (
    <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap min-h-[24px] flex items-center">
      {safeValue.join(', ')}
    </div>
  );
};

export default MultiValueDisplay;
