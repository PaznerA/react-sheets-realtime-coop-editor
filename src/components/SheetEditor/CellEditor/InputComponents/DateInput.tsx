
import React, { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

interface DateInputProps {
  value: string | null;
  onValueChange: (value: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ value, onValueChange }) => {
  const [open, setOpen] = useState(true);
  
  const parseDate = (dateStr: string | null) => {
    if (!dateStr) return undefined;
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? undefined : date;
    } catch (e) {
      return undefined;
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      onValueChange(formattedDate);
      setOpen(false);
    }
  };

  const parsedDate = parseDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal h-8"
        >
          {parsedDate 
            ? format(parsedDate, 'PP', { locale: cs }) 
            : 'Vyberte datum'}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={handleDateSelect}
          locale={cs}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateInput;
