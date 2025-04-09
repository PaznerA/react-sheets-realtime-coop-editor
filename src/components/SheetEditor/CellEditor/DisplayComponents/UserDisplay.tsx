
import React from 'react';
import { User } from 'lucide-react';

interface UserDisplayProps {
  value: string | null;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ value }) => {
  if (!value) return <div className="min-h-[24px]"></div>;
  
  return (
    <div className="flex items-center min-h-[24px] w-full">
      <User className="h-4 w-4 mr-1 text-gray-500 shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
};

export default UserDisplay;
