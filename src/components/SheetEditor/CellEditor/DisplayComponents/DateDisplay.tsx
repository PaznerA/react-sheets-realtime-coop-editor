
import React from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface DateDisplayProps {
  value: string | null;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ value }) => {
  if (!value) return <div className="min-h-[24px]"></div>;
  
  try {
    return (
      <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap min-h-[24px] flex items-center">
        {format(new Date(value), 'PP', { locale: cs })}
      </div>
    );
  } catch (e) {
    return <div className="min-h-[24px]">{value}</div>;
  }
};

export default DateDisplay;
