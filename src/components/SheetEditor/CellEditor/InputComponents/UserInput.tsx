
import React, { useRef, useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UserInputProps {
  value: string | null;
  onValueChange: (value: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ value, onValueChange }) => {
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
    <div className="flex items-center h-8 w-full overflow-hidden">
      <User className="h-4 w-4 mr-2 shrink-0" />
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="sheet-input h-7 p-0"
      />
    </div>
  );
};

export default UserInput;
