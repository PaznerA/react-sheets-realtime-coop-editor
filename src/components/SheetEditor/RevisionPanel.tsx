
import React, { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { 
  History, 
  Check, 
  X, 
  RotateCcw 
} from 'lucide-react';
import { useSheet } from '@/contexts/SheetContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

const RevisionPanel: React.FC = () => {
  const { sheetData, saveRevision, loadRevision } = useSheet();
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);

  const handleSaveRevision = () => {
    if (description.trim()) {
      saveRevision(description);
      setDescription('');
      toast.success('Revize byla uložena.');
    } else {
      toast.error('Zadejte prosím popis revize.');
    }
  };

  const handleLoadRevision = (index: number) => {
    loadRevision(index);
    setOpen(false);
    toast.info('Revize byla načtena.');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span>Historie verzí</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Historie verzí</SheetTitle>
          <SheetDescription>
            Spravujte historie změn a obnovte předchozí verze.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Uložit aktuální stav</h3>
              <div className="mt-2 flex space-x-2">
                <Input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Popis změn"
                  className="flex-1"
                />
                <Button onClick={handleSaveRevision} size="sm">
                  <Check className="h-4 w-4 mr-1" />
                  Uložit
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Historie verzí</h3>
              {sheetData.revisions.length === 0 ? (
                <p className="text-sm text-gray-500">Zatím nebyly uloženy žádné revize.</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {sheetData.revisions.map((revision, index) => (
                    <div 
                      key={revision.id}
                      className={`p-2 border rounded flex justify-between items-center ${
                        sheetData.currentRevision === index ? 'bg-sheet-highlight border-indigo-300' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium">{revision.description}</div>
                        <div className="text-xs text-gray-500">
                          {format(revision.timestamp, 'PPp', { locale: cs })}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLoadRevision(index)}
                        disabled={sheetData.currentRevision === index}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Obnovit
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">
              <X className="h-4 w-4 mr-1" />
              Zavřít
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RevisionPanel;
