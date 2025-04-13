
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
import { EnumValueId } from '@/types/enum';

interface EnumOption {
  id: string;
  value: string;
}

interface SelectInputProps {
  value: EnumValueId | null;
  options: EnumOption[];
  onValueChange: (value: EnumValueId) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ 
  value, 
  options = [], 
  onValueChange 
}) => {
  const [open, setOpen] = useState(false);
  
  // Safety check to ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  const handleSelectOption = (selectedId: string) => {
    onValueChange(selectedId);
    setOpen(false);
  };

  // Find the display value for the current selected option
  const getDisplayValue = () => {
    if (!value) return "Vyberte možnost";
    
    const selectedOption = safeOptions.find(opt => opt.id === value);
    return selectedOption ? selectedOption.value : "Vyberte možnost";
  };

  const displayValue = getDisplayValue();

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
        {/* Only render Command when the popover is open */}
        {open && (
          <Command>
            <CommandInput placeholder="Hledat..." />
            <CommandEmpty>Žádné možnosti.</CommandEmpty>
            <CommandGroup>
              {safeOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.value} // Use value for searching
                  onSelect={() => handleSelectOption(option.id)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === option.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SelectInput;
