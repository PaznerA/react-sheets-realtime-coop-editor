
import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

interface NumberInputProps {
  value: number | null;
  integer: boolean;
  onValueChange: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  value, 
  integer,
  onValueChange 
}) => {
  const [inputValue, setInputValue] = useState(value !== null ? String(value) : '0');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsedValue = integer 
      ? parseInt(inputValue, 10) 
      : parseFloat(inputValue);
    
    onValueChange(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const parsedValue = integer 
        ? parseInt(inputValue, 10) 
        : parseFloat(inputValue);
      
      onValueChange(isNaN(parsedValue) ? 0 : parsedValue);
    } else if (e.key === 'Escape') {
      onValueChange(value || 0);
    }
  };

  return (
    <Input
      ref={inputRef}
      type="number"
      step={integer ? "1" : "0.01"}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="sheet-input h-8 py-1"
    />
  );
};

export default NumberInput;
