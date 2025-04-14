
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
import { EnumValues } from '@/types/enum';

interface EnumOption {
  id: string;
  value: string;
}

interface MultiSelectInputProps {
  value: EnumValues;
  options: EnumOption[];
  onValueChange: (value: EnumValues) => void;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ 
  value = [], 
  options = [], 
  onValueChange 
}) => {
  const [open, setOpen] = useState(false);
  
  // Safety check to ensure options and value are always arrays
  const safeOptions = Array.isArray(options) ? options : [];
  const safeValue = Array.isArray(value) ? value : [];

  const handleToggleOption = (optionId: string) => {
    const newValues = safeValue.includes(optionId)
      ? safeValue.filter(id => id !== optionId)
      : [...safeValue, optionId];
    onValueChange(newValues);
  };

  // Format the display value for the button
  const getDisplayValue = () => {
    if (safeValue.length === 0) return "Vyberte možnosti";
    
    // Map IDs to their display values
    const selectedLabels = safeValue.map(id => {
      const option = safeOptions.find(opt => opt.id === id);
      return option ? option.value : id;
    });
    
    return selectedLabels.length > 2 
      ? `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}` 
      : selectedLabels.join(', ');
  };

  const displayValue = getDisplayValue();

  return (
    <div className="w-full sheet-cell-edit-container">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="sheet-select-button truncate w-full"
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
                    onSelect={() => handleToggleOption(option.id)}
                  >
                    <div className="flex items-center w-full">
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          safeValue.includes(option.id) 
                            ? "opacity-100" 
                            : "opacity-0"
                        }`}
                      />
                      <span className="truncate">{option.value}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiSelectInput;
