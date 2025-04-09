
import React from 'react';

interface TextDisplayProps {
  value: string | number | string[] | null;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ value }) => {
  // Handle undefined values
  if (value === undefined) {
    return <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap min-h-[24px] flex items-center"></div>;
  }
  
  // Handle array values specially
  if (Array.isArray(value)) {
    return (
      <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap min-h-[24px] flex items-center">
        {value.join(', ')}
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap min-h-[24px] flex items-center">
      {value !== null ? String(value) : ""}
    </div>
  );
};

export default TextDisplay;
