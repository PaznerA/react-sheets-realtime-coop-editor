
import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';

interface MultiSelectInputProps {
  value: string[];
  options: string[];
  onValueChange: (value: string[]) => void;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ 
  value = [], // Default to empty array if value is undefined
  options = [], // Default to empty array if options is undefined
  onValueChange 
}) => {
  // Start with open=false to prevent initial render errors with empty options
  const [open, setOpen] = useState(false);
  
  // Safety check to ensure options and value are always arrays
  const safeOptions = Array.isArray(options) ? options : [];
  const safeValue = Array.isArray(value) ? value : [];

  const handleToggleOption = (option: string) => {
    const newValues = safeValue.includes(option)
      ? safeValue.filter(v => v !== option)
      : [...safeValue, option];
    onValueChange(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 min-h-[32px]"
        >
          {safeValue.length > 0 
            ? safeValue.join(', ') 
            : "Vyberte možnosti"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {safeOptions.length > 0 && (
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Hledat..." />
            <CommandEmpty>Žádné možnosti.</CommandEmpty>
            <CommandGroup>
              {safeOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleToggleOption(option)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      safeValue.includes(option) 
                        ? "opacity-100" 
                        : "opacity-0"
                    }`}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default MultiSelectInput;
