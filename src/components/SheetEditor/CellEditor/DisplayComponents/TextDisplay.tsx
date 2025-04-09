
import React from 'react';

interface TextDisplayProps {
  value: string | number | string[] | null;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ value }) => {
  return (
    <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap min-h-[24px] flex items-center">
      {value !== null && value !== undefined ? String(value) : ""}
    </div>
  );
};

export default TextDisplay;
