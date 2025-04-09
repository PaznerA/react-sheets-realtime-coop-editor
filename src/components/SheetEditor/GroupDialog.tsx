
import React, { useState } from 'react';
import { 
  FolderPlus, 
  X, 
  Check 
} from 'lucide-react';
import { useSheet } from '@/contexts/SheetContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface GroupDialogProps {
  onSelectForGroup: (rowId: string) => void;
  selectedRows: string[];
  clearSelection: () => void;
}

const GroupDialog: React.FC<GroupDialogProps> = ({ 
  onSelectForGroup, 
  selectedRows,
  clearSelection
}) => {
  const { createGroup } = useSheet();
  const [groupName, setGroupName] = useState('');
  const [open, setOpen] = useState(false);

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedRows.length > 0) {
      createGroup(groupName, selectedRows);
      setGroupName('');
      setOpen(false);
      clearSelection();
      toast.success('Skupina byla vytvořena.');
    } else if (!groupName.trim()) {
      toast.error('Zadejte prosím název skupiny.');
    } else {
      toast.error('Vyberte alespoň jeden řádek pro skupinu.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          disabled={selectedRows.length === 0}
        >
          <FolderPlus className="h-4 w-4" />
          <span>Vytvořit skupinu ({selectedRows.length})</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vytvořit novou skupinu</DialogTitle>
          <DialogDescription>
            Vybrané řádky budou zařazeny do nové skupiny.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <label className="text-sm font-medium">Název skupiny</label>
          <Input
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder="Název skupiny"
            className="mt-1"
          />
          
          <div className="mt-4">
            <label className="text-sm font-medium">Vybrané řádky: {selectedRows.length}</label>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            <X className="h-4 w-4 mr-1" />
            Zrušit
          </Button>
          <Button onClick={handleCreateGroup}>
            <Check className="h-4 w-4 mr-1" />
            Vytvořit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDialog;
