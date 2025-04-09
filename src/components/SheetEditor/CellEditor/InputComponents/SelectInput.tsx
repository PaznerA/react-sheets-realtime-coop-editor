
import React, { useState, useEffect } from 'react';
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

interface SelectInputProps {
  value: string | null;
  options: string[];
  onValueChange: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ 
  value, 
  options = [], // Default to empty array if options is undefined
  onValueChange 
}) => {
  const [open, setOpen] = useState(true);
  
  // Safety check to ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  const handleSelectOption = (selectedValue: string) => {
    onValueChange(selectedValue);
    setOpen(false);
  };

  // Add a useEffect to prevent rendering with empty options (which can cause the crash)
  useEffect(() => {
    // If no options available, close the popover
    if (safeOptions.length === 0) {
      setOpen(false);
    }
  }, [safeOptions]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 min-h-[32px]"
        >
          {value || "Vyberte možnost"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Hledat..." />
          <CommandEmpty>Žádné možnosti.</CommandEmpty>
          <CommandGroup>
            {safeOptions.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => handleSelectOption(option)}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === option ? "opacity-100" : "opacity-0"
                  }`}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectInput;
