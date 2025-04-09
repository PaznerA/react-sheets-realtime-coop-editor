
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  Check, 
  ChevronsUpDown,
  User
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Cell as CellType, CellDefinition } from '@/types/sheet';

interface CellProps {
  cell: CellType;
  column: CellDefinition;
  isEditing: boolean;
  onStartEdit: () => void;
  onFinishEdit: (value: string | number | string[] | null) => void;
}

const Cell: React.FC<CellProps> = ({ 
  cell, 
  column, 
  isEditing, 
  onStartEdit, 
  onFinishEdit 
}) => {
  const [value, setValue] = useState<string | number | string[] | null>(cell.value);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setValue(cell.value);
  }, [cell.value]);

  const handleDblClick = () => {
    if (!isEditing) {
      onStartEdit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Handle different data types
    if (column.type === 'int') {
      const intValue = parseInt(inputValue, 10);
      setValue(isNaN(intValue) ? 0 : intValue);
    } else if (column.type === 'float') {
      const floatValue = parseFloat(inputValue);
      setValue(isNaN(floatValue) ? 0 : floatValue);
    } else {
      setValue(inputValue);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      onFinishEdit(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onFinishEdit(value);
    } else if (e.key === 'Escape') {
      setValue(cell.value); // Reset to original value
      onFinishEdit(cell.value);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setValue(formattedDate);
      onFinishEdit(formattedDate);
      setOpen(false);
    }
  };

  const handleSelectOption = (selectedValue: string) => {
    setValue(selectedValue);
    onFinishEdit(selectedValue);
    setOpen(false);
  };

  // Render different cell types
  const renderCellContent = () => {
    if (isEditing) {
      switch (column.type) {
        case 'date':
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-8"
                >
                  {value ? format(new Date(value.toString()), 'PP', { locale: cs }) : 'Vyberte datum'}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value.toString()) : undefined}
                  onSelect={handleDateSelect}
                  locale={cs}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          );

        case 'select':
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-8"
                >
                  {value || "Vyberte možnost"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Hledat..." />
                  <CommandEmpty>Žádné možnosti.</CommandEmpty>
                  <CommandGroup>
                    {Array.isArray(column.options) && column.options.map((option) => (
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

        case 'multiselect':
          // Simplified multiselect - in a full implementation would need more complex UI
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-8"
                >
                  {Array.isArray(value) && value.length > 0 
                    ? value.join(', ') 
                    : "Vyberte možnosti"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Hledat..." />
                  <CommandEmpty>Žádné možnosti.</CommandEmpty>
                  <CommandGroup>
                    {Array.isArray(column.options) && column.options.map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => {
                          // Toggle selected values for multiselect
                          const currentValues = Array.isArray(value) ? [...value] : [];
                          const newValues = currentValues.includes(option)
                            ? currentValues.filter(v => v !== option)
                            : [...currentValues, option];
                          setValue(newValues);
                          onFinishEdit(newValues);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            Array.isArray(value) && value.includes(option) 
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
            </Popover>
          );

        case 'user':
          // Simplified user selector
          return (
            <div className="flex items-center h-8 px-2 border rounded">
              <User className="h-4 w-4 mr-2" />
              <Input
                ref={inputRef}
                value={value?.toString() || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-7 p-0"
              />
            </div>
          );
          
        default:
          return (
            <Input
              ref={inputRef}
              value={value?.toString() || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="h-8 py-1"
            />
          );
      }
    } else {
      // Display mode
      switch (column.type) {
        case 'date':
          return value 
            ? format(new Date(value.toString()), 'PP', { locale: cs }) 
            : null;
        
        case 'multiselect':
          return Array.isArray(value) ? value.join(', ') : value;
          
        case 'user':
          return (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-gray-500" />
              <span>{value}</span>
            </div>
          );
          
        default:
          return value;
      }
    }
  };

  // For column headers
  if (column.id === 'name' && cell.value && !cell.columnId) {
    return (
      <div className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
        {cell.value}
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-full min-h-[32px] px-2 flex items-center ${
        isEditing ? '' : 'cursor-cell'
      }`}
      onDoubleClick={handleDblClick}
    >
      {renderCellContent()}
    </div>
  );
};

export default Cell;
