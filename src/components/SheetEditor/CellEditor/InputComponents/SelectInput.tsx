
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

interface SelectInputProps {
  value: string | null;
  options: string[];
  onValueChange: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ 
  value, 
  options = [], 
  onValueChange 
}) => {
  const [open, setOpen] = useState(false);
  
  // Safety check to ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  const handleSelectOption = (selectedValue: string) => {
    onValueChange(selectedValue);
    setOpen(false);
  };

  // Display the current value or a placeholder
  const displayValue = value || "Vyberte možnost";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 min-h-[32px]"
        >
          <span className="truncate">{displayValue}</span>
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
