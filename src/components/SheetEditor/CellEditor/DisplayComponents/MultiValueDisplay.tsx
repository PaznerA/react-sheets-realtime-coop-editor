
import React from 'react';

interface MultiValueDisplayProps {
  value: string[];
}

const MultiValueDisplay: React.FC<MultiValueDisplayProps> = ({ value }) => {
  if (!value || value.length === 0) return <div className="min-h-[24px]"></div>;
  
  return (
    <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap min-h-[24px] flex items-center">
      {value.join(', ')}
    </div>
  );
};

export default MultiValueDisplay;
