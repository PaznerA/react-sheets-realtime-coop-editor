
import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

interface TextInputProps {
  value: string | null;
  onValueChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onValueChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Select all text when starting edit
      inputRef.current.select();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    onValueChange(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onValueChange(inputValue);
    } else if (e.key === 'Escape') {
      onValueChange(value || '');
    }
  };

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="h-8 py-1 w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
};

export default TextInput;
